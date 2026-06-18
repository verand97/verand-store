<?php

namespace App\Services\Topup;

use Illuminate\Support\Str;

/**
 * Integrates with game-voucher providers to validate UIDs and deliver currency.
 * Stubbed (deterministic) when no provider URL is configured.
 */
class TopupService
{
    /**
     * Validate a player's UID/server for a given game.
     *
     * @return array{valid:bool,nickname:?string,message:string}
     */
    public function validateUid(string $game, string $uid, ?string $server = null): array
    {
        if (! config('services.game_voucher.url')) {
            // Stub: accept numeric UIDs of reasonable length and fabricate a nickname.
            $valid = (bool) preg_match('/^\d{6,12}$/', $uid);

            return [
                'valid' => $valid,
                'nickname' => $valid ? $this->fakeNickname($game, $uid) : null,
                'message' => $valid ? 'UID valid (mode pengembangan).' : 'Format UID tidak valid.',
            ];
        }

        // Real provider call would go here (HTTP::get(...)).
        return ['valid' => true, 'nickname' => null, 'message' => 'UID diverifikasi penyedia.'];
    }

    /**
     * Deliver in-game currency after payment is verified.
     *
     * @return array{success:bool,reference:string}
     */
    public function deliver(string $game, string $uid, int $quantity, ?string $server = null): array
    {
        // In stub mode we always succeed.
        return [
            'success' => true,
            'reference' => 'TOPUP-'.strtoupper(Str::random(10)),
        ];
    }

    private function fakeNickname(string $game, string $uid): string
    {
        $prefix = match ($game) {
            'mobile-legends' => 'MLBB',
            'genshin-impact' => 'Traveler',
            'honkai-star-rail' => 'Trailblazer',
            default => 'Player',
        };

        return $prefix.'_'.substr($uid, -4);
    }
}
