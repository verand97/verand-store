<?php

namespace App\Listeners;

use App\Events\ProgressUpdated;
use App\Jobs\PushNotification;
use App\Services\Kafka\TransactionQueue;

class SendProgressNotification
{
    public function __construct(private TransactionQueue $queue) {}

    public function handle(ProgressUpdated $event): void
    {
        $order = $event->order;
        $log = $event->log;

        $this->queue->publish(TransactionQueue::TOPIC_PROGRESS_UPDATE, [
            'order_number' => $order->order_number,
            'percent' => $log->percent,
            'activity' => $log->activity,
        ]);

        PushNotification::dispatchSync(
            $order->user_id,
            'Progres diperbarui',
            "Pesanan {$order->order_number}: {$log->activity} ({$log->percent}%).",
            'progress'
        );
    }
}
