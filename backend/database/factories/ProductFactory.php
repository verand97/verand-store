<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $game = fake()->randomElement(['mobile-legends', 'genshin-impact', 'honkai-star-rail']);
        $name = fake()->words(2, true);

        return [
            'game' => $game,
            'type' => 'topup',
            'category' => 'currency',
            'name' => ucfirst($name),
            'slug' => Str::slug($game.'-'.$name.'-'.Str::random(4)),
            'description' => fake()->sentence(),
            'price' => fake()->numberBetween(10000, 300000),
            'unit' => 'currency',
            'quantity' => fake()->numberBetween(60, 1000),
            'is_active' => true,
        ];
    }

    public function joki(): static
    {
        return $this->state(fn () => [
            'type' => 'joki',
            'category' => fake()->randomElement(['rank-boost', 'account-care', 'story', 'exploration']),
            'unit' => 'paket',
            'meta' => ['difficulty' => fake()->numberBetween(1, 5)],
        ]);
    }
}
