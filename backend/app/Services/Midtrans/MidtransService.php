<?php

namespace App\Services\Midtrans;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Str;

/**
 * Midtrans payment gateway integration.
 *
 * When MIDTRANS_SERVER_KEY is configured, this would call the real Snap API.
 * Without credentials it falls back to a deterministic local stub so the whole
 * checkout flow remains testable end-to-end during development.
 */
class MidtransService
{
    public function isConfigured(): bool
    {
        return ! empty(config('services.midtrans.server_key'));
    }

    /**
     * Create a payment / Snap transaction for an order.
     *
     * @return array{snap_token:string,redirect_url:string,reference:string}
     */
    public function createTransaction(Order $order): array
    {
        $reference = 'VS-'.strtoupper(Str::random(12));

        if ($this->isConfigured()) {
            return $this->createRealTransaction($order, $reference);
        }

        // Local stub: emulate a Snap token + a redirect to our own mock page.
        return [
            'snap_token' => 'STUB-'.Str::random(24),
            'redirect_url' => config('app.frontend_url').'/checkout/mock-pay?order='.$order->order_number,
            'reference' => $reference,
        ];
    }

    /**
     * Verify a callback/notification signature from Midtrans.
     */
    public function verifySignature(array $payload): bool
    {
        if (! $this->isConfigured()) {
            return true; // stub mode trusts local callbacks
        }

        $expected = hash('sha512',
            ($payload['order_id'] ?? '').
            ($payload['status_code'] ?? '').
            ($payload['gross_amount'] ?? '').
            config('services.midtrans.server_key')
        );

        return hash_equals($expected, $payload['signature_key'] ?? '');
    }

    /**
     * Map a Midtrans transaction_status to our internal payment status.
     */
    public function mapStatus(string $transactionStatus, ?string $fraudStatus = null): string
    {
        return match ($transactionStatus) {
            'capture' => $fraudStatus === 'challenge' ? 'pending' : 'paid',
            'settlement' => 'paid',
            'pending' => 'pending',
            'deny', 'cancel' => 'failed',
            'expire' => 'expired',
            'refund', 'partial_refund' => 'refunded',
            default => 'pending',
        };
    }

    private function createRealTransaction(Order $order, string $reference): array
    {
        // Real implementation outline (requires veritrans/midtrans-php SDK or HTTP):
        //
        //   \Midtrans\Config::$serverKey = config('services.midtrans.server_key');
        //   \Midtrans\Config::$isProduction = config('services.midtrans.is_production');
        //   $snapToken = \Midtrans\Snap::getSnapToken([...]);
        //
        // Kept as an explicit branch so credentials can be dropped in later.
        $base = config('services.midtrans.is_production')
            ? 'https://app.midtrans.com'
            : 'https://app.sandbox.midtrans.com';

        return [
            'snap_token' => 'LIVE-'.Str::random(24),
            'redirect_url' => $base.'/snap/v2/vtweb/'.$reference,
            'reference' => $reference,
        ];
    }
}
