<?php

namespace App\Services\AI;

use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Str;

/**
 * Rule-based NLP assistant. Answers FAQs, reports order status, helps file
 * complaints, and gives ETA estimates. When AI_MODE=remote it would proxy to an
 * external microservice (ai-service/chatbot) instead.
 */
class ChatbotService
{
    public function reply(string $message, ?User $user = null): array
    {
        $text = Str::lower(trim($message));

        // 1) Order status intent: look for an order number in the message.
        if (preg_match('/vs-?\w+|#?\d{4,}/i', $message, $m)) {
            if ($status = $this->lookupOrder($m[0], $user)) {
                return $this->answer($status, 'order-status');
            }
        }

        // 2) Intent classification by keywords.
        $intents = [
            'eta' => ['berapa lama', 'estimasi', 'eta', 'how long', 'durasi', 'selesai'],
            'payment' => ['bayar', 'pembayaran', 'payment', 'midtrans', 'qris', 'va', 'transfer'],
            'complaint' => ['komplain', 'complaint', 'refund', 'masalah', 'gagal', 'error', 'protes'],
            'joki' => ['joki', 'rank', 'boost', 'mythic', 'eksplorasi', 'story', 'farming'],
            'topup' => ['topup', 'top up', 'diamond', 'voucher', 'crystal', 'genesis'],
            'greeting' => ['halo', 'hai', 'hello', 'pagi', 'siang', 'malam', 'help', 'bantuan'],
        ];

        foreach ($intents as $intent => $keywords) {
            foreach ($keywords as $kw) {
                if (Str::contains($text, $kw)) {
                    return $this->answer($this->responseFor($intent), $intent);
                }
            }
        }

        return $this->answer(
            'Maaf, saya belum menangkap maksud Anda. Anda bisa bertanya soal status pesanan '.
            '(sebutkan nomor order), estimasi pengerjaan, metode pembayaran, atau layanan joki & top-up.',
            'fallback'
        );
    }

    private function lookupOrder(string $needle, ?User $user): ?string
    {
        $number = ltrim($needle, '#');
        $query = Order::query()->where('order_number', 'like', "%{$number}%");

        if ($user && ! $user->isAdmin()) {
            $query->where('user_id', $user->id);
        }

        $order = $query->latest()->first();

        if (! $order) {
            return null;
        }

        $statusLabel = str_replace('_', ' ', $order->status);

        return "Pesanan {$order->order_number} berstatus *{$statusLabel}* ".
            "(pembayaran: {$order->payment_status}). Total: Rp ".number_format((float) $order->total_amount, 0, ',', '.').'.';
    }

    private function responseFor(string $intent): string
    {
        return match ($intent) {
            'eta' => 'Estimasi pengerjaan: top-up instan 1-5 menit setelah pembayaran terverifikasi. '.
                'Joki rank ML 1-3 hari tergantung target. Perawatan akun Genshin/HSR berjalan harian sesuai paket.',
            'payment' => 'Kami menerima QRIS, Virtual Account, e-wallet, dan transfer bank melalui Midtrans. '.
                'Status pesanan otomatis menjadi Processing setelah pembayaran terverifikasi.',
            'complaint' => 'Maaf atas kendalanya. Ceritakan nomor order dan masalahnya, tim kami akan menindaklanjuti. '.
                'Untuk transaksi gagal, dana otomatis diproses refund sesuai kebijakan.',
            'joki' => 'Layanan joki kami mencakup Mobile Legends (Rank Boost, Winrate, MMR, Placement, Event), '.
                'serta Genshin & HSR (perawatan akun, story, eksplorasi). Pilih layanan di halaman Joki.',
            'topup' => 'Top-up tersedia untuk Mobile Legends, Genshin Impact, dan Honkai: Star Rail. '.
                'Masukkan UID & server, pilih nominal, lalu bayar. Saldo dikirim otomatis.',
            'greeting' => 'Halo! Saya asisten Verand Store. Saya bisa bantu cek status pesanan, info pembayaran, '.
                'estimasi pengerjaan, dan rekomendasi layanan. Ada yang bisa dibantu?',
            default => 'Ada yang bisa saya bantu seputar top-up atau jasa joki?',
        };
    }

    private function answer(string $text, string $intent): array
    {
        return ['reply' => $text, 'intent' => $intent];
    }
}
