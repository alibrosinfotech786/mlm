<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Mail\MailManager;
use App\Mail\Transports\SendGridTransport;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register SendGrid transport
        $this->app->resolving(MailManager::class, function (MailManager $manager) {
            $manager->extend('sendgrid', function (array $config) {
                return new SendGridTransport(
                    $config['api_key'] ?? env('SENDGRID_API_KEY'),
                    $config['from']['address'] ?? config('mail.from.address'),
                    $config['from']['name'] ?? config('mail.from.name')
                );
            });
        });
    }
}
