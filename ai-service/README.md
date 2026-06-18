# AI Service

Berisi titik integrasi AI untuk Verand Store. Implementasi default berjalan
**di dalam Laravel** (rule-based) pada `backend/app/Services/AI/`:

- `chatbot/` — asisten NLP (status pesanan, FAQ, komplain, ETA).
- `recommendation/` — rekomendasi layanan dari riwayat transaksi.
- `pricing/` — dynamic pricing berdasarkan kesulitan, progres, ketersediaan booster, surge.
- `webhook/` — penerima event (mis. update status untuk chatbot).

## Mode Remote (opsional)
Set `AI_MODE=remote` dan `AI_SERVICE_URL` di backend untuk mengalihkan ke
microservice eksternal (mis. FastAPI + model NLP). Kontrak endpoint yang
diharapkan: `POST /chat`, `GET /recommendations`, `POST /price-quote`.
