<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->string('gateway')->default('midtrans');
            $table->string('reference')->nullable(); // gateway transaction id
            $table->string('method')->nullable(); // qris, va, ewallet, bank_transfer
            $table->decimal('amount', 14, 2);
            $table->enum('status', ['pending', 'paid', 'failed', 'expired', 'refunded'])->default('pending');
            $table->string('snap_token')->nullable();
            $table->string('redirect_url')->nullable();
            $table->json('payload')->nullable(); // raw gateway response / callback
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
