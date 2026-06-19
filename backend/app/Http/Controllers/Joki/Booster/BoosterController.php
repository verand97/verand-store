<?php

namespace App\Http\Controllers\Joki\Booster;

use App\Http\Controllers\Controller;
use App\Models\JokiOrder;
use App\Services\Joki\JokiService;
use Illuminate\Http\Request;

class BoosterController extends Controller
{
    public function __construct(private JokiService $joki) {}

    /**
     * Stats for the authenticated booster's workload.
     */
    public function stats(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'active' => JokiOrder::where('booster_id', $user->id)
                ->whereHas('order', fn ($q) => $q->whereIn('status', ['waiting_for_account', 'processing']))
                ->count(),
            'finished' => JokiOrder::where('booster_id', $user->id)
                ->whereHas('order', fn ($q) => $q->where('status', 'finished'))
                ->count(),
            'available_jobs' => JokiOrder::whereNull('booster_id')->count(),
        ]);
    }

    /**
     * Auto-assign the least-loaded booster to an unassigned job (admin use).
     */
    public function autoAssign(JokiOrder $jokiOrder)
    {
        $boosterId = $this->joki->pickBooster();
        abort_if($boosterId === null, 422, 'Tidak ada booster tersedia.');

        $jokiOrder->update(['booster_id' => $boosterId]);

        return response()->json($jokiOrder->fresh()->load('booster:id,name'));
    }
}
