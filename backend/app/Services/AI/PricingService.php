<?php

namespace App\Services\AI;

use App\Models\Product;
use App\Models\User;

/**
 * Dynamic pricing for joki services. Adjusts the base price by difficulty,
 * account progress, available boosters, and demand surge (event/version
 * updates) as described in the spec.
 */
class PricingService
{
    public function quote(Product $product, array $context = []): array
    {
        $base = (float) $product->price;
        $multiplier = 1.0;
        $reasons = [];

        // Difficulty factor (1=easy .. 5=very hard).
        $difficulty = (int) ($context['difficulty'] ?? ($product->meta['difficulty'] ?? 1));
        if ($difficulty > 1) {
            $add = ($difficulty - 1) * 0.10;
            $multiplier += $add;
            $reasons[] = "Tingkat kesulitan x{$difficulty} (+".round($add * 100)."%)";
        }

        // Account progress: lower-level / fresh accounts take longer.
        if (isset($context['account_level'])) {
            $level = (int) $context['account_level'];
            if ($level < 30) {
                $multiplier += 0.15;
                $reasons[] = 'Akun level rendah (+15%)';
            }
        }

        // Booster availability: fewer boosters -> higher price.
        $availableBoosters = (int) ($context['available_boosters'] ?? User::where('role', 'booster')->where('is_active', true)->count());
        if ($availableBoosters <= 1) {
            $multiplier += 0.20;
            $reasons[] = 'Ketersediaan booster terbatas (+20%)';
        }

        // Demand surge during events / version updates.
        if (! empty($context['event_surge'])) {
            $multiplier += 0.25;
            $reasons[] = 'Lonjakan permintaan event/update (+25%)';
        }

        $final = round($base * $multiplier, 2);

        return [
            'base_price' => $base,
            'multiplier' => round($multiplier, 2),
            'final_price' => $final,
            'reasons' => $reasons,
        ];
    }
}
