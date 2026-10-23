# Verand Store — Flowchart Alur Kerja

Dokumen ini memuat diagram alur proses bisnis utama di Verand Store.

---

## 1. Alur Transaksi Top-Up Otomatis

```mermaid
flowchart TD
    Start([Pelanggan Membuka Halaman Top-Up]) --> InputUID[Input Game UID & Server]
    InputUID --> ValidateUID{Validasi UID API}
    ValidateUID -- Tidak Valid --> ErrorUID[Tampilkan Pesan Error Format UID]
    ErrorUID --> InputUID
    ValidateUID -- Valid --> SelectProduct[Pilih Nominal / Produk]
    SelectProduct --> Checkout[Klik Beli Sekarang / Checkout]
    Checkout --> CreateOrder[Laravel: Buat Order pending / unpaid]
    CreateOrder --> Pay[Generate Midtrans Snap Token]
    Pay --> CustomerPay[Pelanggan Membayar via QRIS / VA / E-Wallet]
    CustomerPay --> Webhook[Midtrans Mengirim Webhook Callback]
    Webhook --> VerifySign{Verifikasi Signature SHA512}
    VerifySign -- Gagal --> RejectCallback[Tolak Request 403]
    VerifySign -- Sukses --> MarkPaid[Update Status: paid]
    MarkPaid --> Deliver[Kirim Item Otomatis via Game API]
    Deliver --> FinishTopup[Update Status: finished]
    FinishTopup --> SendNotif[Kirim Notifikasi ke Pengguna]
    SendNotif --> EndTopup([Selesai])
```

---

## 2. Alur Siklus Pengerjaan Jasa Joki (Stateful Workflow)

```mermaid
flowchart TD
    A([Order Joki Dibuat & Dibayar]) --> B[Status: waiting_for_account]
    B --> C[Pelanggan Input Data Login Akun Game]
    C --> D[Enkripsi Data Kredensial AES-256]
    D --> E[Status Beralih: processing]
    E --> F{Penugasan Booster}
    F -- Auto-Assign --> G[Pilih Booster Beban Terendah]
    F -- Manual / Klaim --> H[Booster Mengambil Order dari Queue]
    G --> I[Booster Mengerjakan Pesanan]
    H --> I
    I --> J[Booster Upload Log Progres & Screenshot]
    J --> K[Pelanggan Melihat Progres & Chat Internal]
    K --> L{Target Tercapai?}
    L -- Belum --> I
    L -- Ya: Progres 100% --> M[Status Beralih: completed]
    M --> N[Pelanggan / Admin Konfirmasi Hasil]
    N --> O[Status Beralih: finished]
    O --> P([Pesanan Selesai & Beri Review])

    E -. Pembatalan Darurat .-> Q[Status: cancelled]
    B -. Pelanggan Batal .-> Q
```
