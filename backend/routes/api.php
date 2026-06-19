<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\AI\AIController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Chat\ChatController;
use App\Http\Controllers\Joki\JokiOrderController;
use App\Http\Controllers\Joki\Progress\ProgressController;
use App\Http\Controllers\Order\OrderController;
use App\Http\Controllers\Payment\PaymentController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Topup\TopupController;
use App\Http\Controllers\User\NotificationController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json(['status' => 'ok', 'app' => 'Verand Store API']));

// --- Public ---
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);

Route::post('/topup/validate-uid', [TopupController::class, 'validateUid']);

// Joki service catalogues per game (public).
Route::get('/joki/mobile-legends/services', [\App\Http\Controllers\Joki\MobileLegends\MobileLegendsController::class, 'services']);
Route::get('/joki/genshin-impact/services', [\App\Http\Controllers\Joki\Genshin\GenshinController::class, 'services']);
Route::get('/joki/honkai-star-rail/services', [\App\Http\Controllers\Joki\HonkaiStarRail\HonkaiStarRailController::class, 'services']);

// Payment gateway webhook (signature-verified, no auth).
Route::post('/payments/callback', [PaymentController::class, 'callback']);

// AI chatbot is available to guests too.
Route::post('/ai/chat', [AIController::class, 'chat']);

// --- Authenticated ---
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Orders & checkout
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);

    // Payments
    Route::post('/orders/{order}/pay', [PaymentController::class, 'pay']);
    Route::post('/orders/{order}/mock-confirm', [PaymentController::class, 'mockConfirm']);

    // Joki workflow (customer side)
    Route::post('/orders/{order}/submit-account', [JokiOrderController::class, 'submitAccount']);

    // Progress (view) & chat
    Route::get('/orders/{order}/progress', [ProgressController::class, 'index']);
    Route::get('/orders/{order}/chats', [ChatController::class, 'index']);
    Route::post('/orders/{order}/chats', [ChatController::class, 'store']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead']);

    // AI (personalised)
    Route::get('/ai/recommendations', [AIController::class, 'recommendations']);
    Route::post('/ai/price-quote', [AIController::class, 'priceQuote']);

    // --- Booster + Admin ---
    Route::middleware('role:booster,admin')->group(function () {
        Route::get('/joki/queue', [JokiOrderController::class, 'queue']);
        Route::get('/joki/booster/stats', [\App\Http\Controllers\Joki\Booster\BoosterController::class, 'stats']);
        Route::post('/orders/{order}/assign', [JokiOrderController::class, 'assign']);
        Route::post('/orders/{order}/transition', [JokiOrderController::class, 'transition']);
        Route::post('/orders/{order}/progress', [ProgressController::class, 'store']);
    });

    // --- Admin only ---
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/orders', [AdminController::class, 'orders']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::post('/users/{user}/role', [AdminController::class, 'updateUserRole']);
        Route::post('/products', [AdminController::class, 'storeProduct']);
        Route::put('/products/{product}', [AdminController::class, 'updateProduct']);
        Route::delete('/products/{product}', [AdminController::class, 'destroyProduct']);
    });
});
