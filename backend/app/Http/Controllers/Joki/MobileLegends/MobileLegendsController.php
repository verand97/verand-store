<?php

namespace App\Http\Controllers\Joki\MobileLegends;

use App\Http\Controllers\Controller;
use App\Models\Product;

class MobileLegendsController extends Controller
{
    /**
     * Catalogue of Mobile Legends joki services (Rank Boost, Winrate, MMR,
     * Placement, Event).
     */
    public function services()
    {
        return response()->json(
            Product::where('game', 'mobile-legends')
                ->where('type', 'joki')
                ->where('is_active', true)
                ->orderBy('price')
                ->get()
        );
    }
}
