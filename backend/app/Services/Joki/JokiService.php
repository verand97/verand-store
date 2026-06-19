<?php

namespace App\Services\Joki;

use App\Models\JokiOrder;
use App\Models\User;

/**
 * Domain helpers for joki orders: booster assignment and ETA estimation.
 * Per-game catalogues mirror the spec's Modul Jasa Joki.
 */
class JokiService
{
    public const SERVICES = [
        'mobile-legends' => ['rank-boost', 'winrate', 'mmr-hero', 'placement', 'event'],
        'genshin-impact' => ['daily-commission', 'account-care', 'weekly-boss', 'story', 'exploration', 'combo'],
        'honkai-star-rail' => ['daily-training', 'account-care', 'weekly-boss', 'story', 'exploration', 'combo'],
    ];

    /**
     * Pick the booster with the fewest active jobs (simple load balancing).
     */
    public function pickBooster(): ?int
    {
        return User::query()
            ->where('role', 'booster')
            ->where('is_active', true)
            ->withCount(['assignedJobs as active_count' => function ($q) {
                $q->whereHas('order', fn ($o) => $o->whereIn('status', ['waiting_for_account', 'processing']));
            }])
            ->orderBy('active_count')
            ->value('id');
    }

    /**
     * Rough ETA label by service difficulty.
     */
    public function estimateEta(JokiOrder $joki): string
    {
        $difficulty = (int) (optional($joki->order)->meta['difficulty'] ?? 2);

        return match (true) {
            $difficulty >= 4 => '5-10 hari',
            $difficulty === 3 => '2-4 hari',
            default => '1-2 hari',
        };
    }

    public function isValidService(string $game, string $service): bool
    {
        return in_array($service, self::SERVICES[$game] ?? [], true);
    }
}
