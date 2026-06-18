<?php

namespace App\Http\Controllers\Chat;

use App\Http\Controllers\Controller;
use App\Models\Chat;
use App\Models\Order;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function index(Request $request, Order $order)
    {
        $this->authorizeChat($request, $order);

        return response()->json(
            $order->chats()->with('sender:id,name,role')->orderBy('created_at')->get()
        );
    }

    public function store(Request $request, Order $order)
    {
        $this->authorizeChat($request, $order);

        $data = $request->validate([
            'message' => ['required', 'string', 'max:2000'],
        ]);

        $chat = Chat::create([
            'order_id' => $order->id,
            'sender_id' => $request->user()->id,
            'message' => $data['message'],
        ]);

        return response()->json($chat->load('sender:id,name,role'), 201);
    }

    private function authorizeChat(Request $request, Order $order): void
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
