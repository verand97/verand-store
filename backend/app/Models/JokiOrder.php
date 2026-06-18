<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Crypt;

class JokiOrder extends Model
{
    protected $fillable = [
        'order_id', 'booster_id', 'game', 'service', 'game_uid', 'game_server',
        'account_login', 'account_password', 'targets', 'progress', 'eta',
    ];

    protected $casts = [
        'targets' => 'array',
        'progress' => 'integer',
    ];

    protected $hidden = [
        'account_login', 'account_password',
    ];

    // Encrypt credentials at rest.
    protected function accountLogin(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? Crypt::decryptString($value) : null,
            set: fn ($value) => $value ? Crypt::encryptString($value) : null,
        );
    }

    protected function accountPassword(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? Crypt::decryptString($value) : null,
            set: fn ($value) => $value ? Crypt::encryptString($value) : null,
        );
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function booster(): BelongsTo
    {
        return $this->belongsTo(User::class, 'booster_id');
    }

    public function progressLogs(): HasMany
    {
        return $this->hasMany(ProgressLog::class)->latest();
    }
}
