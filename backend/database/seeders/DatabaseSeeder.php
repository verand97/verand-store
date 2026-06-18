<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // --- Demo users ---
        User::updateOrCreate(['email' => 'admin@verand.store'], [
            'name' => 'Admin Verand',
            'password' => 'password',
            'role' => 'admin',
        ]);

        User::updateOrCreate(['email' => 'booster@verand.store'], [
            'name' => 'Pro Booster',
            'password' => 'password',
            'role' => 'booster',
        ]);

        User::updateOrCreate(['email' => 'customer@verand.store'], [
            'name' => 'Demo Customer',
            'password' => 'password',
            'role' => 'customer',
        ]);

        $this->seedTopup();
        $this->seedJoki();
    }

    private function make(array $attrs): void
    {
        $attrs['slug'] = $attrs['slug'] ?? Str::slug($attrs['game'].'-'.$attrs['name']);
        Product::updateOrCreate(['slug' => $attrs['slug']], $attrs);
    }

    private function seedTopup(): void
    {
        $topups = [
            ['mobile-legends', '86 Diamonds', 22000, 86],
            ['mobile-legends', '172 Diamonds', 44000, 172],
            ['mobile-legends', '257 Diamonds', 65000, 257],
            ['mobile-legends', '706 Diamonds', 165000, 706],
            ['genshin-impact', '60 Genesis Crystals', 16000, 60],
            ['genshin-impact', '300 Genesis Crystals', 79000, 300],
            ['genshin-impact', '980 Genesis Crystals', 249000, 980],
            ['honkai-star-rail', '60 Oneiric Shard', 16000, 60],
            ['honkai-star-rail', '300 Oneiric Shard', 79000, 300],
            ['honkai-star-rail', '980 Oneiric Shard', 249000, 980],
        ];

        foreach ($topups as [$game, $name, $price, $qty]) {
            $this->make([
                'game' => $game,
                'type' => 'topup',
                'category' => 'currency',
                'name' => $name,
                'price' => $price,
                'unit' => 'currency',
                'quantity' => $qty,
                'is_active' => true,
            ]);
        }
    }

    private function seedJoki(): void
    {
        $joki = [
            // Mobile Legends
            ['mobile-legends', 'rank-boost', 'Rank Boost (per bintang)', 15000, 2, 'per bintang'],
            ['mobile-legends', 'winrate', 'Classic Winrate (per match)', 12000, 2, 'per match'],
            ['mobile-legends', 'mmr-hero', 'MMR Hero Boost', 50000, 3, 'per hero'],
            ['mobile-legends', 'placement', 'Mythic Placement (10 match)', 120000, 3, 'paket'],
            ['mobile-legends', 'event', 'Penyelesaian Event Musiman', 80000, 2, 'per event'],
            // Genshin Impact
            ['genshin-impact', 'daily-commission', 'Daily Commission (per hari)', 10000, 1, 'per hari'],
            ['genshin-impact', 'account-care', 'Perawatan Akun Mingguan', 90000, 2, 'per minggu'],
            ['genshin-impact', 'weekly-boss', 'Weekly Boss Clear', 40000, 3, 'per minggu'],
            ['genshin-impact', 'story', 'Joki Story / Archon Quest', 75000, 3, 'per chapter'],
            ['genshin-impact', 'exploration', 'Joki Eksplorasi (per region)', 150000, 4, 'per region'],
            // Honkai: Star Rail
            ['honkai-star-rail', 'daily-training', 'Daily Training (per hari)', 10000, 1, 'per hari'],
            ['honkai-star-rail', 'account-care', 'Perawatan Akun Mingguan', 90000, 2, 'per minggu'],
            ['honkai-star-rail', 'weekly-boss', 'Weekly Boss / Echo of War', 40000, 3, 'per minggu'],
            ['honkai-star-rail', 'story', 'Joki Trailblaze Mission', 75000, 3, 'per chapter'],
            ['honkai-star-rail', 'exploration', 'Joki Eksplorasi & Treasure', 150000, 4, 'per area'],
        ];

        foreach ($joki as [$game, $category, $name, $price, $difficulty, $unit]) {
            $this->make([
                'game' => $game,
                'type' => 'joki',
                'category' => $category,
                'name' => $name,
                'price' => $price,
                'unit' => $unit,
                'meta' => ['difficulty' => $difficulty],
                'is_active' => true,
            ]);
        }
    }
}
