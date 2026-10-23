<?php

namespace App\Http\Controllers\Joki\Progress;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProgressRequest;
use App\Models\Order;
use App\Models\ProgressLog;
use App\Events\ProgressUpdated;
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
    public function store(StoreProgressRequest $request, Order $order)
    {
        abort_unless($order->type === 'joki', 422);

        $data = $request->validated();

        $joki = $order->jokiOrder;
        abort_unless($joki !== null, 422, 'Detail joki tidak ditemukan.');

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

        // Broadcast a domain event (queued to the notification/progress pipeline).
        ProgressUpdated::dispatch($order, $log);

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
