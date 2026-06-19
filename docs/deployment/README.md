# Deployment — Verand Store

## Opsi 1: Docker Compose (paling sederhana)
```bash
cp .env.example .env   # sesuaikan kredensial
docker compose up -d --build
```
Layanan: MySQL (3306), Kafka (9092), backend (8000), frontend (3000).

## Opsi 2: Manual (VPS)
1. **Backend**: PHP 8.3 + Composer, `php artisan migrate --seed`, jalankan di
   belakang Nginx + PHP-FPM (lihat `infrastructure/nginx/`).
2. **Frontend**: `npm run build && npm run start` (Next.js) atau host statis.
3. **MySQL 8** terpisah, set `DB_*` di `.env`.
4. **Kafka** (opsional): set `TRANSACTION_QUEUE_DRIVER=kafka`.
5. **Queue worker**: `php artisan queue:work` (untuk Jobs notifikasi/proses).

## Opsi 3: Kubernetes
Manifest di `infrastructure/kubernetes/`. Provisioning cloud via
`infrastructure/terraform/`. Monitoring via `infrastructure/monitoring/`.

## Checklist Produksi
- [ ] `APP_DEBUG=false`, `APP_ENV=production`
- [ ] Kredensial Midtrans production + webhook URL terdaftar
- [ ] HTTPS / TLS aktif (Nginx)
- [ ] `php artisan config:cache route:cache`
- [ ] Queue worker berjalan (supervisor/systemd)
- [ ] Backup DB terjadwal (`scripts/backup.sh`)
