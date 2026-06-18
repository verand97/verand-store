# Kafka — Antrean Transaksi

Verand Store memakai Kafka sebagai message broker untuk memproses transaksi
secara asinkron. Implementasi diabstraksi di
`backend/app/Services/Kafka/TransactionQueue.php`.

## Topik
| Topik              | Dipublikasikan saat |
|--------------------|---------------------|
| `payment-created`  | Order dibuat & pembayaran diinisiasi |
| `payment-success`  | Pembayaran terverifikasi |
| `topup-process`    | Pemrosesan pengiriman currency top-up |
| `joki-process`     | Order joki masuk antrean booster |
| `progress-update`  | Update status/progres pengerjaan |
| `notification`     | Notifikasi ke user |

## Mengaktifkan broker
Default `TRANSACTION_QUEUE_DRIVER=sync` (Laravel log/queue, tanpa broker).
Untuk Kafka asli:
1. Jalankan broker (lihat `docker-compose.yml` service `kafka`).
2. Set `TRANSACTION_QUEUE_DRIVER=kafka` dan `KAFKA_BROKERS=kafka:9092`.
3. Pasang client PHP (mis. `mateusjunges/laravel-kafka`) lalu lengkapi
   `TransactionQueue::publishToKafka()`.
