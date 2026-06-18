<?php

namespace App\Http\Controllers\Joki\Progress;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\ProgressLog;
use Illuminate\Http\Request;

class ProgressController extends Controller
{
    public function index(Request $request, Order $order)
    {
        $this->authorizeView($request, $order);

        return response()->json(
            $order->jokiOrder?->progressLogs()->with('author:id,name')->get() ?? []
        );
    }

    /**
     * Booster/Admin posts a progress update with optional screenshot.
     */
    public function store(Request $request, Order $order)
    {
        abort_unless($order->type === 'joki', 422);

        $data = $request->validate([
            'percent' => ['required', 'integer', 'min:0', 'max:100'],
            'activity' => ['required', 'string', 'max:255'],
            'screenshot' => ['nullable', 'image', 'max:4096'],
        ]);

        $joki = $order->jokiOrder;

        $path = null;
        if ($request->hasFile('screenshot')) {
            $path = $request->file('screenshot')->store('progress', 'public');
        }

        $log = ProgressLog::create([
            'joki_order_id' => $joki->id,
            'author_id' => $request->user()->id,
            'percent' => $data['percent'],
            'activity' => $data['activity'],
            'screenshot' => $path,
        ]);

        $joki->update(['progress' => $data['percent']]);

        return response()->json($log->load('author:id,name'), 201);
    }

    private function authorizeView(Request $request, Order $order): void
    {
        $user = $request->user();
        if ($user->isAdmin() || $order->user_id === $user->id) {
            return;
        }
        if ($user->isBooster() && $order->jokiOrder?->booster_id === $user->id) {
            return;
        }
        abort(403, 'Akses ditolak.');
    }
}
