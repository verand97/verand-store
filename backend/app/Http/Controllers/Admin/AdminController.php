<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    public function dashboard()
    {
        return response()->json([
            'users' => User::count(),
            'boosters' => User::where('role', 'booster')->count(),
            'orders' => Order::count(),
            'revenue' => Order::where('payment_status', 'paid')->sum('total_amount'),
            'pending_joki' => Order::where('type', 'joki')
                ->whereIn('status', ['waiting_for_account', 'processing'])->count(),
            'recent_orders' => Order::with('user:id,name')->latest()->take(10)->get(),
        ]);
    }

    public function orders(Request $request)
    {
        $query = Order::with(['user:id,name', 'jokiOrder.booster:id,name']);

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }
        if ($type = $request->query('type')) {
            $query->where('type', $type);
        }

        return response()->json($query->latest()->paginate(20));
    }

    public function users()
    {
        return response()->json(User::latest()->paginate(20));
    }

    public function updateUserRole(Request $request, User $user)
    {
        $data = $request->validate([
            'role' => ['required', Rule::in(['customer', 'booster', 'admin'])],
        ]);

        $user->update($data);

        return response()->json($user);
    }

    public function storeProduct(Request $request)
    {
        $data = $request->validate([
            'game' => ['required', 'string'],
            'type' => ['required', Rule::in(['topup', 'joki'])],
            'category' => ['nullable', 'string'],
            'name' => ['required', 'string'],
            'slug' => ['required', 'string', 'unique:products,slug'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'unit' => ['nullable', 'string'],
            'quantity' => ['nullable', 'integer'],
            'meta' => ['nullable', 'array'],
        ]);

        return response()->json(Product::create($data), 201);
    }

    public function updateProduct(Request $request, Product $product)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string'],
            'description' => ['nullable', 'string'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'category' => ['nullable', 'string'],
            'meta' => ['nullable', 'array'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $product->update($data);

        return response()->json($product);
    }

    public function destroyProduct(Product $product)
    {
        $product->delete();

        return response()->json(['message' => 'Produk dihapus.']);
    }
}
