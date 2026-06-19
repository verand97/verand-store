# Kafka Consumer

Consumer memproses event dari topik dan menjalankan aksi downstream
(kirim currency top-up, assign booster, push notifikasi).

Dalam mode default (tanpa broker), peran consumer dijalankan langsung oleh
`OrderService` + Laravel Jobs (`app/Jobs/`). Untuk Kafka asli, buat command
artisan yang men-subscribe topik.

## Contoh (laravel-kafka)
```php
use Junges\Kafka\Facades\Kafka;

Kafka::consumer(['payment-success'])
    ->withHandler(function ($message) {
        // proses order_number dari $message->getBody()
    })
    ->build()
    ->consume();
```
