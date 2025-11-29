<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        // 'http://www.tathastuayurveda.world',
        // 'https://www.tathastuayurveda.world',
        // 'http://tathastuayurveda.world',
        // 'https://tathastuayurveda.world',
        // 'http://tathastuayurved.world',
        // 'https://tathastuayurved.world',
        '*'
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];