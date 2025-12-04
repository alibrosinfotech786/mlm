<?php
/**
 * Simple autoloader for Dompdf library
 * This replaces Composer's autoloader for manual installation
 */

// Define the base path
$dompdfPath = __DIR__;
$librariesPath = dirname($dompdfPath); // app/Libraries

// Register Dompdf namespace
spl_autoload_register(function ($class) use ($dompdfPath, $librariesPath) {
    // Handle Dompdf namespace
    if (strpos($class, 'Dompdf\\') === 0) {
        $class = substr($class, 7); // Remove 'Dompdf\' prefix
        $file = $dompdfPath . '/src/' . str_replace('\\', '/', $class) . '.php';
        
        if (file_exists($file)) {
            require_once $file;
            return true;
        }
    }
    
    // Handle Masterminds\HTML5 namespace (dependency)
    if (strpos($class, 'Masterminds\\') === 0) {
        $class = substr($class, 12); // Remove 'Masterminds\' prefix
        // Try multiple possible locations
        $possiblePaths = [
            $librariesPath . '/masterminds/html5/src/' . str_replace('\\', '/', $class) . '.php',
            $dompdfPath . '/vendor/masterminds/html5/src/' . str_replace('\\', '/', $class) . '.php',
        ];
        
        foreach ($possiblePaths as $file) {
            if (file_exists($file)) {
                require_once $file;
                return true;
            }
        }
    }
    
    // Handle FontLib namespace (dependency)
    if (strpos($class, 'FontLib\\') === 0) {
        $class = substr($class, 8); // Remove 'FontLib\' prefix
        $possiblePaths = [
            $dompdfPath . '/php-font-lib/src/FontLib/' . str_replace('\\', '/', $class) . '.php',
            $librariesPath . '/dompdf/php-font-lib/src/FontLib/' . str_replace('\\', '/', $class) . '.php',
        ];
        
        foreach ($possiblePaths as $file) {
            if (file_exists($file)) {
                require_once $file;
                return true;
            }
        }
    }
    
    // Handle SvgLib namespace (dependency)
    if (strpos($class, 'Svg\\') === 0) {
        $class = substr($class, 4); // Remove 'Svg\' prefix
        $possiblePaths = [
            $dompdfPath . '/php-svg-lib/src/Svg/' . str_replace('\\', '/', $class) . '.php',
            $librariesPath . '/dompdf/php-svg-lib/src/Svg/' . str_replace('\\', '/', $class) . '.php',
        ];
        
        foreach ($possiblePaths as $file) {
            if (file_exists($file)) {
                require_once $file;
                return true;
            }
        }
    }
    
    // Handle lib classes (like Cpdf)
    if ($class === 'Cpdf') {
        $file = $dompdfPath . '/lib/Cpdf.php';
        if (file_exists($file)) {
            require_once $file;
            return true;
        }
    }
    
    return false;
});

// Load Helpers class manually as it's needed early
require_once $dompdfPath . '/src/Helpers.php';

