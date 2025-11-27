<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Notifications\WelcomeUser;

class TestWelcomeEmail extends Command
{
    protected $signature = 'test:welcome-email {user_id}';
    protected $description = 'Test welcome email for a specific user';

    public function handle()
    {
        $userId = $this->argument('user_id');
        $user = User::where('user_id', $userId)->first();
        
        if (!$user) {
            $this->error("User with ID {$userId} not found");
            return;
        }
        
        try {
            $user->notify(new WelcomeUser($user));
            $this->info("Welcome email sent to {$user->name} ({$user->email})");
            $this->info("Check the Laravel log file for email content (MAIL_MAILER=log)");
        } catch (\Exception $e) {
            $this->error("Failed to send email: " . $e->getMessage());
        }
    }
}