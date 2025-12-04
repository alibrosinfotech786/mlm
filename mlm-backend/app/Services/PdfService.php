<?php

namespace App\Services;

use Dompdf\Dompdf;
use Dompdf\Options;
use Exception;

class PdfService
{
    /**
     * Generate PDF from HTML view
     *
     * @param string $viewName Blade view name
     * @param array $data Data to pass to the view
     * @param array $options Additional PDF options
     * @return string PDF binary data
     * @throws Exception
     */
    public function generateFromView(string $viewName, array $data = [], array $options = []): string
    {
        try {
            // Render the view to HTML
            $html = view($viewName, $data)->render();
            
            return $this->generateFromHtml($html, $options);
        } catch (Exception $e) {
            throw new Exception("Failed to generate PDF from view: " . $e->getMessage());
        }
    }

    /**
     * Generate PDF from HTML string
     *
     * @param string $html HTML content
     * @param array $options PDF options
     * @return string PDF binary data
     * @throws Exception
     */
    public function generateFromHtml(string $html, array $options = []): string
    {
        try {
            // Create Options object
            $dompdfOptions = new Options();
            
            // Set default options
            $dompdfOptions->set('isRemoteEnabled', $options['isRemoteEnabled'] ?? true);
            $dompdfOptions->set('isHtml5ParserEnabled', $options['isHtml5ParserEnabled'] ?? true);
            $dompdfOptions->set('isPhpEnabled', $options['isPhpEnabled'] ?? false);
            
            // Set font directory
            $fontDir = app_path('Libraries/dompdf/lib/fonts');
            if (is_dir($fontDir)) {
                $dompdfOptions->set('fontDir', $fontDir);
            }
            
            // Set temporary directory
            $tempDir = storage_path('app/temp');
            if (!is_dir($tempDir)) {
                @mkdir($tempDir, 0755, true);
            }
            $dompdfOptions->set('tempDir', $tempDir);
            
            // Set root directory
            $dompdfOptions->set('rootDir', app_path('Libraries/dompdf'));
            
            // Create Dompdf instance
            $dompdf = new Dompdf($dompdfOptions);
            
            // Load HTML
            $dompdf->loadHtml($html);
            
            // Set paper size and orientation
            $paperSize = $options['paper'] ?? 'A4';
            $orientation = $options['orientation'] ?? 'portrait';
            $dompdf->setPaper($paperSize, $orientation);
            
            // Render PDF
            $dompdf->render();
            
            // Return PDF output
            return $dompdf->output();
        } catch (Exception $e) {
            throw new Exception("Failed to generate PDF: " . $e->getMessage());
        }
    }

    /**
     * Download PDF
     *
     * @param string $pdfData PDF binary data
     * @param string $filename Filename for download
     * @return \Illuminate\Http\Response
     */
    public function download(string $pdfData, string $filename = 'document.pdf')
    {
        return response($pdfData, 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }

    /**
     * Stream PDF to browser
     *
     * @param string $pdfData PDF binary data
     * @param string $filename Filename
     * @return \Illuminate\Http\Response
     */
    public function stream(string $pdfData, string $filename = 'document.pdf')
    {
        return response($pdfData, 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="' . $filename . '"');
    }
}

