<?php

namespace App\Jobs;

use App\Models\Notification;
use App\Services\Kafka\TransactionQueue;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * Persists an in-app notification and publishes it to the notification topic.
 * Runs on the queue (TRANSACTION_QUEUE_DRIVER / Laravel queue).
 */
class PushNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public int $userId,
        public string $title,
        public string $body,
        public string $type = 'info',
        public array $data = [],
    ) {}

    public function handle(TransactionQueue $queue): void
    {
        Notification::create([
            'user_id' => $this->userId,
            'title' => $this->title,
            'body' => $this->body,
            'type' => $this->type,
            'data' => $this->data ?: null,
        ]);

        $queue->publish(TransactionQueue::TOPIC_NOTIFICATION, [
            'user_id' => $this->userId,
            'title' => $this->title,
            'type' => $this->type,
        ]);
    }
}
