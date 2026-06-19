<?php

namespace App\Providers;

use App\Events\ProgressUpdated;
use App\Listeners\SendProgressNotification;
use App\Models\Order;
use App\Policies\OrderPolicy;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Gate::policy(Order::class, OrderPolicy::class);

        Event::listen(ProgressUpdated::class, SendProgressNotification::class);
    }
}
