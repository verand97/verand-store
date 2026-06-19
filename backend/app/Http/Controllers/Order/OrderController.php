<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;

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

    public function store(StoreOrderRequest $request)
    {
        $order = $this->orders->create($request->user()->id, $request->validated());

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
