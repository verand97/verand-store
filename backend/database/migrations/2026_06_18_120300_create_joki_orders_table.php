<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('joki_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('booster_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('game');
            $table->string('service'); // rank-boost, daily-commission, story, exploration...
            $table->string('game_uid')->nullable();
            $table->string('game_server')->nullable();
            // Credentials are sensitive: stored encrypted, only released when status allows.
            $table->text('account_login')->nullable();
            $table->text('account_password')->nullable();
            $table->json('targets')->nullable(); // {from_rank, to_rank, hero, percent...}
            $table->unsignedTinyInteger('progress')->default(0); // 0-100
            $table->string('eta')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('joki_orders');
    }
};
