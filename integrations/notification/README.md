# Integrasi Notifikasi

Notifikasi in-app: tabel `app_notifications`, dibuat via
`backend/app/Jobs/PushNotification.php` dan dipublish ke topik `notification`.

Kanal eksternal (opsional) bisa ditambahkan di sini:
- Email (Laravel Mail)
- WhatsApp / Telegram bot
- Web Push

Frontend membaca via `GET /api/notifications` (lihat hook
`frontend/hooks/useNotifications.js`).
