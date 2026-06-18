<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'midtrans' => [
        'server_key' => env('MIDTRANS_SERVER_KEY'),
        'client_key' => env('MIDTRANS_CLIENT_KEY'),
        'merchant_id' => env('MIDTRANS_MERCHANT_ID'),
        'is_production' => env('MIDTRANS_IS_PRODUCTION', false),
    ],

    'transaction_queue' => [
        'driver' => env('TRANSACTION_QUEUE_DRIVER', 'sync'),
        'brokers' => env('KAFKA_BROKERS', '127.0.0.1:9092'),
    ],

    'ai' => [
        'mode' => env('AI_MODE', 'rule'),
        'url' => env('AI_SERVICE_URL'),
    ],

    'game_voucher' => [
        'url' => env('GAME_VOUCHER_API_URL'),
    ],

    'genshin' => [
        'url' => env('GENSHIN_API_URL'),
    ],

    'hsr' => [
        'url' => env('HSR_API_URL'),
    ],

];
