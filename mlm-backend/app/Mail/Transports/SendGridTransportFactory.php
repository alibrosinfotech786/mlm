<?php

namespace App\Mail\Transports;

use Illuminate\Support\Arr;
use Symfony\Component\Mailer\Transport\AbstractTransportFactory;
use Symfony\Component\Mailer\Transport\Dsn;
use Symfony\Component\Mailer\Transport\TransportInterface;

class SendGridTransportFactory extends AbstractTransportFactory
{
    /**
     * {@inheritDoc}
     */
    protected function getSupportedSchemes(): array
    {
        return ['sendgrid'];
    }

    /**
     * {@inheritDoc}
     */
    public function create(Dsn $dsn): TransportInterface
    {
        $apiKey = $this->getPassword($dsn);

        return new SendGridTransport($apiKey);
    }
}

