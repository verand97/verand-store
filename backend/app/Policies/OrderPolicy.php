<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    /**
     * Owner, assigned booster, or admin may view an order.
     */
    public function view(User $user, Order $order): bool
    {
        if ($user->isAdmin()) {
            return true;
        }
        if ($user->isBooster() && $order->jokiOrder?->booster_id === $user->id) {
            return true;
        }

        return $order->user_id === $user->id;
    }

    /**
     * Only the owner may submit account credentials / pay.
     */
    public function manage(User $user, Order $order): bool
    {
        return $order->user_id === $user->id;
    }

    /**
     * Boosters/admin can update workflow status & progress.
     */
    public function work(User $user, Order $order): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->isBooster()
            && ($order->jokiOrder?->booster_id === $user->id || $order->jokiOrder?->booster_id === null);
    }

    /**
     * Participants may chat on an order.
     */
    public function chat(User $user, Order $order): bool
    {
        return $this->view($user, $order);
    }
}
