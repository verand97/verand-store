<?php

namespace App\Http\Controllers\AI;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\AI\ChatbotService;
use App\Services\AI\PricingService;
use App\Services\AI\RecommendationService;
use Illuminate\Http\Request;

class AIController extends Controller
{
    public function __construct(
        private ChatbotService $chatbot,
        private RecommendationService $recommender,
        private PricingService $pricing,
    ) {}

    public function chat(Request $request)
    {
        $data = $request->validate([
            'message' => ['required', 'string', 'max:1000'],
        ]);

        return response()->json(
            $this->chatbot->reply($data['message'], $request->user())
        );
    }

    public function recommendations(Request $request)
    {
        return response()->json($this->recommender->for($request->user()));
    }

    public function priceQuote(Request $request)
    {
        $data = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'context' => ['nullable', 'array'],
        ]);

        $product = Product::findOrFail($data['product_id']);

        return response()->json($this->pricing->quote($product, $data['context'] ?? []));
    }
}
