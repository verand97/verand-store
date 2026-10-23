# Verand Store — Dokumentasi REST API

Base URL: `http://127.0.0.1:8000/api`

Semua request yang membutuhkan autentikasi harus menyertakan header:
```http
Authorization: Bearer <sanctum_token>
Accept: application/json
```

---

## 1. Sistem & Kesehatan

### `GET /health`
Cek ketersediaan dan status server API.
* **Autentikasi**: Publik
* **Respons `200 OK`**:
```json
{
  "status": "ok",
  "app": "Verand Store API"
}
```

---

## 2. Autentikasi (`/auth`)

### `POST /auth/register`
Mendaftarkan akun customer baru.
* **Payload**:
```json
{
  "name": "Budi Santoso",
  "email": "budi@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "08123456789"
}
```
* **Respons `201 Created`**: Mengembalikan objek user dan Sanctum `token`.

### `POST /auth/login`
Autentikasi akun dan generate bearer token.
* **Payload**:
```json
{
  "email": "customer@verand.store",
  "password": "password"
}
```
* **Respons `200 OK`**: `{ "user": {...}, "token": "1|..." }`

### `GET /auth/me`
Mendapatkan profil user yang sedang login.
* **Autentikasi**: Wajib (Sanctum)

### `POST /auth/logout`
Mencabut token sesi aktif.
* **Autentikasi**: Wajib (Sanctum)

---

## 3. Katalog Produk (`/products`)

### `GET /products`
Mendapatkan daftar produk aktif.
* **Query Params**:
  * `game` (opsional): `mobile-legends`, `genshin-impact`, `honkai-star-rail`
  * `type` (opsional): `topup`, `joki`
  * `category` (opsional): kategori spesifik produk
* **Respons `200 OK`**: Array of Product.

### `GET /products/{slug}`
Detail satu produk berdasarkan slug.

---

## 4. Top-Up Game (`/topup`)

### `POST /topup/validate-uid`
Validasi UID akun game sebelum checkout.
* **Payload**:
```json
{
  "game": "mobile-legends",
  "uid": "12345678",
  "server": "2048"
}
```
* **Respons `200 OK`**:
```json
{
  "valid": true,
  "nickname": "MLBB_5678",
  "message": "UID valid (mode pengembangan)."
}
```

---

## 5. Layanan Joki Game (`/joki`)

### `GET /joki/mobile-legends/services`
Katalog layanan joki MLBB (Rank Boost, Winrate, MMR, Placement, Event).

### `GET /joki/genshin-impact/services`
Katalog layanan joki Genshin Impact (Daily, Boss, Story, Exploration, Paket Combo).

### `GET /joki/honkai-star-rail/services`
Katalog layanan joki Honkai Star Rail (Daily Training, Power, Weekly, Story, Eksplorasi).

---

## 6. Transaksi & Pesanan (`/orders`)

### `GET /orders`
Daftar riwayat pesanan milik customer yang sedang login.
* **Autentikasi**: Wajib (Sanctum)

### `POST /orders`
Membuat pesanan baru (Top-up atau Joki).
* **Autentikasi**: Wajib (Sanctum)
* **Payload**:
```json
{
  "type": "topup",
  "items": [
    {
      "product_id": 1,
      "quantity": 1,
      "options": { "game": "mobile-legends", "uid": "12345678", "server": "2048" }
    }
  ],
  "meta": { "game": "mobile-legends" }
}
```

### `GET /orders/{order}`
Detail lengkap pesanan beserta pembayaran, status joki, dan progres log.

---

## 7. Pembayaran (`/payments` & `/orders/{order}/pay`)

### `POST /orders/{order}/pay`
Menginisialisasi pembayaran Midtrans Snap token.
* **Autentikasi**: Wajib (Pemilik order)
* **Respons `200 OK`**:
```json
{
  "snap_token": "STUB-...",
  "redirect_url": "http://localhost:3000/checkout/mock-pay?order=VS...",
  "client_key": "...",
  "is_stub": true
}
```

### `POST /orders/{order}/mock-confirm`
Simulasi konfirmasi pembayaran instan (khusus development stub).

### `POST /payments/callback`
Webhook penerima notifikasi pembayaran Midtrans (diverifikasi dengan signature SHA512).

---

## 8. Alur Pengerjaan Joki & Chat

### `POST /orders/{order}/submit-account`
Customer menyerahkan kredensial akun game (terenkripsi 256-bit). Status order beralih dari `waiting_for_account` ke `processing`.

### `GET /orders/{order}/progress`
Daftar catatan progres joki (persentase, log aktivitas, screenshot).

### `GET /orders/{order}/chats` & `POST /orders/{order}/chats`
Chat internal terisolasi antara customer dan booster untuk pesanan terkait.

---

## 9. Fitur Booster (`role:booster,admin`)

### `GET /joki/queue`
Daftar antrean pekerjaan joki yang belum diambil atau sedang dikerjakan.

### `GET /joki/booster/stats`
Statistik performa booster (pekerjaan aktif, selesai, ketersediaan antrean).

### `POST /orders/{order}/assign`
Mengambil pekerjaan joki atau penugasan oleh admin.

### `POST /orders/{order}/transition`
Mengubah status tahapan pekerjaan (`processing` → `completed` → `finished`).

### `POST /orders/{order}/progress`
Booster mengunggah update progres pengerjaan (persen, deskripsi, screenshot).

---

## 10. Fitur AI Assistant (`/ai`)

### `POST /ai/chat`
Konsultasi NLP chatbot seputar FAQ, cek nomor resi, rekomendasi, atau garansi.

### `GET /ai/recommendations`
Rekomendasi paket produk berdasarkan akun customer.

### `POST /ai/price-quote`
Estimasi harga dinamis berdasarkan tingkat kesulitan, level akun, dan lonjakan event.

---

## 11. Administrasi (`/admin`)

Khusus role `admin`:
* `GET /admin/dashboard` — Metrik revenue, pesanan aktif, total pengguna.
* `GET /admin/orders` — Manajemen seluruh pesanan dengan filter status.
* `GET /admin/users` — Manajemen daftar user.
* `POST /admin/users/{user}/role` — Mengubah hak akses role pengguna.
* `POST /admin/products` — Menambah produk baru.
* `PUT /admin/products/{product}` — Memperbarui data produk.
* `DELETE /admin/products/{product}` — Menghapus produk.
