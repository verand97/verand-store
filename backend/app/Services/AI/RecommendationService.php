<?php

namespace App\Services\AI;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;

/**
 * Personalised recommendations based on transaction history, as described in
 * the spec (e.g. offer weekly account-care to customers who frequently order
 * Daily Commission, or exploration packs after a Story Quest).
 */
class RecommendationService
{
    public function for(User $user, int $limit = 4): array
    {
        $history = Order::where('user_id', $user->id)
            ->with('items.product')
            ->latest()
            ->take(20)
            ->get();

        $games = [];
        $categories = [];

        foreach ($history as $order) {
            foreach ($order->items as $item) {
                if ($p = $item->product) {
                    $games[$p->game] = ($games[$p->game] ?? 0) + 1;
                    if ($p->category) {
                        $categories[$p->category] = ($categories[$p->category] ?? 0) + 1;
                    }
                }
            }
        }

        $query = Product::where('is_active', true);

        if ($games) {
            $topGame = array_key_first($games);
            $query->orderByRaw('game = ? desc', [$topGame]);
        }

        // Rule: daily-commission buyers -> suggest weekly account-care.
        if (isset($categories['daily-commission']) || isset($categories['daily-training'])) {
            $query->orderByRaw("category = 'account-care' desc");
        }

        // Rule: story buyers -> suggest exploration.
        if (isset($categories['story'])) {
            $query->orderByRaw("category = 'exploration' desc");
        }

        $recommended = $query->take($limit)->get();

        if ($recommended->isEmpty()) {
            $recommended = Product::where('is_active', true)->inRandomOrder()->take($limit)->get();
        }

        return [
            'based_on' => array_keys($games),
            'items' => $recommended,
        ];
    }
}
