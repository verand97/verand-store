<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::where('is_active', true);

        if ($game = $request->query('game')) {
            $query->where('game', $game);
        }
        if ($type = $request->query('type')) {
            $query->where('type', $type);
        }
        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        return response()->json($query->orderBy('price')->get());
    }

    public function show(string $slug)
    {
        $product = Product::where('slug', $slug)->where('is_active', true)->firstOrFail();

        return response()->json($product);
    }
}
