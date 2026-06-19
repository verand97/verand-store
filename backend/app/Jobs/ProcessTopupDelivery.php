<?php

namespace App\Jobs;

use App\Models\Order;
use App\Services\Topup\TopupService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * Delivers in-game currency for each item of a paid top-up order.
 */
class ProcessTopupDelivery implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public int $orderId) {}

    public function handle(TopupService $topup): void
    {
        $order = Order::with('items.product')->find($this->orderId);
        if (! $order) {
            return;
        }

        foreach ($order->items as $item) {
            $opts = $item->options ?? [];
            $topup->deliver(
                $opts['game'] ?? ($order->meta['game'] ?? 'unknown'),
                $opts['uid'] ?? '',
                (int) ($item->product?->quantity ?? $item->quantity),
                $opts['server'] ?? null,
            );
        }
    }
}
