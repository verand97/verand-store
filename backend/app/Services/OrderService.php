<?php

namespace App\Services;

use App\Models\JokiOrder;
use App\Models\Notification;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Services\Kafka\TransactionQueue;
use App\Services\Midtrans\MidtransService;
use App\Services\Topup\TopupService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderService
{
    public function __construct(
        private MidtransService $midtrans,
        private TransactionQueue $queue,
        private TopupService $topup,
    ) {}

    /**
     * Create an order with its items (and joki detail when applicable).
     *
     * @param  array  $data  validated payload from the controller
     */
    public function create(int $userId, array $data): Order
    {
        return DB::transaction(function () use ($userId, $data) {
            $items = $data['items'];
            $total = 0;

            $order = Order::create([
                'order_number' => 'VS'.now()->format('ymd').strtoupper(Str::random(5)),
                'user_id' => $userId,
                'type' => $data['type'],
                'total_amount' => 0,
                'status' => 'pending',
                'payment_status' => 'unpaid',
                'meta' => $data['meta'] ?? null,
            ]);

            foreach ($items as $item) {
                $product = Product::find($item['product_id'] ?? null);
                $price = $product ? (float) $product->price : (float) ($item['price'] ?? 0);
                $qty = (int) ($item['quantity'] ?? 1);
                $total += $price * $qty;

                $order->items()->create([
                    'product_id' => $product?->id,
                    'name' => $product?->name ?? ($item['name'] ?? 'Item'),
                    'price' => $price,
                    'quantity' => $qty,
                    'options' => $item['options'] ?? null,
                ]);
            }

            $order->update(['total_amount' => $total]);

            // For joki orders, create the work record and mark waiting for account.
            if ($data['type'] === 'joki') {
                $joki = $data['joki'] ?? [];
                JokiOrder::create([
                    'order_id' => $order->id,
                    'game' => $joki['game'] ?? ($data['meta']['game'] ?? 'unknown'),
                    'service' => $joki['service'] ?? 'general',
                    'game_uid' => $joki['game_uid'] ?? null,
                    'game_server' => $joki['game_server'] ?? null,
                    'targets' => $joki['targets'] ?? null,
                    'eta' => $joki['eta'] ?? null,
                ]);
            }

            $this->notify($order->user_id, 'Pesanan dibuat', "Pesanan {$order->order_number} menunggu pembayaran.", 'order');

            return $order->load('items', 'jokiOrder');
        });
    }

    /**
     * Initialise a payment for an order via Midtrans.
     */
    public function pay(Order $order): Payment
    {
        $tx = $this->midtrans->createTransaction($order);

        $payment = Payment::updateOrCreate(
            ['order_id' => $order->id],
            [
                'gateway' => 'midtrans',
                'reference' => $tx['reference'],
                'amount' => $order->total_amount,
                'status' => 'pending',
                'snap_token' => $tx['snap_token'],
                'redirect_url' => $tx['redirect_url'],
            ]
        );

        $this->queue->publish(TransactionQueue::TOPIC_PAYMENT_CREATED, [
            'order_number' => $order->order_number,
            'amount' => (float) $order->total_amount,
        ]);

        return $payment;
    }

    /**
     * Handle a verified payment success: advance the order workflow and queue
     * downstream processing (topup delivery or joki assignment).
     */
    public function markPaid(Order $order, array $payload = []): void
    {
        DB::transaction(function () use ($order, $payload) {
            $order->payment?->update([
                'status' => 'paid',
                'paid_at' => now(),
                'payload' => $payload ?: $order->payment?->payload,
                'method' => $payload['payment_type'] ?? $order->payment?->method,
            ]);

            $order->update(['payment_status' => 'paid']);

            $this->queue->publish(TransactionQueue::TOPIC_PAYMENT_SUCCESS, [
                'order_number' => $order->order_number,
            ]);

            if ($order->type === 'topup') {
                $this->processTopup($order);
            } else {
                // Joki: needs customer account before work starts.
                $order->update(['status' => 'waiting_for_account']);
                $this->queue->publish(TransactionQueue::TOPIC_JOKI_PROCESS, [
                    'order_number' => $order->order_number,
                ]);
            }

            $this->notify($order->user_id, 'Pembayaran berhasil',
                "Pembayaran pesanan {$order->order_number} terverifikasi.", 'payment');
        });
    }

    private function processTopup(Order $order): void
    {
        $order->update(['status' => 'processing']);
        $this->queue->publish(TransactionQueue::TOPIC_TOPUP_PROCESS, [
            'order_number' => $order->order_number,
        ]);

        // Deliver each topup item (stubbed provider).
        foreach ($order->items as $item) {
            $opts = $item->options ?? [];
            $this->topup->deliver(
                $opts['game'] ?? ($order->meta['game'] ?? 'unknown'),
                $opts['uid'] ?? '',
                (int) ($item->product?->quantity ?? $item->quantity),
                $opts['server'] ?? null,
            );
        }

        $order->update(['status' => 'finished']);
        $this->notify($order->user_id, 'Top-up selesai',
            "Top-up pesanan {$order->order_number} telah dikirim.", 'order');
    }

    /**
     * Advance a joki order through its workflow states with validation.
     */
    public function transition(Order $order, string $to): Order
    {
        $allowed = [
            'pending' => ['waiting_for_account', 'cancelled'],
            'waiting_for_account' => ['processing', 'cancelled'],
            'processing' => ['completed', 'cancelled'],
            'completed' => ['finished'],
            'finished' => [],
            'cancelled' => [],
        ];

        if (! in_array($to, $allowed[$order->status] ?? [], true)) {
            abort(422, "Tidak dapat mengubah status dari {$order->status} ke {$to}.");
        }

        $order->update(['status' => $to]);

        $this->queue->publish(TransactionQueue::TOPIC_PROGRESS_UPDATE, [
            'order_number' => $order->order_number,
            'status' => $to,
        ]);

        $this->notify($order->user_id, 'Status pesanan diperbarui',
            "Pesanan {$order->order_number} kini berstatus ".str_replace('_', ' ', $to).'.', 'progress');

        return $order;
    }

    private function notify(int $userId, string $title, string $body, string $type): void
    {
        Notification::create([
            'user_id' => $userId,
            'title' => $title,
            'body' => $body,
            'type' => $type,
        ]);

        $this->queue->publish(TransactionQueue::TOPIC_NOTIFICATION, [
            'user_id' => $userId,
            'title' => $title,
        ]);
    }
}
