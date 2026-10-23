# Verand Store — Arsitektur Sistem

## 🏛️ Gambaran Umum Arsitektur

Verand Store dirancang dengan arsitektur **modern full-stack decoupling** yang memisahkan antarmuka pengguna responsif (Next.js) dan layanan API bisnis terpusat (Laravel).

```
┌────────────────────────────────────────────────────────┐
│                  Next.js 16 Frontend                   │
│         (App Router, React 19, Modern UI/UX)           │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / JSON API
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Laravel 11 Backend                   │
│        (REST API, Sanctum Auth, RBAC Middleware)       │
└──────┬────────────────────┬────────────────────┬───────┘
       │                    │                    │
       ▼                    ▼                    ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   MySQL 8    │     │   Midtrans   │     │  AI Engine   │
│  (Database)  │     │   Payment    │     │  & Chatbot   │
└──────────────┘     └──────────────┘     └──────────────┘
       ▲
       │ Async Topics Pipeline
┌──────┴─────────────────────────────────────────────────┐
│              Apache Kafka / Queue Abstraction          │
│  - payment-created          - joki-process             │
│  - payment-success          - progress-update          │
│  - topup-process            - notification             │
└────────────────────────────────────────────────────────┘
```

---

## 🧩 Komponen Sistem

### 1. Frontend (Next.js)
* **App Router**: Routing modern (`app/topup`, `app/joki/[game]`, `app/checkout`, `app/dashboard`, `app/booster`, `app/admin`).
* **State Management**: React Context API (`AuthContext`, `CartContext`) dan reusable custom hooks (`useNotifications`, `usePolling`).
* **Design & Styling**: Vanilla CSS berkinerja tinggi dengan CSS Variables, Glassmorphism, dan fluid layout tanpa overhead framework utility pihak ketiga.
* **Resilience Layer**: Menggunakan fallback otomatis katalog lokal saat backend sedang maintenance.

### 2. Backend (Laravel API)
* **Autentikasi**: Laravel Sanctum berbasis bearer tokens untuk SPA dan API clients.
* **RBAC (Role-Based Access Control)**: Middleware `EnsureRole` yang membatasi hak akses (`customer`, `booster`, `admin`).
* **Domain Layered Architecture**:
  * `Controllers`: Menangani validasi HTTP, delegasi service, dan standardisasi respons JSON.
  * `Services`: Mengelola alur bisnis (`OrderService`, `MidtransService`, `TopupService`, `JokiService`, `AI/*`).
  * `Models & Scopes`: Pemetaan ORM dengan Global Scopes (seperti model `Booster` yang merupakan representasi role-scoped dari `User`).

### 3. Asynchronous Pipeline (Abstraksi Kafka)
Sistem menggunakan `TransactionQueue` yang mengabstraksikan topik antrean pesan:
1. `payment-created` — Inisialisasi Snap token / tagihan pembayaran.
2. `payment-success` — Konfirmasi pelunasan dari webhook Midtrans.
3. `topup-process` — Pengiriman voucher/currency instan ke UID game.
4. `joki-process` — Pemasukan pesanan ke antrean booster terverifikasi.
5. `progress-update` — Pembaruan berkala aktivitas dan screenshot pengerjaan joki.
6. `notification` — Pengiriman notifikasi real-time in-app kepada customer.

*Mode Development*: Secara default berjalan dengan Laravel sync queue tanpa ketergantungan broker Kafka eksternal.

### 4. Mesin AI (Kecerdasan Buatan)
* **Chatbot NLP**: Menangani pertanyaan FAQ, verifikasi instan status nomor order, estimasi waktu, dan panduan keamanan akun.
* **Dynamic Pricing**: Algoritma kalkulasi harga joki berbasis tingkat kesulitan, rank awal, demand surge, dan ketersediaan booster aktif.
* **Personalisasi Rekomendasi**: Menyarankan produk top-up dan paket combo joki terbaik untuk pengguna.
