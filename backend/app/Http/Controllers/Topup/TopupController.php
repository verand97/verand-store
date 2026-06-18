<?php

namespace App\Http\Controllers\Topup;

use App\Http\Controllers\Controller;
use App\Services\Topup\TopupService;
use Illuminate\Http\Request;

class TopupController extends Controller
{
    public function __construct(private TopupService $topup) {}

    public function validateUid(Request $request)
    {
        $data = $request->validate([
            'game' => ['required', 'string'],
            'uid' => ['required', 'string', 'max:30'],
            'server' => ['nullable', 'string', 'max:30'],
        ]);

        return response()->json(
            $this->topup->validateUid($data['game'], $data['uid'], $data['server'] ?? null)
        );
    }
}
