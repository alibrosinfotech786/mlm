<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;

class TestRegistration extends Command
{
    protected $signature = 'test:registration';
    protected $description = 'Test user registration with email notification';

    public function handle()
    {
        $this->info('Testing user registration with email...');
        
        $testData = [
            'name' => 'Test User Email',
            'email' => 'test.email@example.com',
            'phone' => '1234567890',
            'address' => 'Test Address',
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ];
        
        $request = new Request($testData);
        $controller = new AuthController();
        
        try {
            $response = $controller->register($request);
            $data = $response->getData(true);
            
            if ($data['success']) {
                $this->info('Registration successful!');
                $this->info('User ID: ' . $data['user']['user_id']);
                $this->info('Email: ' . $data['user']['email']);
                $this->info('Welcome email should be sent to: ' . $data['user']['email']);
                $this->info('Check Laravel log for email content (MAIL_MAILER=log)');
            } else {
                $this->error('Registration failed: ' . $data['message']);
            }
        } catch (\Exception $e) {
            $this->error('Error: ' . $e->getMessage());
        }
    }
}