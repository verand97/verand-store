# AI — Dynamic Pricing

Implementasi: `backend/app/Services/AI/PricingService.php`.
Endpoint: `POST /api/ai/price-quote` (auth; body: `product_id`, `context`).

Faktor: tingkat kesulitan, progres/level akun, ketersediaan booster, dan
lonjakan permintaan (event/update game). Mengembalikan `base_price`,
`multiplier`, `final_price`, dan daftar `reasons`.
