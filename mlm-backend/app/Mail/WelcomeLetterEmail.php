<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class WelcomeLetterEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $pdfData;

    public function __construct(User $user, string $pdfData)
    {
        $this->user = $user;
        $this->pdfData = $pdfData;
    }

    public function build()
    {
        return $this
            ->subject('Welcome Letter - Tathastu Ayurveda Pvt Ltd')
            ->view('emails.welcome-letter')
            ->attachData(
                $this->pdfData,
                'Welcome_Letter_' . ($this->user->user_id ?? 'user') . '.pdf',
                ['mime' => 'application/pdf']
            );
    }
}
