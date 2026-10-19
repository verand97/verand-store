export const DEFAULT_PRODUCTS = [
  // Mobile Legends - Topup
  {
    id: 1,
    slug: "mlbb-86-diamonds",
    game: "mobile-legends",
    type: "topup",
    category: "currency",
    name: "86 Diamonds",
    price: 22000,
    unit: "Diamonds",
    quantity: 86,
    is_active: true,
    meta: { bonus: "+ 8 Bonus", popular: true, icon: "diamond" }
  },
  {
    id: 2,
    slug: "mlbb-172-diamonds",
    game: "mobile-legends",
    type: "topup",
    category: "currency",
    name: "172 Diamonds",
    price: 44000,
    unit: "Diamonds",
    quantity: 172,
    is_active: true,
    meta: { bonus: "+ 16 Bonus", popular: false, icon: "diamond" }
  },
  {
    id: 3,
    slug: "mlbb-257-diamonds",
    game: "mobile-legends",
    type: "topup",
    category: "currency",
    name: "257 Diamonds",
    price: 65000,
    unit: "Diamonds",
    quantity: 257,
    is_active: true,
    meta: { bonus: "+ 27 Bonus", popular: true, icon: "diamond" }
  },
  {
    id: 4,
    slug: "mlbb-706-diamonds",
    game: "mobile-legends",
    type: "topup",
    category: "currency",
    name: "706 Diamonds",
    price: 165000,
    unit: "Diamonds",
    quantity: 706,
    is_active: true,
    meta: { bonus: "+ 84 Bonus", popular: true, icon: "diamond" }
  },
  {
    id: 5,
    slug: "mlbb-weekly-diamond-pass",
    game: "mobile-legends",
    type: "topup",
    category: "pass",
    name: "Weekly Diamond Pass",
    price: 28500,
    unit: "Pass",
    quantity: 1,
    is_active: true,
    meta: { bonus: "Total 210 Diamonds", popular: true, icon: "pass" }
  },

  // Genshin Impact - Topup
  {
    id: 6,
    slug: "genshin-60-genesis-crystals",
    game: "genshin-impact",
    type: "topup",
    category: "currency",
    name: "60 Genesis Crystals",
    price: 16000,
    unit: "Genesis Crystals",
    quantity: 60,
    is_active: true,
    meta: { bonus: "+ First Topup 2x", popular: false, icon: "crystal" }
  },
  {
    id: 7,
    slug: "genshin-300-genesis-crystals",
    game: "genshin-impact",
    type: "topup",
    category: "currency",
    name: "300 Genesis Crystals",
    price: 79000,
    unit: "Genesis Crystals",
    quantity: 300,
    is_active: true,
    meta: { bonus: "+ 30 Bonus", popular: true, icon: "crystal" }
  },
  {
    id: 8,
    slug: "genshin-980-genesis-crystals",
    game: "genshin-impact",
    type: "topup",
    category: "currency",
    name: "980 Genesis Crystals",
    price: 249000,
    unit: "Genesis Crystals",
    quantity: 980,
    is_active: true,
    meta: { bonus: "+ 110 Bonus", popular: true, icon: "crystal" }
  },
  {
    id: 9,
    slug: "genshin-blessing-welkin-moon",
    game: "genshin-impact",
    type: "topup",
    category: "pass",
    name: "Blessing of the Welkin Moon",
    price: 79000,
    unit: "Pass",
    quantity: 1,
    is_active: true,
    meta: { bonus: "300 Crystals + 2700 Primogems", popular: true, icon: "pass" }
  },

  // Honkai: Star Rail - Topup
  {
    id: 10,
    slug: "hsr-60-oneiric-shard",
    game: "honkai-star-rail",
    type: "topup",
    category: "currency",
    name: "60 Oneiric Shard",
    price: 16000,
    unit: "Oneiric Shards",
    quantity: 60,
    is_active: true,
    meta: { bonus: "+ First Topup 2x", popular: false, icon: "shard" }
  },
  {
    id: 11,
    slug: "hsr-300-oneiric-shard",
    game: "honkai-star-rail",
    type: "topup",
    category: "currency",
    name: "300 Oneiric Shard",
    price: 79000,
    unit: "Oneiric Shards",
    quantity: 300,
    is_active: true,
    meta: { bonus: "+ 30 Bonus", popular: true, icon: "shard" }
  },
  {
    id: 12,
    slug: "hsr-980-oneiric-shard",
    game: "honkai-star-rail",
    type: "topup",
    category: "currency",
    name: "980 Oneiric Shard",
    price: 249000,
    unit: "Oneiric Shards",
    quantity: 980,
    is_active: true,
    meta: { bonus: "+ 110 Bonus", popular: true, icon: "shard" }
  },
  {
    id: 13,
    slug: "hsr-express-supply-pass",
    game: "honkai-star-rail",
    type: "topup",
    category: "pass",
    name: "Express Supply Pass",
    price: 79000,
    unit: "Pass",
    quantity: 1,
    is_active: true,
    meta: { bonus: "300 Shards + 2700 Stellar Jades", popular: true, icon: "pass" }
  },

  // Mobile Legends - Joki
  {
    id: 14,
    slug: "mlbb-rank-boost",
    game: "mobile-legends",
    type: "joki",
    category: "rank-boost",
    name: "Rank Boost (per bintang)",
    price: 15000,
    unit: "per bintang",
    is_active: true,
    meta: { difficulty: 2, icon: "rank" }
  },
  {
    id: 15,
    slug: "mlbb-winrate",
    game: "mobile-legends",
    type: "joki",
    category: "winrate",
    name: "Classic Winrate (per match)",
    price: 12000,
    unit: "per match",
    is_active: true,
    meta: { difficulty: 2, icon: "winrate" }
  },
  {
    id: 16,
    slug: "mlbb-mmr-hero",
    game: "mobile-legends",
    type: "joki",
    category: "mmr-hero",
    name: "MMR Hero Boost",
    price: 50000,
    unit: "per hero",
    is_active: true,
    meta: { difficulty: 3, icon: "hero" }
  },
  {
    id: 17,
    slug: "mlbb-placement",
    game: "mobile-legends",
    type: "joki",
    category: "placement",
    name: "Mythic Placement (10 match)",
    price: 120000,
    unit: "paket",
    is_active: true,
    meta: { difficulty: 3, icon: "trophy" }
  },
  {
    id: 18,
    slug: "mlbb-event",
    game: "mobile-legends",
    type: "joki",
    category: "event",
    name: "Penyelesaian Event Musiman",
    price: 80000,
    unit: "per event",
    is_active: true,
    meta: { difficulty: 2, icon: "event" }
  },

  // Genshin Impact - Joki
  {
    id: 19,
    slug: "genshin-daily-commission",
    game: "genshin-impact",
    type: "joki",
    category: "daily-commission",
    name: "Daily Commission (per hari)",
    price: 10000,
    unit: "per hari",
    is_active: true,
    meta: { difficulty: 1, icon: "daily" }
  },
  {
    id: 20,
    slug: "genshin-account-care",
    game: "genshin-impact",
    type: "joki",
    category: "account-care",
    name: "Perawatan Akun Mingguan",
    price: 90000,
    unit: "per minggu",
    is_active: true,
    meta: { difficulty: 2, icon: "shield" }
  },
  {
    id: 21,
    slug: "genshin-weekly-boss",
    game: "genshin-impact",
    type: "joki",
    category: "weekly-boss",
    name: "Weekly Boss Clear",
    price: 40000,
    unit: "per minggu",
    is_active: true,
    meta: { difficulty: 3, icon: "boss" }
  },
  {
    id: 22,
    slug: "genshin-story",
    game: "genshin-impact",
    type: "joki",
    category: "story",
    name: "Joki Story / Archon Quest",
    price: 75000,
    unit: "per chapter",
    is_active: true,
    meta: { difficulty: 3, icon: "quest" }
  },
  {
    id: 23,
    slug: "genshin-exploration",
    game: "genshin-impact",
    type: "joki",
    category: "exploration",
    name: "Joki Eksplorasi (per region)",
    price: 150000,
    unit: "per region",
    is_active: true,
    meta: { difficulty: 4, icon: "map" }
  },

  // Genshin Impact - Combos
  {
    id: 24,
    slug: "genshin-impact-combo-starter",
    game: "genshin-impact",
    type: "joki",
    category: "combo",
    name: "Combo Starter — Daily 7 Hari",
    price: 65000,
    unit: "paket",
    description: "Hemat 20% dibanding beli satuan. Cocok untuk pemain sibuk.",
    meta: {
      difficulty: 2,
      is_combo: true,
      duration: "7 hari",
      includes: [
        "Daily Commission 7 hari",
        "Klaim reward login",
        "Pemakaian Resin efisien",
        "Farming material dasar"
      ]
    },
    is_active: true
  },
  {
    id: 25,
    slug: "genshin-impact-combo-weekly",
    game: "genshin-impact",
    type: "joki",
    category: "combo",
    name: "Combo Weekly Care — All In One",
    price: 160000,
    unit: "paket",
    description: "Paket terlengkap perawatan akun mingguan. Hemat 25%.",
    meta: {
      difficulty: 3,
      is_combo: true,
      duration: "1 minggu",
      includes: [
        "Daily Commission 7 hari",
        "Weekly Boss (3x)",
        "Klaim Battle Pass & event",
        "Domain & material farming",
        "Spiral Abyss (opsional)"
      ]
    },
    is_active: true
  },
  {
    id: 26,
    slug: "genshin-impact-combo-explore",
    game: "genshin-impact",
    type: "joki",
    category: "combo",
    name: "Combo Explorer — Region Tuntas",
    price: 275000,
    unit: "paket",
    description: "Buka 1 region penuh + cerita terkait. Hemat 30%.",
    meta: {
      difficulty: 4,
      is_combo: true,
      duration: "5-10 hari",
      includes: [
        "Eksplorasi 1 region ke 100%",
        "Pengumpulan Oculus",
        "Buka semua Waypoint & Statue",
        "Chest & puzzle",
        "Story Quest region terkait"
      ]
    },
    is_active: true
  },

  // Honkai: Star Rail - Joki
  {
    id: 27,
    slug: "hsr-daily-training",
    game: "honkai-star-rail",
    type: "joki",
    category: "daily-training",
    name: "Daily Training (per hari)",
    price: 10000,
    unit: "per hari",
    is_active: true,
    meta: { difficulty: 1, icon: "daily" }
  },
  {
    id: 28,
    slug: "hsr-account-care",
    game: "honkai-star-rail",
    type: "joki",
    category: "account-care",
    name: "Perawatan Akun Mingguan",
    price: 90000,
    unit: "per minggu",
    is_active: true,
    meta: { difficulty: 2, icon: "shield" }
  },
  {
    id: 29,
    slug: "hsr-weekly-boss",
    game: "honkai-star-rail",
    type: "joki",
    category: "weekly-boss",
    name: "Weekly Boss / Echo of War",
    price: 40000,
    unit: "per minggu",
    is_active: true,
    meta: { difficulty: 3, icon: "boss" }
  },
  {
    id: 30,
    slug: "hsr-story",
    game: "honkai-star-rail",
    type: "joki",
    category: "story",
    name: "Joki Trailblaze Mission",
    price: 75000,
    unit: "per chapter",
    is_active: true,
    meta: { difficulty: 3, icon: "quest" }
  },
  {
    id: 31,
    slug: "hsr-exploration",
    game: "honkai-star-rail",
    type: "joki",
    category: "exploration",
    name: "Joki Eksplorasi & Treasure",
    price: 150000,
    unit: "per area",
    is_active: true,
    meta: { difficulty: 4, icon: "map" }
  },

  // Honkai: Star Rail - Combos
  {
    id: 32,
    slug: "honkai-star-rail-combo-starter",
    game: "honkai-star-rail",
    type: "joki",
    category: "combo",
    name: "Combo Starter — Daily 7 Hari",
    price: 65000,
    unit: "paket",
    description: "Hemat 20% dibanding beli satuan. Cocok untuk pemain sibuk.",
    meta: {
      difficulty: 2,
      is_combo: true,
      duration: "7 hari",
      includes: [
        "Daily Training 7 hari",
        "Klaim reward login",
        "Pemakaian Trailblaze Power efisien",
        "Farming relic dasar"
      ]
    },
    is_active: true
  },
  {
    id: 33,
    slug: "honkai-star-rail-combo-weekly",
    game: "honkai-star-rail",
    type: "joki",
    category: "combo",
    name: "Combo Weekly Care — All In One",
    price: 160000,
    unit: "paket",
    description: "Paket terlengkap perawatan akun mingguan. Hemat 25%.",
    meta: {
      difficulty: 3,
      is_combo: true,
      duration: "1 minggu",
      includes: [
        "Daily Training 7 hari",
        "Echo of War (3x)",
        "Simulated Universe",
        "Klaim Nameless Honor & event",
        "Memory of Chaos (opsional)"
      ]
    },
    is_active: true
  },
  {
    id: 34,
    slug: "honkai-star-rail-combo-explore",
    game: "honkai-star-rail",
    type: "joki",
    category: "combo",
    name: "Combo Explorer — Area Tuntas",
    price: 275000,
    unit: "paket",
    description: "Buka 1 area penuh + misi terkait. Hemat 30%.",
    meta: {
      difficulty: 4,
      is_combo: true,
      duration: "5-10 hari",
      includes: [
        "Eksplorasi 1 area ke 100%",
        "Pengumpulan Treasure & chest",
        "Buka semua Space Anchor",
        "Puzzle & hidden quest",
        "Trailblaze Mission area terkait"
      ]
    },
    is_active: true
  }
];

export const PAYMENT_METHODS = [
  {
    id: "qris",
    name: "QRIS Bebas Admin",
    type: "instant",
    icon: "qris",
    badge: "Tercepat · 0% Fee",
    desc: "BCA, Mandiri, GoPay, OVO, Dana, ShopeePay",
    fee: 0
  },
  {
    id: "gopay",
    name: "GoPay / GoPay Later",
    type: "ewallet",
    icon: "gopay",
    badge: "Instan",
    desc: "Buka aplikasi Gojek langsung bayar",
    fee: 1000
  },
  {
    id: "dana",
    name: "DANA E-Wallet",
    type: "ewallet",
    icon: "dana",
    badge: "Instan",
    desc: "Bayar otomatis via saldo DANA",
    fee: 1000
  },
  {
    id: "shopeepay",
    name: "ShopeePay",
    type: "ewallet",
    icon: "shopeepay",
    badge: "Instan",
    desc: "Terintegrasi aplikasi Shopee",
    fee: 1000
  },
  {
    id: "bca_va",
    name: "BCA Virtual Account",
    type: "va",
    icon: "bca",
    badge: "Otomatis 24 Jam",
    desc: "BCA Mobile, KlikBCA, myBCA",
    fee: 2500
  },
  {
    id: "mandiri_va",
    name: "Mandiri Livin' VA",
    type: "va",
    icon: "mandiri",
    badge: "Otomatis 24 Jam",
    desc: "Livin' by Mandiri & ATM Mandiri",
    fee: 2500
  },
  {
    id: "bri_va",
    name: "BRI BRIVA",
    type: "va",
    icon: "bri",
    badge: "Otomatis 24 Jam",
    desc: "BRImo & ATM Bank BRI",
    fee: 2500
  }
];

export const REVIEWS = [
  {
    id: 1,
    name: "Kevin Pratama",
    game: "Mobile Legends",
    rank: "Mythical Glory",
    rating: 5,
    comment: "Proses cepat banget! Order 706 Diamonds hitungan 2 menit langsung masuk pas lagi butuh skin All-Star. Rekomen!",
    date: "1 jam lalu",
    avatar: "KP"
  },
  {
    id: 2,
    name: "Aisyah N.",
    game: "Genshin Impact",
    rank: "AR 59",
    rating: 5,
    comment: "Ambil Paket Combo Weekly Care karena lagi sibuk skripsi. Resin kepake rapih, weekly boss beres, dikirimin SS pengerjaan tiap hari. Amanah 100%.",
    date: "3 jam lalu",
    avatar: "AN"
  },
  {
    id: 3,
    name: "Dimas Anggara",
    game: "Honkai: Star Rail",
    rank: "TB 68",
    rating: 5,
    comment: "Joki Penacony 100% beres lebih cepat dari estimasi. Booster ramah di chat internal & akun aman sentosa. Top tier!",
    date: "Kemarin",
    avatar: "DA"
  },
  {
    id: 4,
    name: "Rizky Fauzan",
    game: "Mobile Legends",
    rank: "Mythic Immortal",
    rating: 5,
    comment: "Joki placement 10 win streak tanpa kalah sama Pro Booster Verand. Mainnya rapi, MMR Fanny gw naik drastis.",
    date: "2 hari lalu",
    avatar: "RF"
  }
];
