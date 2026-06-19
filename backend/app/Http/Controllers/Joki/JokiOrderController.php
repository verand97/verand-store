<?php

namespace App\Http\Controllers\Joki;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubmitAccountRequest;
use App\Models\JokiOrder;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class JokiOrderController extends Controller
{
    public function __construct(private OrderService $orders) {}

    /**
     * Customer submits account credentials so a booster can start work.
     * Moves the order from waiting_for_account -> processing.
     */
    public function submitAccount(SubmitAccountRequest $request, Order $order)
    {
        abort_unless($order->user_id === $request->user()->id, 403);
        abort_unless($order->type === 'joki', 422, 'Bukan pesanan joki.');

        $data = $request->validated();

        $joki = $order->jokiOrder;
        $joki->update($data);

        if ($order->status === 'waiting_for_account') {
            $this->orders->transition($order, 'processing');
        }

        return response()->json(['message' => 'Akun diterima. Pengerjaan dimulai.', 'order' => $order->fresh()->load('jokiOrder')]);
    }

    /**
     * Booster/Admin updates the workflow status.
     */
    public function transition(Request $request, Order $order)
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(['waiting_for_account', 'processing', 'completed', 'finished', 'cancelled'])],
        ]);

        $order = $this->orders->transition($order, $data['status']);

        return response()->json($order->load('jokiOrder'));
    }

    /**
     * Booster assigns themselves (or admin assigns) to a joki order.
     */
    public function assign(Request $request, Order $order)
    {
        $user = $request->user();
        $boosterId = $user->isAdmin()
            ? $request->validate(['booster_id' => ['required', 'exists:users,id']])['booster_id']
            : $user->id;

        $order->jokiOrder->update(['booster_id' => $boosterId]);

        return response()->json($order->fresh()->load('jokiOrder.booster:id,name'));
    }

    /**
     * Queue of joki jobs (for boosters/admin).
     */
    public function queue(Request $request)
    {
        $user = $request->user();
        $query = JokiOrder::with('order.user:id,name')->latest();

        if ($user->isBooster()) {
            $query->where(function ($q) use ($user) {
                $q->whereNull('booster_id')->orWhere('booster_id', $user->id);
            });
        }

        return response()->json($query->get());
    }
}
