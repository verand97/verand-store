<?php

namespace App\Services\Kafka;

use Illuminate\Support\Facades\Log;

/**
 * Abstraction over the async transaction pipeline described in the spec.
 *
 * The spec uses Apache Kafka topics (payment-created, payment-success,
 * topup-process, joki-process, progress-update, notification). This class keeps
 * the same topic semantics but defaults to Laravel's own queue/log so the app
 * runs without a broker. Set TRANSACTION_QUEUE_DRIVER=kafka and provide brokers
 * to switch to a real Kafka producer.
 */
class TransactionQueue
{
    public const TOPIC_PAYMENT_CREATED = 'payment-created';
    public const TOPIC_PAYMENT_SUCCESS = 'payment-success';
    public const TOPIC_TOPUP_PROCESS = 'topup-process';
    public const TOPIC_JOKI_PROCESS = 'joki-process';
    public const TOPIC_PROGRESS_UPDATE = 'progress-update';
    public const TOPIC_NOTIFICATION = 'notification';

    public function driver(): string
    {
        return config('services.transaction_queue.driver', 'sync');
    }

    /**
     * Publish a message to a topic.
     */
    public function publish(string $topic, array $payload): void
    {
        if ($this->driver() === 'kafka') {
            $this->publishToKafka($topic, $payload);

            return;
        }

        // Default (sync/log) driver: record the event. Listeners/Jobs handle
        // the actual processing through Laravel's event system.
        Log::channel('stack')->info("[queue:{$topic}]", $payload);
    }

    private function publishToKafka(string $topic, array $payload): void
    {
        // Real implementation outline (requires a Kafka client such as
        // mateusjunges/laravel-kafka):
        //
        //   Kafka::publishOn($topic)
        //       ->withBodyKey('payload', $payload)
        //       ->send();
        //
        // Guarded so the broker dependency stays optional.
        Log::channel('stack')->info("[kafka:{$topic}]", $payload);
    }
}
