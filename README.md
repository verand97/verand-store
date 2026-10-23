# Verand Store

Platform e-commerce digital untuk **top-up game** dan **jasa joki profesional**
(Mobile Legends, Genshin Impact, Honkai: Star Rail). Dibangun dengan arsitektur
full-stack modern: **Laravel** (REST API) + **MySQL** + **Next.js**, dengan
abstraksi **Apache Kafka** untuk antrean transaksi asinkron, integrasi
**Midtrans** untuk pembayaran, dan layanan **AI** (chatbot, rekomendasi,
dynamic pricing).

## Arsitektur

```
[ Next.js Frontend ] --HTTP/JSON--> [ Laravel API ] --> [ MySQL ]
                                          |
                                          +--> Midtrans (payment gateway)
                                          +--> Kafka topics (async pipeline)
                                          +--> AI services (chatbot/rekomendasi/pricing)
                                          +--> Game voucher / UID validation APIs
```

## Fitur Utama

- **Autentikasi & RBAC** — peran `customer`, `booster`, `admin` (Laravel Sanctum).
- **Top-up instan** — Mobile Legends, Genshin, HSR; validasi UID + pengiriman otomatis.
- **Jasa joki** — Rank Boost, Winrate, Placement, MMR (ML); perawatan akun, Weekly Boss,
  Story, Eksplorasi (Genshin & HSR).
- **Workflow stateful** — `pending → waiting_for_account → processing → completed → finished`.
- **Dashboard progres** — persentase, aktivitas, screenshot, ETA.
- **Chat internal** — komunikasi customer ⇄ booster (kredensial tidak keluar aplikasi).
- **Pembayaran** — Midtrans (QRIS, VA, e-wallet, transfer bank) + webhook.
- **AI** — chatbot NLP, rekomendasi personalisasi, dynamic pricing.
- **Antrean asinkron** — abstraksi Kafka (default ke Laravel queue tanpa broker).

## Menjalankan (Development)

### Prasyarat
- PHP 8.3+, Composer
- Node.js 20+, npm
- MySQL 8

### Cara Cepat (Satu Perintah)
```bash
# Menjalankan backend & frontend sekaligus
npm run dev        # Windows (PowerShell)
npm run dev:sh     # Linux / macOS / WSL
```

### Manual

#### Backend (Laravel API)
```bash
cd backend
composer install
cp .env.example .env        # sesuaikan DB & kredensial
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve            # http://127.0.0.1:8000
```

#### Frontend (Next.js)
```bash
cd frontend
npm install
cp .env.example .env.local  # NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
npm run dev                 # http://localhost:3000
```

### Akun Demo (setelah seed)
| Peran    | Email                   | Password   |
|----------|-------------------------|------------|
| Admin    | admin@verand.store      | password   |
| Booster  | booster@verand.store    | password   |
| Customer | customer@verand.store   | password   |

## Mode Pengembangan vs Produksi

Beberapa integrasi memerlukan kredensial/infrastruktur eksternal. Saat kredensial
kosong, sistem otomatis memakai **stub** yang aman agar alur tetap dapat diuji:

| Integrasi        | Tanpa kredensial (default) | Dengan kredensial |
|------------------|----------------------------|-------------------|
| Midtrans         | Halaman bayar simulasi + endpoint mock-confirm | Snap token + redirect asli |
| Kafka            | Laravel log/queue          | Producer Kafka (set `TRANSACTION_QUEUE_DRIVER=kafka`) |
| AI               | Rule-based bawaan          | Microservice (`AI_MODE=remote`) |
| Game voucher/UID | Validasi stub              | API penyedia |

## 📚 Dokumentasi Lengkap (`docs/`)

Kunjungi folder [`docs/`](./docs/README.md) untuk dokumentasi teknis mendalam:
* [**API Reference**](./docs/api/README.md) — Endpoint REST API lengkap, payload, dan respons.
* [**Arsitektur Sistem**](./docs/architecture/README.md) — Struktur decouple Next.js, Laravel, Kafka, dan AI.
* [**Basis Data**](./docs/database/README.md) — Skema tabel MySQL, tipe data, dan relasi.
* [**Entity Relationship Diagram (ERD)**](./docs/erd/README.md) — Visualisasi Mermaid relasi tabel.
* [**Flowchart Alur Bisnis**](./docs/flowchart/README.md) — Alur transaksi top-up & siklus pengerjaan joki.
* [**Sequence Diagram**](./docs/sequence-diagram/README.md) — Diagram alur sekuensial pembayaran & progres.
* [**Panduan Deployment**](./docs/deployment/README.md) — Setup Docker, Nginx, Kubernetes, dan Terraform.

