<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'up'],
    'allowed_methods' => ['*'],
    'allowed_origins' => array_values(array_unique(array_filter(array_map(
        'trim',
        array_merge(
            [
                'https://shadow-attendance.rentroomcambodia.com',
                'https://shadow-attendance.vercel.app',
            ],
            explode(',', (string) env('CORS_ALLOWED_ORIGINS', ''))
        )
    )))),
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 7200,
    'supports_credentials' => true,
];
