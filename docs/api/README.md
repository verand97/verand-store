# Verand Store — API Reference

Base URL (dev): `http://127.0.0.1:8000/api`

Auth: Bearer token (Laravel Sanctum). Sertakan header `Authorization: Bearer <token>`.

## Auth
| Method | Endpoint           | Auth | Deskripsi |
|--------|--------------------|------|-----------|
| POST   | `/auth/register`   | —    | Daftar akun (role default `customer`) |
| POST   | `/auth/login`      | —    | Login, mengembalikan `token` & `user` |
| GET    | `/auth/me`         | ✓    | Profil user saat ini |
| POST   | `/auth/logout`     | ✓    | Hapus token aktif |

## Produk
| Method | Endpoint            | Auth | Deskripsi |
|--------|---------------------|------|-----------|
| GET    | `/products`         | —    | List produk. Query: `game`, `type` (topup/joki), `category` |
| GET    | `/products/{slug}`  | —    | Detail produk |

## Top-up
| Method | Endpoint               | Auth | Deskripsi |
|--------|------------------------|------|-----------|
| POST   | `/topup/validate-uid`  | —    | Validasi UID. Body: `game`, `uid`, `server?` |

## Order & Pembayaran
| Method | Endpoint                       | Auth | Deskripsi |
|--------|--------------------------------|------|-----------|
| GET    | `/orders`                      | ✓    | List pesanan milik user |
| POST   | `/orders`                      | ✓    | Buat pesanan. Body: `type`, `items[]`, `meta?`, `joki?` |
| GET    | `/orders/{order}`              | ✓    | Detail pesanan (items, payment, joki, progress) |
| POST   | `/orders/{order}/pay`          | ✓    | Inisiasi pembayaran (Snap token / redirect) |
| POST   | `/orders/{order}/mock-confirm` | ✓    | Simulasi sukses bayar (mode stub) |
| POST   | `/payments/callback`           | —    | Webhook Midtrans (verifikasi signature) |

## Workflow Joki
| Method | Endpoint                         | Auth | Role | Deskripsi |
|--------|----------------------------------|------|------|-----------|
| POST   | `/orders/{order}/submit-account` | ✓    | customer | Kirim kredensial akun (terenkripsi) → processing |
| GET    | `/joki/queue`                    | ✓    | booster/admin | Antrean pekerjaan joki |
| POST   | `/orders/{order}/assign`         | ✓    | booster/admin | Ambil/assign booster |
| POST   | `/orders/{order}/transition`     | ✓    | booster/admin | Ubah status workflow |
| GET    | `/orders/{order}/progress`       | ✓    | terkait | List progres |
| POST   | `/orders/{order}/progress`       | ✓    | booster/admin | Tambah progres (+ screenshot) |

## Chat
| Method | Endpoint                  | Auth | Deskripsi |
|--------|---------------------------|------|-----------|
| GET    | `/orders/{order}/chats`   | ✓    | Riwayat chat |
| POST   | `/orders/{order}/chats`   | ✓    | Kirim pesan |

## Notifikasi
| Method | Endpoint                          | Auth |
|--------|-----------------------------------|------|
| GET    | `/notifications`                  | ✓    |
| POST   | `/notifications/{id}/read`        | ✓    |
| POST   | `/notifications/read-all`         | ✓    |

## AI
| Method | Endpoint                | Auth | Deskripsi |
|--------|-------------------------|------|-----------|
| POST   | `/ai/chat`              | —    | Chatbot NLP. Body: `message` |
| GET    | `/ai/recommendations`   | ✓    | Rekomendasi personalisasi |
| POST   | `/ai/price-quote`       | ✓    | Dynamic pricing. Body: `product_id`, `context?` |

## Admin
| Method | Endpoint                    | Auth | Role  |
|--------|-----------------------------|------|-------|
| GET    | `/admin/dashboard`          | ✓    | admin |
| GET    | `/admin/orders`             | ✓    | admin |
| GET    | `/admin/users`              | ✓    | admin |
| POST   | `/admin/users/{user}/role`  | ✓    | admin |
| POST   | `/admin/products`           | ✓    | admin |
| PUT    | `/admin/products/{product}` | ✓    | admin |
| DELETE | `/admin/products/{product}` | ✓    | admin |

## Status Pesanan
`pending → waiting_for_account → processing → completed → finished` (+ `cancelled`).
Top-up: `pending → processing → finished` otomatis setelah pembayaran.
