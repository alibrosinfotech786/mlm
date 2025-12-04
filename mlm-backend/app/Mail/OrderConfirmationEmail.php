<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderConfirmationEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $order;

    public function __construct(Order $order)
    {
        $this->order = $order->load(['orderItems']);
    }

    public function build()
    {
        return $this
            ->subject('Your Order ' . ($this->order->order_number ?? '') . ' - Tathastu Ayurveda')
            ->view('emails.order-confirmation');
    }
}


