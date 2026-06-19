<?php

namespace App\Events;

use App\Models\Order;
use App\Models\ProgressLog;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProgressUpdated
{
    use Dispatchable, SerializesModels;

    public function __construct(public Order $order, public ProgressLog $log) {}
}
