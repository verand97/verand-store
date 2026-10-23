# Verand Store — Panduan Deployment & Infrastruktur

Folder `infrastructure/` dan file `docker-compose.yml` menyediakan konfigurasi siap pakai untuk berbagai target deployment.

---

## 1. Menjalankan via Docker Compose

Cara termudah menjalankan seluruh stack (MySQL, Laravel Backend, Next.js Frontend):

```bash
# 1. Pastikan file konfigurasi siap
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# 2. Build dan jalankan seluruh container
docker compose up -d --build

# 3. Jalankan migrasi dan seeder awal
docker compose exec backend php artisan migrate --seed
docker compose exec backend php artisan storage:link
```

Port mapping default:
* **Frontend Web**: `http://localhost:3000`
* **Backend API**: `http://localhost:8000`
* **MySQL Database**: `localhost:3306`

---

## 2. Nginx Reverse Proxy

Konfigurasi Nginx tersedia di [`infrastructure/nginx/verand-store.conf`](../../infrastructure/nginx/verand-store.conf).

Fitur konfigurasi:
* Routing `/api/*` diteruskan ke backend upstream (`http://127.0.0.1:8000`).
* Routing `/*` diteruskan ke frontend Next.js upstream (`http://127.0.0.1:3000`).
* HTTP/2 dan WebSocket support (untuk streaming data & live chat).
* Batasan upload ukuran berkas hingga 10MB (untuk screenshot bukti joki).
* Header keamanan: `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`.

---

## 3. Kubernetes Deployment

Manifest Kubernetes tersedia di [`infrastructure/kubernetes/deployment.yaml`](../../infrastructure/kubernetes/deployment.yaml).

Struktur manifest:
* `Deployment` untuk frontend (replika multi-pod) dan backend.
* `Service` ClusterIP untuk komunikasi internal antar pod.
* `Ingress` dengan SSL termination dan path-based routing.

Cara deploy:
```bash
kubectl apply -f infrastructure/kubernetes/deployment.yaml
```

---

## 4. Terraform Cloud Provisioning

File template Terraform berada di [`infrastructure/terraform/main.tf`](../../infrastructure/terraform/main.tf) untuk mengorkestrasi resource VPS/Cloud (Compute instance, Managed Database, Firewall/Security Group).

```bash
cd infrastructure/terraform
terraform init
terraform plan
terraform apply
```

---

## 5. Checklist Kesiapan Produksi (Production Checklist)

1. **Keamanan**:
   * Ubah `APP_ENV=production` dan `APP_DEBUG=false` di file `.env`.
   * Jalankan `php artisan key:generate` untuk kunci enkripsi kredensial unik.
   * Konfigurasi kredensial produksi Midtrans (`MIDTRANS_IS_PRODUCTION=true`).
2. **Kinerja & Optimasi**:
   * Jalankan `php artisan config:cache` dan `php artisan route:cache`.
   * Jalankan `npm run build` di frontend untuk menghasilkan bundle produksi Next.js.
   * Pastikan symlink storage telah dibuat: `php artisan storage:link`.
