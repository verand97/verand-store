<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('game'); // mobile-legends | genshin-impact | honkai-star-rail
            $table->enum('type', ['topup', 'joki'])->default('topup');
            $table->string('category')->nullable(); // rank-boost, exploration, story, etc.
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 14, 2);
            $table->string('unit')->nullable(); // e.g. "diamonds", "per rank", "per quest"
            $table->integer('quantity')->nullable(); // for topup amount
            $table->string('image')->nullable();
            $table->json('meta')->nullable(); // flexible attributes (difficulty, eta, etc.)
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['game', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
