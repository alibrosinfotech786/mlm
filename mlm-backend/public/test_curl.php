<?php
// Test if cURL extension is enabled
if (function_exists('curl_version')) {
    $curlVersion = curl_version();
    echo "<h2>✅ cURL is ENABLED</h2>";
    echo "<p><strong>cURL Version:</strong> " . $curlVersion['version'] . "</p>";
    echo "<p><strong>SSL Version:</strong> " . $curlVersion['ssl_version'] . "</p>";
    echo "<p><strong>Supported Protocols:</strong> " . implode(', ', $curlVersion['protocols']) . "</p>";
    
    // Test actual cURL request
    echo "<h3>Testing cURL with SendGrid API...</h3>";
    $ch = curl_init('https://api.sendgrid.com/v3/user/profile');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer YOUR_API_KEY_HERE' // Replace with your actual API key for real test
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "<p><strong>HTTP Status:</strong> " . $httpCode . "</p>";
    if ($httpCode > 0) {
        echo "<p style='color: green;'>✅ cURL can make HTTPS requests successfully!</p>";
    }
} else {
    echo "<h2 style='color: red;'>❌ cURL is NOT ENABLED</h2>";
    echo "<p>Please enable the cURL extension in cPanel's PHP Selector.</p>";
}

// Show PHP version
echo "<hr>";
echo "<p><strong>PHP Version:</strong> " . PHP_VERSION . "</p>";
?>

