<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    public function __construct(private OrderService $orders) {}

    public function index(Request $request)
    {
        $orders = Order::with(['items', 'payment', 'jokiOrder'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => ['required', Rule::in(['topup', 'joki'])],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['nullable', 'integer', 'exists:products,id'],
            'items.*.name' => ['nullable', 'string'],
            'items.*.price' => ['nullable', 'numeric', 'min:0'],
            'items.*.quantity' => ['nullable', 'integer', 'min:1'],
            'items.*.options' => ['nullable', 'array'],
            'meta' => ['nullable', 'array'],
            'joki' => ['nullable', 'array'],
        ]);

        $order = $this->orders->create($request->user()->id, $data);

        return response()->json($order, 201);
    }

    public function show(Request $request, Order $order)
    {
        $this->authorizeOrder($request, $order);

        return response()->json(
            $order->load(['items', 'payment', 'jokiOrder.progressLogs', 'jokiOrder.booster:id,name'])
        );
    }

    private function authorizeOrder(Request $request, Order $order): void
    {
        $user = $request->user();
        if ($user->isAdmin()) {
            return;
        }
        if ($user->isBooster() && $order->jokiOrder?->booster_id === $user->id) {
            return;
        }
        abort_unless($order->user_id === $user->id, 403, 'Akses ditolak.');
    }
}
