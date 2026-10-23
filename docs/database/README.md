# Verand Store — Struktur & Skema Basis Data

Basis data Verand Store menggunakan **MySQL 8** (dengan kompatibilitas penuh SQLite untuk testing in-memory).

---

## 📑 Daftar Tabel Utama

```text
users
 ├── orders
 │    ├── order_items (relasi ke products)
 │    ├── payments
 │    ├── joki_orders (relasi ke booster/users)
 │    │    └── progress_logs (relasi ke author/users)
 │    └── chats (relasi ke sender/users)
 └── notifications
```

---

## 1. Tabel `users`
Menyimpan identitas pengguna dengan peran berbasis RBAC.

| Kolom | Tipe Data | Keterangan |
|-------|-----------|------------|
| `id` | BIGINT UNSIGNED (PK) | Auto-increment primary key |
| `name` | VARCHAR(255) | Nama lengkap pengguna |
| `email` | VARCHAR(255) (UNIQUE) | Email unik untuk login |
| `password` | VARCHAR(255) | Hash password (Bcrypt/Argon2id) |
| `role` | ENUM(`customer`, `booster`, `admin`) | Default `customer` |
| `phone` | VARCHAR(30) (NULLABLE) | Nomor WhatsApp / telepon |
| `avatar` | VARCHAR(255) (NULLABLE) | Path avatar foto profil |
| `balance` | DECIMAL(14,2) | Saldo internal (default: 0.00) |
| `is_active` | BOOLEAN | Status aktif akun (default: true) |
| `created_at` / `updated_at` | TIMESTAMP | Timestamp standar Laravel |

---

## 2. Tabel `products`
Katalog item top-up dan paket layanan joki.

| Kolom | Tipe Data | Keterangan |
|-------|-----------|------------|
| `id` | BIGINT UNSIGNED (PK) | Auto-increment primary key |
| `game` | VARCHAR(50) | `mobile-legends`, `genshin-impact`, `honkai-star-rail` |
| `type` | ENUM(`topup`, `joki`) | Tipe produk |
| `category` | VARCHAR(50) (NULLABLE) | Misal: `diamond`, `crystal`, `rank`, `combo` |
| `name` | VARCHAR(255) | Nama paket/layanan |
| `slug` | VARCHAR(255) (UNIQUE) | URL identifier unik |
| `description` | TEXT (NULLABLE) | Detail deskripsi produk |
| `price` | DECIMAL(12,2) | Harga dalam Rupiah (IDR) |
| `unit` | VARCHAR(50) (NULLABLE) | Satuan unit (Diamonds, Crystals, Bintang) |
| `quantity` | INT (NULLABLE) | Jumlah unit |
| `image` | VARCHAR(255) (NULLABLE) | URL icon atau gambar produk |
| `meta` | JSON (NULLABLE) | Metadata tambahan (difficulty, bonus, tags) |
| `is_active` | BOOLEAN | Ketersediaan produk (default: true) |

---

## 3. Tabel `orders`
Induk transaksi pembelian top-up dan jasa joki.

| Kolom | Tipe Data | Keterangan |
|-------|-----------|------------|
| `id` | BIGINT UNSIGNED (PK) | Primary key |
| `order_number` | VARCHAR(40) (UNIQUE) | Format unik: `VSyymmddXXXXX` |
| `user_id` | BIGINT UNSIGNED (FK) | Relasi ke `users.id` |
| `type` | ENUM(`topup`, `joki`) | Tipe pesanan |
| `total_amount` | DECIMAL(14,2) | Total tagihan pembayaran |
| `status` | ENUM(`pending`, `waiting_for_account`, `processing`, `completed`, `finished`, `cancelled`) | Tahapan pesanan |
| `payment_status` | ENUM(`unpaid`, `paid`, `failed`, `expired`) | Status pelunasan |
| `meta` | JSON (NULLABLE) | Data konfigurasi tambahan |

---

## 4. Tabel `order_items`
Rincian item produk di dalam sebuah pesanan.

| Kolom | Tipe Data | Keterangan |
|-------|-----------|------------|
| `id` | BIGINT UNSIGNED (PK) | Primary key |
| `order_id` | BIGINT UNSIGNED (FK) | Relasi ke `orders.id` (Cascade delete) |
| `product_id` | BIGINT UNSIGNED (FK, NULLABLE) | Relasi ke `products.id` |
| `name` | VARCHAR(255) | Nama item tercatat saat transaksi |
| `price` | DECIMAL(12,2) | Harga satuan tercatat saat transaksi |
| `quantity` | INT | Kuantitas item |
| `options` | JSON (NULLABLE) | UID game, server, preferensi akun |

---

## 5. Tabel `payments`
Rekaman tagihan dan respons payment gateway (Midtrans).

| Kolom | Tipe Data | Keterangan |
|-------|-----------|------------|
| `id` | BIGINT UNSIGNED (PK) | Primary key |
| `order_id` | BIGINT UNSIGNED (FK) | Relasi ke `orders.id` |
| `gateway` | VARCHAR(50) | Default: `midtrans` |
| `reference` | VARCHAR(100) (INDEX) | Order ID referensi gateway |
| `method` | VARCHAR(50) (NULLABLE) | QRIS, BCA VA, GoPay, Mandiri, dll. |
| `amount` | DECIMAL(14,2) | Jumlah nominal pembayaran |
| `status` | ENUM(`pending`, `paid`, `failed`, `expired`, `refunded`) | Status pembayaran |
| `snap_token` | VARCHAR(255) (NULLABLE) | Token Snap Midtrans |
| `redirect_url` | TEXT (NULLABLE) | URL redirect pembayaran |
| `payload` | JSON (NULLABLE) | Raw response callback Midtrans |
| `paid_at` | TIMESTAMP (NULLABLE) | Waktu konfirmasi pembayaran |

---

## 6. Tabel `joki_orders`
Data khusus pengerjaan jasa joki dan penugasan booster.

| Kolom | Tipe Data | Keterangan |
|-------|-----------|------------|
| `id` | BIGINT UNSIGNED (PK) | Primary key |
| `order_id` | BIGINT UNSIGNED (FK) | Relasi ke `orders.id` |
| `booster_id` | BIGINT UNSIGNED (FK, NULLABLE) | Relasi ke `users.id` (Booster terpilih) |
| `game` | VARCHAR(50) | Game target |
| `service` | VARCHAR(50) | Layanan (Rank boost, Story, dll.) |
| `game_uid` | VARCHAR(50) (NULLABLE) | ID karakter/pemain |
| `game_server` | VARCHAR(50) (NULLABLE) | Server game |
| `account_login` | TEXT (NULLABLE) | Kredensial login (Terenkripsi AES-256) |
| `account_password` | TEXT (NULLABLE) | Password akun (Terenkripsi AES-256) |
| `targets` | JSON (NULLABLE) | Target bintang, rank, atau eksplorasi |
| `progress` | INT | Persentase progres (0 - 100%) |
| `eta` | VARCHAR(50) (NULLABLE) | Estimasi waktu pengerjaan |

---

## 7. Tabel `progress_logs`
Catatan bukti pengerjaan berkala oleh booster.

| Kolom | Tipe Data | Keterangan |
|-------|-----------|------------|
| `id` | BIGINT UNSIGNED (PK) | Primary key |
| `joki_order_id` | BIGINT UNSIGNED (FK) | Relasi ke `joki_orders.id` |
| `author_id` | BIGINT UNSIGNED (FK) | Relasi ke `users.id` (Pembuat log) |
| `percent` | INT | Progres tercapai (0 - 100) |
| `activity` | VARCHAR(255) | Keterangan aktivitas |
| `screenshot` | VARCHAR(255) (NULLABLE) | File bukti screenshot in-game |

---

## 8. Tabel `chats` & `notifications`
* **`chats`**: Komunikasi internal terisolasi per order (`order_id`, `sender_id`, `message`).
* **`notifications`**: Notifikasi in-app untuk pembaruan status transaksi & progres (`user_id`, `title`, `body`, `type`, `read_at`).
