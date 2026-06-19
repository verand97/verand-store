# Kafka Producer

Producer diimplementasikan di backend Laravel:
`backend/app/Services/Kafka/TransactionQueue.php` (method `publish()` /
`publishToKafka()`).

Event yang dipublish: lihat `../README.md`. Saat `TRANSACTION_QUEUE_DRIVER=sync`
event hanya ditulis ke log; saat `kafka`, dikirim ke broker.

## Contoh (laravel-kafka)
```php
use Junges\Kafka\Facades\Kafka;

Kafka::publishOn('payment-success')
    ->withBodyKey('order_number', $order->order_number)
    ->send();
```
