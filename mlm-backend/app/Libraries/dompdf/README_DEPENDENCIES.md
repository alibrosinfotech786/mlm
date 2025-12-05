# Dompdf Manual Installation - Required Dependencies

This dompdf library requires the following dependencies to be downloaded and placed in your project:

## Required Dependencies

### 1. masterminds/html5
- **Purpose**: HTML5 parser
- **GitHub**: https://github.com/Masterminds/HTML5
- **Download**: Download ZIP from GitHub releases page
- **Location**: Place in `app/Libraries/masterminds/html5/` or update autoloader path

### 2. dompdf/php-font-lib
- **Purpose**: Font handling library
- **GitHub**: https://github.com/dompdf/php-font-lib
- **Download**: Download ZIP from GitHub releases page
- **Location**: Place in `app/Libraries/dompdf/php-font-lib/` or update autoloader path

### 3. dompdf/php-svg-lib
- **Purpose**: SVG support library
- **GitHub**: https://github.com/dompdf/php-svg-lib
- **Download**: Download ZIP from GitHub releases page
- **Location**: Place in `app/Libraries/dompdf/php-svg-lib/` or update autoloader path

## Installation Steps

1. Download each dependency from their respective GitHub repositories
2. Extract each ZIP file
3. Place them in the appropriate location in your project
4. Update the autoloader in `app/Libraries/dompdf/autoload.inc.php` to include these dependencies
5. Or add them to Laravel's composer.json autoload section

## Alternative: Use Packaged Release

Instead of downloading source code, you can download a packaged release of dompdf that includes all dependencies:
- Visit: https://github.com/dompdf/dompdf/releases
- Download a packaged release (e.g., `dompdf_2.0.0.zip`)
- These releases include all dependencies bundled

## Testing

After installing dependencies, test PDF generation to ensure everything works correctly.

