<?php

/**
 * Simple cURL Support Test
 * 
 * This script tests if cURL is available and working on your server.
 * No SendGrid API key required - just checks basic cURL functionality.
 * 
 * Access via browser: http://your-domain.com/test_curl_support.php
 */

header('Content-Type: text/html; charset=utf-8');

?>
<!DOCTYPE html>
<html>
<head>
    <title>cURL Support Test</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .success { color: #28a745; font-weight: bold; }
        .error { color: #dc3545; font-weight: bold; }
        .info { color: #007bff; }
        pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
        h1 { color: #333; }
        .section { margin: 20px 0; padding: 15px; border-left: 4px solid #007bff; background: #f8f9fa; }
    </style>
</head>
<body>
    <h1>🔍 cURL Support Test</h1>
    
    <div class="section">
        <h2>1. PHP cURL Extension Check</h2>
        <?php
        if (function_exists('curl_version')) {
            $curlVersion = curl_version();
            echo '<p class="success">✅ cURL extension is INSTALLED</p>';
            echo '<p class="info">cURL Version: ' . htmlspecialchars($curlVersion['version']) . '</p>';
            echo '<p class="info">SSL Version: ' . htmlspecialchars($curlVersion['ssl_version']) . '</p>';
            echo '<p class="info">Supported Protocols: ' . implode(', ', $curlVersion['protocols']) . '</p>';
        } else {
            echo '<p class="error">❌ cURL extension is NOT INSTALLED</p>';
            echo '<p>Please contact your hosting provider to enable cURL extension.</p>';
            exit;
        }
        ?>
    </div>

    <div class="section">
        <h2>2. Basic cURL Functionality Test</h2>
        <?php
        // Test 1: Can we initialize cURL?
        $ch = curl_init();
        if ($ch === false) {
            echo '<p class="error">❌ Failed to initialize cURL</p>';
        } else {
            echo '<p class="success">✅ cURL initialized successfully</p>';
            
            // Test 2: Can we make a simple HTTPS request?
            curl_setopt_array($ch, [
                CURLOPT_URL => 'https://www.google.com',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT => 10,
                CURLOPT_SSL_VERIFYPEER => true,
                CURLOPT_SSL_VERIFYHOST => 2,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_NOBODY => true, // HEAD request only
            ]);
            
            $result = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $error = curl_error($ch);
            $curlInfo = curl_getinfo($ch);
            
            if ($error) {
                echo '<p class="error">❌ cURL Error: ' . htmlspecialchars($error) . '</p>';
            } else {
                echo '<p class="success">✅ HTTPS request successful</p>';
                echo '<p class="info">HTTP Status Code: ' . $httpCode . '</p>';
                echo '<p class="info">Response Time: ' . round($curlInfo['total_time'], 2) . ' seconds</p>';
                echo '<p class="info">Connected to: ' . htmlspecialchars($curlInfo['url']) . '</p>';
            }
            
            curl_close($ch);
        }
        ?>
    </div>

    <div class="section">
        <h2>3. SendGrid API Connectivity Test</h2>
        <?php
        // Test if we can reach SendGrid API endpoint
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => 'https://api.sendgrid.com/v3/mail/send',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
            CURLOPT_CUSTOMREQUEST => 'OPTIONS', // Use OPTIONS to avoid authentication requirement
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
            ],
        ]);
        
        $result = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        $curlInfo = curl_getinfo($ch);
        
        curl_close($ch);
        
        if ($error) {
            echo '<p class="error">❌ Cannot reach SendGrid API</p>';
            echo '<p class="error">Error: ' . htmlspecialchars($error) . '</p>';
            echo '<p>This might indicate:</p>';
            echo '<ul>';
            echo '<li>Firewall blocking outbound HTTPS connections</li>';
            echo '<li>Network connectivity issues</li>';
            echo '<li>DNS resolution problems</li>';
            echo '</ul>';
        } else {
            echo '<p class="success">✅ Can reach SendGrid API endpoint</p>';
            echo '<p class="info">HTTP Status Code: ' . $httpCode . '</p>';
            echo '<p class="info">Response Time: ' . round($curlInfo['total_time'], 2) . ' seconds</p>';
            echo '<p class="info">Connected to: ' . htmlspecialchars($curlInfo['url']) . '</p>';
            
            if ($httpCode == 405 || $httpCode == 401) {
                echo '<p class="success">✅ Endpoint is reachable (405/401 is expected without auth)</p>';
            }
        }
        ?>
    </div>

    <div class="section">
        <h2>4. PHP Configuration</h2>
        <pre>
PHP Version: <?php echo PHP_VERSION; ?>

allow_url_fopen: <?php echo ini_get('allow_url_fopen') ? 'Enabled' : 'Disabled'; ?>

cURL Functions Available:
<?php
$curlFunctions = [
    'curl_init',
    'curl_setopt',
    'curl_setopt_array',
    'curl_exec',
    'curl_getinfo',
    'curl_error',
    'curl_close',
    'curl_version'
];

foreach ($curlFunctions as $func) {
    echo $func . ': ' . (function_exists($func) ? '✅' : '❌') . "\n";
}
?>
        </pre>
    </div>

    <div class="section">
        <h2>📝 Summary</h2>
        <?php
        $allTestsPassed = function_exists('curl_version') && 
                         function_exists('curl_init') && 
                         function_exists('curl_exec') &&
                         !$error;
        
        if ($allTestsPassed) {
            echo '<p class="success">✅ <strong>All tests passed! cURL is fully supported on your server.</strong></p>';
            echo '<p>You can now use the SendGrid email integration.</p>';
            echo '<p><a href="test_curl.php">→ Test SendGrid Email Sending</a></p>';
        } else {
            echo '<p class="error">❌ <strong>Some tests failed. Please check the errors above.</strong></p>';
            echo '<p>Contact your hosting provider if cURL is not available.</p>';
        }
        ?>
    </div>

    <div class="section">
        <h2>🔗 Next Steps</h2>
        <ol>
            <li>If all tests pass, configure your SendGrid API key in <code>.env</code> file</li>
            <li>Set <code>MAIL_MAILER=sendgrid</code> in your <code>.env</code> file</li>
            <li>Test email sending using: <a href="test_curl.php">test_curl.php</a></li>
        </ol>
    </div>
</body>
</html>

