# Verand Store — Dokumentasi Proyek

Dokumentasi teknis, arsitektur, dan referensi sistem untuk **Verand Store**.

---

## 📚 Daftar Isi Dokumentasi

| Modul | Deskripsi | Dokumen |
|-------|-----------|---------|
| **API Reference** | Dokumentasi endpoint REST API, parameter, autentikasi, & respons | [`docs/api/README.md`](./api/README.md) |
| **Arsitektur Sistem** | Gambaran sistem, integrasi layanan, Kafka event pipeline, & AI | [`docs/architecture/README.md`](./architecture/README.md) |
| **Basis Data** | Struktur tabel, field types, indeks, dan relasi Eloquent | [`docs/database/README.md`](./database/README.md) |
| **Entity Relationship (ERD)** | Diagram relasi entitas visual menggunakan Mermaid | [`docs/erd/README.md`](./erd/README.md) |
| **Flowchart Alur Kerja** | Alur transaksi Top-Up otomatis & siklus status order Joki | [`docs/flowchart/README.md`](./flowchart/README.md) |
| **Sequence Diagram** | Interaksi sekuensial checkout, payment webhook, dan update progres | [`docs/sequence-diagram/README.md`](./sequence-diagram/README.md) |
| **Panduan Deployment** | Konfigurasi Docker, Nginx reverse proxy, Kubernetes, & Terraform | [`docs/deployment/README.md`](./deployment/README.md) |

---

## 🚀 Ringkasan Teknologi

* **Backend**: Laravel 11 (PHP 8.3) REST API + MySQL + Sanctum Auth
* **Frontend**: Next.js 16 (React 19) App Router + Tailwind-free Vanilla CSS modern
* **Payment Gateway**: Midtrans Snap & Webhook (dengan fallback stub untuk local development)
* **Message Broker / Queue**: Abstraksi Apache Kafka topics dengan fallback ke Laravel sync queue
* **Infrastruktur**: Docker Compose, Nginx, Kubernetes, Terraform
