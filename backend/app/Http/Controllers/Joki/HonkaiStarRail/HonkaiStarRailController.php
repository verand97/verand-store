<?php

namespace App\Http\Controllers\Joki\HonkaiStarRail;

use App\Http\Controllers\Controller;
use App\Models\Product;

class HonkaiStarRailController extends Controller
{
    /**
     * Catalogue of Honkai: Star Rail joki services + combo packages
     * (Daily Training, Account Care, Weekly Boss, Story, Exploration).
     */
    public function services()
    {
        $query = Product::where('game', 'honkai-star-rail')
            ->where('type', 'joki')
            ->where('is_active', true)
            ->orderBy('price')
            ->get();

        return response()->json([
            'combos' => $query->where('category', 'combo')->values(),
            'services' => $query->where('category', '!=', 'combo')->values(),
        ]);
    }
}
