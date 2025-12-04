<?php

namespace App\Mail\Transports;

use Symfony\Component\Mailer\Transport\AbstractTransportFactory;
use Symfony\Component\Mailer\Transport\Dsn;
use Symfony\Component\Mailer\Transport\TransportInterface;

class SendGridTransportFactory extends AbstractTransportFactory
{
    public function create(Dsn $dsn): TransportInterface
    {
        $apiKey = $dsn->getOption('api_key') ?? $dsn->getUser();
        $fromEmail = $dsn->getOption('from_address') ?? config('mail.from.address');
        $fromName = $dsn->getOption('from_name') ?? config('mail.from.name');

        return new SendGridTransport($apiKey, $fromEmail, $fromName);
    }

    protected function getSupportedSchemes(): array
    {
        return ['sendgrid'];
    }
}

