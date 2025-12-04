<?php

namespace App\Providers;

use App\Mail\Transports\SendGridTransport;
use Illuminate\Mail\MailManager;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Load Dompdf autoloader for manual installation
        $dompdfAutoloader = app_path('Libraries/dompdf/autoload.inc.php');
        if (file_exists($dompdfAutoloader)) {
            require_once $dompdfAutoloader;
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register SendGrid transport
        $this->app->resolving(MailManager::class, function (MailManager $manager) {
            $manager->extend('sendgrid', function (array $config) {
                $apiKey = $config['api_key'] ?? env('SENDGRID_API_KEY');
                
                if (empty($apiKey)) {
                    throw new \InvalidArgumentException('SendGrid API key is required.');
                }
                
                // Try to get event dispatcher and logger from Laravel's container
                // Symfony's AbstractTransport accepts null for both, so we can safely pass null
                $dispatcher = null;
                $logger = null;
                
                try {
                    if ($this->app->bound(\Psr\EventDispatcher\EventDispatcherInterface::class)) {
                        $dispatcher = $this->app->make(\Psr\EventDispatcher\EventDispatcherInterface::class);
                    }
                } catch (\Exception $e) {
                    // If EventDispatcher is not bound, pass null (AbstractTransport handles this)
                }
                
                try {
                    if ($this->app->bound(\Psr\Log\LoggerInterface::class)) {
                        $logger = $this->app->make(\Psr\Log\LoggerInterface::class);
                    }
                } catch (\Exception $e) {
                    // If Logger is not bound, pass null (AbstractTransport uses NullLogger)
                }
                
                return new SendGridTransport($apiKey, $dispatcher, $logger);
            });
        });
    }
}
