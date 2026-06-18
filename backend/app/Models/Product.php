<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'game', 'type', 'category', 'name', 'slug', 'description',
        'price', 'unit', 'quantity', 'image', 'meta', 'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'meta' => 'array',
        'is_active' => 'boolean',
    ];
}
