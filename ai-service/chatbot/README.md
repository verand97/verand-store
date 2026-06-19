# AI — Chatbot

Implementasi: `backend/app/Services/AI/ChatbotService.php` (rule-based NLP).
Endpoint: `POST /api/ai/chat` (body: `message`).

Kemampuan: cek status pesanan (deteksi nomor order), info pembayaran, estimasi
(ETA), penanganan komplain, dan info layanan joki/top-up. Mode remote
(`AI_MODE=remote`) memproksi ke microservice di sini.
