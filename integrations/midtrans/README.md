# Integrasi Midtrans

Implementasi: `backend/app/Services/Midtrans/MidtransService.php`.

- `createTransaction()` — buat Snap token / redirect URL.
- `verifySignature()` — verifikasi signature webhook (SHA512).
- `mapStatus()` — map `transaction_status` Midtrans ke status internal.

Webhook endpoint: `POST /api/payments/callback`.
Env: `MIDTRANS_SERVER_KEY`, `MIDTRANS_CLIENT_KEY`, `MIDTRANS_IS_PRODUCTION`,
`MIDTRANS_MERCHANT_ID`. Kosong = mode stub (halaman bayar simulasi).
