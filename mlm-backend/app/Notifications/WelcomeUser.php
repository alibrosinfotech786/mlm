<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeUser extends Notification
{
    use Queueable;

    protected $user;
    protected $password;

    public function __construct($user, $password = null)
    {
        $this->user = $user;
        $this->password = $password;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->subject('Welcome to Tathastu Ayurveda - Account Created Successfully')
                    ->greeting('Hello ' . $this->user->name . '!')
                    ->line('Your account has been created successfully on our Tathastu Ayurveda.')
                    ->line('**Account Details:**')
                    ->line('User ID: ' . $this->user->user_id)
                    ->line('Email: ' . $this->user->email)
                    ->line('Phone: ' . $this->user->phone)
                    ->line('Position: ' . ($this->user->position ?? 'Root'))
                    ->line('Sponsor: ' . ($this->user->sponsor_name ?? 'N/A'))
                    ->line('You can now login to your account and start exploring the platform.')
                    // ->action('Login to Your Account', config('app.url') . '/api/login')
                    ->line('Thank you for joining our Tathastu Ayurveda!')
                    ->salutation('Best regards, Tathastu Ayurveda Team');
    }
}