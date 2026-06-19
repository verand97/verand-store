<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Booster is a role-scoped view over the users table. It always represents a
 * user with role = "booster", and exposes the joki jobs assigned to them.
 */
class Booster extends User
{
    protected $table = 'users';

    protected static function booted(): void
    {
        static::addGlobalScope('booster', function (Builder $builder) {
            $builder->where('role', 'booster');
        });

        static::creating(function (self $booster) {
            $booster->role = 'booster';
        });
    }

    public function jobs(): HasMany
    {
        return $this->hasMany(JokiOrder::class, 'booster_id');
    }

    /**
     * Active jobs currently in progress for this booster.
     */
    public function activeJobs(): HasMany
    {
        return $this->jobs()->whereHas('order', function (Builder $q) {
            $q->whereIn('status', ['waiting_for_account', 'processing']);
        });
    }
}
