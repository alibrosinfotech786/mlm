<?php

namespace App\Mail;

use App\Models\WalletTransaction;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WalletRequestEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $transaction;
    public $user;

    /**
     * Create a new message instance.
     */
    public function __construct(WalletTransaction $transaction, User $user)
    {
        $this->transaction = $transaction;
        $this->user = $user;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Wallet Request Submitted - Tathastu Ayurveda',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.wallet-request',
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
