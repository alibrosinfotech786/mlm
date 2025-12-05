<?php

/**
 * SendGrid cURL Test Script
 * 
 * This script tests the SendGrid API connectivity using cURL.
 * Make sure to set your SENDGRID_API_KEY in the .env file before running.
 * 
 * Usage: Access via browser or run via CLI: php public/test_curl.php
 */

// Load Laravel environment
require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Get SendGrid API key from environment
$apiKey = env('SENDGRID_API_KEY');
$fromEmail = env('MAIL_FROM_ADDRESS', 'test@example.com');
$fromName = env('MAIL_FROM_NAME', 'Test Sender');
$toEmail = env('MAIL_TEST_TO', 'test@example.com'); // Set this in .env for testing

if (empty($apiKey)) {
    die("Error: SENDGRID_API_KEY is not set in .env file.\n");
}

if ($toEmail === 'test@example.com') {
    die("Error: Please set MAIL_TEST_TO in .env file with a valid email address.\n");
}

echo "Testing SendGrid API with cURL...\n\n";
echo "API Key: " . substr($apiKey, 0, 10) . "...\n";
echo "From: {$fromName} <{$fromEmail}>\n";
echo "To: {$toEmail}\n\n";

// Prepare payload
$payload = [
    'personalizations' => [
        [
            'to' => [
                [
                    'email' => $toEmail,
                ],
            ],
        ],
    ],
    'from' => [
        'email' => $fromEmail,
        'name' => $fromName,
    ],
    'subject' => 'SendGrid cURL Test Email',
    'content' => [
        [
            'type' => 'text/html',
            'value' => '<h1>SendGrid cURL Test</h1><p>This is a test email sent via cURL to SendGrid API.</p><p>If you received this, the integration is working correctly!</p>',
        ],
        [
            'type' => 'text/plain',
            'value' => 'SendGrid cURL Test\n\nThis is a test email sent via cURL to SendGrid API.\n\nIf you received this, the integration is working correctly!',
        ],
    ],
];

// Send via cURL
$ch = curl_init();

curl_setopt_array($ch, [
    CURLOPT_URL => 'https://api.sendgrid.com/v3/mail/send',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
    ],
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
$curlInfo = curl_getinfo($ch);

curl_close($ch);

// Display results
echo "=== cURL Test Results ===\n\n";

if ($error) {
    echo "❌ cURL Error: {$error}\n";
    exit(1);
}

echo "HTTP Status Code: {$httpCode}\n";
echo "Response Time: " . round($curlInfo['total_time'], 2) . " seconds\n\n";

if ($httpCode === 202) {
    echo "✅ SUCCESS! Email sent successfully.\n";
    echo "SendGrid accepted the email for delivery.\n";
    echo "Check the inbox of: {$toEmail}\n";
} elseif ($httpCode >= 400) {
    echo "❌ ERROR: SendGrid API returned an error.\n";
    echo "Response: " . ($response ?: 'No response body') . "\n";
    
    if ($response) {
        $errorData = json_decode($response, true);
        if (isset($errorData['errors'])) {
            echo "\nError Details:\n";
            foreach ($errorData['errors'] as $err) {
                echo "  - " . ($err['message'] ?? json_encode($err)) . "\n";
            }
        }
    }
    exit(1);
} else {
    echo "⚠️  Unexpected response code: {$httpCode}\n";
    echo "Response: " . ($response ?: 'No response body') . "\n";
}

echo "\n=== Test Complete ===\n";

