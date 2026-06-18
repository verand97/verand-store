<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProgressLog extends Model
{
    protected $fillable = [
        'joki_order_id', 'author_id', 'percent', 'activity', 'screenshot',
    ];

    protected $casts = [
        'percent' => 'integer',
    ];

    public function jokiOrder(): BelongsTo
    {
        return $this->belongsTo(JokiOrder::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
