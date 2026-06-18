<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Services\Midtrans\MidtransService;
use App\Services\OrderService;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(
        private OrderService $orders,
        private MidtransService $midtrans,
    ) {}

    /**
     * Create a payment / Snap token for an order.
     */
    public function pay(Request $request, Order $order)
    {
        abort_unless($order->user_id === $request->user()->id, 403);

        if ($order->payment_status === 'paid') {
            return response()->json(['message' => 'Pesanan sudah dibayar.'], 422);
        }

        $payment = $this->orders->pay($order);

        return response()->json([
            'snap_token' => $payment->snap_token,
            'redirect_url' => $payment->redirect_url,
            'client_key' => config('services.midtrans.client_key'),
            'is_stub' => ! $this->midtrans->isConfigured(),
        ]);
    }

    /**
     * Midtrans webhook / callback endpoint (no auth, signature-verified).
     */
    public function callback(Request $request)
    {
        $payload = $request->all();

        if (! $this->midtrans->verifySignature($payload)) {
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        $reference = $payload['order_id'] ?? null;
        $payment = Payment::where('reference', $reference)
            ->orWhereHas('order', fn ($q) => $q->where('order_number', $reference))
            ->first();

        if (! $payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        $status = $this->midtrans->mapStatus(
            $payload['transaction_status'] ?? 'pending',
            $payload['fraud_status'] ?? null
        );

        if ($status === 'paid' && $payment->status !== 'paid') {
            $this->orders->markPaid($payment->order, $payload);
        } elseif (in_array($status, ['failed', 'expired'], true)) {
            $payment->update(['status' => $status, 'payload' => $payload]);
            $payment->order->update(['payment_status' => 'failed']);
        }

        return response()->json(['message' => 'OK']);
    }

    /**
     * Development helper to simulate a successful payment when running the
     * stub gateway (no real Midtrans keys).
     */
    public function mockConfirm(Request $request, Order $order)
    {
        abort_if($this->midtrans->isConfigured(), 403, 'Mock dinonaktifkan saat Midtrans aktif.');
        abort_unless($order->user_id === $request->user()->id, 403);

        $this->orders->markPaid($order, ['payment_type' => 'qris', 'transaction_status' => 'settlement']);

        return response()->json($order->fresh()->load('payment', 'jokiOrder'));
    }
}
