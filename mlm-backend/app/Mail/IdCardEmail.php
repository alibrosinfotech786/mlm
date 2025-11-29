<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class IdCardEmail extends Mailable
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
            ->subject('Your ID Card - Tathastu Ayurveda')
            ->view('emails.id-card-email-body')
            ->attachData(
                $this->pdfData,
                'IDCard_' . ($this->user->user_id ?? 'user') . '.pdf',
                ['mime' => 'application/pdf']
            );
    }
}
