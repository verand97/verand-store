<?php

namespace App\Http\Controllers\Joki\Genshin;

use App\Http\Controllers\Controller;
use App\Models\Product;

class GenshinController extends Controller
{
    /**
     * Catalogue of Genshin Impact joki services + combo packages
     * (Daily Commission, Account Care, Weekly Boss, Story, Exploration).
     */
    public function services()
    {
        $query = Product::where('game', 'genshin-impact')
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
