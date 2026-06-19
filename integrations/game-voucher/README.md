# Integrasi Game Voucher

Implementasi: `backend/app/Services/Topup/TopupService.php`.

- `validateUid()` — validasi UID/server pemain.
- `deliver()` — kirim currency in-game setelah pembayaran.

Env: `GAME_VOUCHER_API_URL` (kosong = stub deterministik untuk pengembangan).
Digunakan untuk top-up Mobile Legends, Genshin, dan HSR via penyedia voucher.
