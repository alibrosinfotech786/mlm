<?php

namespace App\Mail;

use App\Models\KycDetail;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class KycSubmissionEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $kyc;
    public $user;
    public $isUpdate;

    /**
     * Create a new message instance.
     */
    public function __construct(KycDetail $kyc, User $user, bool $isUpdate = false)
    {
        $this->kyc = $kyc;
        $this->user = $user;
        $this->isUpdate = $isUpdate;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = $this->isUpdate 
            ? 'KYC Details Updated - Tathastu Ayurveda'
            : 'KYC Details Submitted - Tathastu Ayurveda';
            
        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.kyc-submission',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
