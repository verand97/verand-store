# Arsitektur Verand Store

## Komponen
- **Frontend (Next.js / React)** — App Router, Context untuk auth & cart, memanggil REST API.
- **Backend (Laravel)** — REST API modular, Sanctum untuk auth + RBAC, Eloquent + MySQL.
- **MySQL** — basis data relasional (users, products, orders, payments, joki_orders,
  progress_logs, chats, app_notifications).
- **Apache Kafka** — message broker antrean transaksi (diabstraksi via `TransactionQueue`).
- **Midtrans** — payment gateway (Snap + webhook callback).
- **AI Services** — chatbot NLP, rekomendasi, dynamic pricing (rule-based bawaan / microservice).

## Alur Transaksi (async pipeline)
1. Customer membuat order → topik `payment-created`.
2. Pembayaran diverifikasi (callback Midtrans) → topik `payment-success`.
3. Order top-up → topik `topup-process` → kirim currency → status `finished`.
4. Order joki → status `waiting_for_account` → customer kirim akun → `processing`.
5. Booster update progres → topik `progress-update`.
6. Setiap event penting → topik `notification` → notifikasi user.

## Topik Kafka
`payment-created`, `payment-success`, `topup-process`, `joki-process`,
`progress-update`, `notification`.

## Keamanan
- Sanctum bearer token + middleware `role:` untuk RBAC.
- Kredensial akun joki dienkripsi at-rest (Laravel `Crypt`), disembunyikan dari serialisasi.
- CORS dibatasi ke origin frontend.
- Signature verification pada webhook pembayaran.

## State Machine Order
```
pending ──▶ waiting_for_account ──▶ processing ──▶ completed ──▶ finished
   │                │                   │
   └────────────────┴───────────────────┴──▶ cancelled
```
Top-up melewati `waiting_for_account` (langsung diproses setelah bayar).
