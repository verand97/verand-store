# Integrasi Eksternal

Titik integrasi pihak ketiga. Implementasi service ada di
`backend/app/Services/`. Semua memakai **stub** aman bila kredensial kosong.

| Folder           | Service Laravel                          | Env |
|------------------|------------------------------------------|-----|
| `midtrans/`      | `Services/Midtrans/MidtransService.php`  | `MIDTRANS_*` |
| `game-voucher/`  | `Services/Topup/TopupService.php`        | `GAME_VOUCHER_API_URL` |
| `genshin-api/`   | `Services/Topup/TopupService.php`        | `GENSHIN_API_URL` |
| `hsr-api/`       | `Services/Topup/TopupService.php`        | `HSR_API_URL` |
| `notification/`  | `Services/Kafka/TransactionQueue.php`    | — |

## Midtrans
- Mode stub: halaman bayar simulasi (`/checkout/mock-pay`) + endpoint `mock-confirm`.
- Mode live: isi `MIDTRANS_SERVER_KEY`/`MIDTRANS_CLIENT_KEY`, pasang SDK
  `midtrans/midtrans-php`, lengkapi `MidtransService::createRealTransaction()`.
- Webhook: arahkan notifikasi Midtrans ke `POST /api/payments/callback`.
