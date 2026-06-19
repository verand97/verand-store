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
        $this->seedCombos();
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

    /**
     * Combo packages — only for account-maintenance games (Genshin & HSR).
     * These bundle several services at a discounted flat price.
     */
    private function seedCombos(): void
    {
        $combos = [
            // [game, slug-suffix, name, price, difficulty, duration, includes[]]
            [
                'genshin-impact', 'combo-starter', 'Combo Starter — Daily 7 Hari',
                65000, 2, '7 hari',
                ['Daily Commission 7 hari', 'Klaim reward login', 'Pemakaian Resin efisien', 'Farming material dasar'],
                'Hemat 20% dibanding beli satuan. Cocok untuk pemain sibuk.',
            ],
            [
                'genshin-impact', 'combo-weekly', 'Combo Weekly Care — All In One',
                160000, 3, '1 minggu',
                ['Daily Commission 7 hari', 'Weekly Boss (3x)', 'Klaim Battle Pass & event', 'Domain & material farming', 'Spiral Abyss (opsional)'],
                'Paket terlengkap perawatan akun mingguan. Hemat 25%.',
            ],
            [
                'genshin-impact', 'combo-explore', 'Combo Explorer — Region Tuntas',
                275000, 4, '5-10 hari',
                ['Eksplorasi 1 region ke 100%', 'Pengumpulan Oculus', 'Buka semua Waypoint & Statue', 'Chest & puzzle', 'Story Quest region terkait'],
                'Buka 1 region penuh + cerita terkait. Hemat 30%.',
            ],
            [
                'honkai-star-rail', 'combo-starter', 'Combo Starter — Daily 7 Hari',
                65000, 2, '7 hari',
                ['Daily Training 7 hari', 'Klaim reward login', 'Pemakaian Trailblaze Power efisien', 'Farming relic dasar'],
                'Hemat 20% dibanding beli satuan. Cocok untuk pemain sibuk.',
            ],
            [
                'honkai-star-rail', 'combo-weekly', 'Combo Weekly Care — All In One',
                160000, 3, '1 minggu',
                ['Daily Training 7 hari', 'Echo of War (3x)', 'Simulated Universe', 'Klaim Nameless Honor & event', 'Memory of Chaos (opsional)'],
                'Paket terlengkap perawatan akun mingguan. Hemat 25%.',
            ],
            [
                'honkai-star-rail', 'combo-explore', 'Combo Explorer — Area Tuntas',
                275000, 4, '5-10 hari',
                ['Eksplorasi 1 area ke 100%', 'Pengumpulan Treasure & chest', 'Buka semua Space Anchor', 'Puzzle & hidden quest', 'Trailblaze Mission area terkait'],
                'Buka 1 area penuh + misi terkait. Hemat 30%.',
            ],
        ];

        foreach ($combos as [$game, $suffix, $name, $price, $difficulty, $duration, $includes, $desc]) {
            $this->make([
                'game' => $game,
                'type' => 'joki',
                'category' => 'combo',
                'name' => $name,
                'slug' => "{$game}-{$suffix}",
                'description' => $desc,
                'price' => $price,
                'unit' => 'paket',
                'meta' => [
                    'difficulty' => $difficulty,
                    'is_combo' => true,
                    'duration' => $duration,
                    'includes' => $includes,
                ],
                'is_active' => true,
            ]);
        }
    }
}
