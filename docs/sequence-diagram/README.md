# Verand Store — Sequence Diagram

Dokumen ini memodelkan interaksi sekuensial antar entitas sistem.

---

## 1. Sequence Diagram: Alur Pembayaran & Webhook Midtrans

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Pelanggan
    participant Frontend as Next.js Web
    participant Backend as Laravel API
    participant Midtrans as Midtrans Gateway
    participant DB as MySQL DB
    participant Queue as Kafka / Queue

    Customer->>Frontend: Pilih produk & checkout
    Frontend->>Backend: POST /api/orders (create order)
    Backend->>DB: Simpan order (status: pending, unpaid)
    Backend-->>Frontend: Detail order
    Frontend->>Backend: POST /api/orders/{id}/pay
    Backend->>Midtrans: Request Snap Token (Gross Amount, Order ID)
    Midtrans-->>Backend: Snap Token & Redirect URL
    Backend->>DB: Simpan record payments (status: pending)
    Backend-->>Frontend: Snap Token & Redirect URL
    Frontend->>Customer: Tampilkan Pop-up Snap Midtrans
    Customer->>Midtrans: Bayar tagihan (QRIS / VA / E-Wallet)
    Midtrans-->>Customer: Pembayaran Berhasil
    Midtrans->>Backend: POST /api/payments/callback (Webhook)
    Backend->>Backend: Verifikasi SHA512 Signature
    alt Signature Valid
        Backend->>DB: Update payments (paid) & orders (paid)
        Backend->>Queue: Publish event "payment-success"
        Backend-->>Midtrans: 200 OK
        Frontend->>Backend: Polling / Refetch status order
        Backend-->>Frontend: Order status: paid
        Frontend->>Customer: Tampilkan layar konfirmasi sukses
    else Signature Tidak Valid
        Backend-->>Midtrans: 403 Forbidden
    end
```

---

## 2. Sequence Diagram: Alur Pengerjaan Joki & Update Progres

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Pelanggan
    participant Frontend as Next.js Web
    participant Backend as Laravel API
    actor Booster as Pro Booster
    participant DB as MySQL DB

    Customer->>Frontend: Buka dashboard pesanan joki
    Customer->>Frontend: Input username & password game
    Frontend->>Backend: POST /api/orders/{id}/submit-account
    Backend->>Backend: Enkripsi kredensial (AES-256)
    Backend->>DB: Update joki_orders & orders (status: processing)
    Backend-->>Frontend: Berhasil submit akun

    Booster->>Frontend: Akses Antrean Joki (/booster)
    Frontend->>Backend: GET /api/joki/queue
    Backend-->>Frontend: Daftar pekerjaan tersedia
    Booster->>Frontend: Klaim pekerjaan
    Frontend->>Backend: POST /api/orders/{id}/assign
    Backend->>DB: Assign booster_id

    loop Proses Pengerjaan
        Booster->>Frontend: Upload progres & screenshot bukti
        Frontend->>Backend: POST /api/orders/{id}/progress (multipart/form-data)
        Backend->>DB: Insert progress_logs & update progress percent
        Backend-->>Frontend: Progres tersimpan
        Customer->>Frontend: Cek progres log & chat booster
        Customer->>Frontend: Kirim pesan di chat order
        Frontend->>Backend: POST /api/orders/{id}/chats
        Backend->>DB: Simpan record chats
        Booster->>Frontend: Membaca & membalas pesan chat
    end

    Booster->>Frontend: Tandai selesai (100%)
    Frontend->>Backend: POST /api/orders/{id}/transition (to: completed)
    Backend->>DB: Update orders (status: completed)
    Customer->>Frontend: Konfirmasi hasil pengerjaan akun
    Frontend->>Backend: POST /api/orders/{id}/transition (to: finished)
    Backend->>DB: Update orders (status: finished)
```
