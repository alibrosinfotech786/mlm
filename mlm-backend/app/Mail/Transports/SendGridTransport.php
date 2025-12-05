<?php

namespace App\Mail\Transports;

use Psr\EventDispatcher\EventDispatcherInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\Mailer\SentMessage;
use Symfony\Component\Mailer\Transport\AbstractTransport;
use Symfony\Component\Mime\MessageConverter;
use Symfony\Component\Mime\Email;

class SendGridTransport extends AbstractTransport
{
    /**
     * The SendGrid API key.
     *
     * @var string
     */
    protected $apiKey;

    /**
     * The SendGrid API endpoint.
     *
     * @var string
     */
    protected $endpoint = 'https://api.sendgrid.com/v3/mail/send';

    /**
     * Create a new SendGrid transport instance.
     *
     * @param  string  $apiKey
     * @param  EventDispatcherInterface|null  $dispatcher
     * @param  LoggerInterface|null  $logger
     * @return void
     */
    public function __construct(string $apiKey, ?EventDispatcherInterface $dispatcher = null, ?LoggerInterface $logger = null)
    {
        parent::__construct($dispatcher, $logger);
        $this->apiKey = $apiKey;
    }

    /**
     * {@inheritDoc}
     */
    protected function doSend(SentMessage $message): void
    {
        $email = MessageConverter::toEmail($message->getOriginalMessage());
        
        $payload = $this->buildPayload($email);
        
        $this->sendViaCurl($payload);
    }

    /**
     * Build the payload for SendGrid API.
     *
     * @param  Email  $email
     * @return array
     */
    protected function buildPayload(Email $email): array
    {
        $payload = [
            'personalizations' => [
                [
                    'to' => $this->formatAddresses($email->getTo()),
                ],
            ],
            'from' => $this->formatAddress($email->getFrom()[0]),
            'subject' => $email->getSubject(),
        ];

        // Add CC recipients
        if (count($email->getCc()) > 0) {
            $payload['personalizations'][0]['cc'] = $this->formatAddresses($email->getCc());
        }

        // Add BCC recipients
        if (count($email->getBcc()) > 0) {
            $payload['personalizations'][0]['bcc'] = $this->formatAddresses($email->getBcc());
        }

        // Add Reply-To
        if (count($email->getReplyTo()) > 0) {
            $payload['reply_to'] = $this->formatAddress($email->getReplyTo()[0]);
        }

        // Add email content
        $htmlBody = $email->getHtmlBody();
        $textBody = $email->getTextBody();

        $content = [];
        if ($htmlBody) {
            $content[] = [
                'type' => 'text/html',
                'value' => $htmlBody,
            ];
        }
        if ($textBody) {
            $content[] = [
                'type' => 'text/plain',
                'value' => $textBody,
            ];
        }

        if (!empty($content)) {
            $payload['content'] = $content;
        }

        // Add attachments
        $attachments = $this->formatAttachments($email);
        if (!empty($attachments)) {
            $payload['attachments'] = $attachments;
        }

        return $payload;
    }

    /**
     * Format email addresses for SendGrid.
     *
     * @param  array  $addresses
     * @return array
     */
    protected function formatAddresses(array $addresses): array
    {
        return array_map(function ($address) {
            return $this->formatAddress($address);
        }, $addresses);
    }

    /**
     * Format a single email address for SendGrid.
     *
     * @param  \Symfony\Component\Mime\Address  $address
     * @return array
     */
    protected function formatAddress($address): array
    {
        $formatted = [
            'email' => $address->getAddress(),
        ];

        if ($address->getName()) {
            $formatted['name'] = $address->getName();
        }

        return $formatted;
    }

    /**
     * Format attachments for SendGrid.
     *
     * @param  Email  $email
     * @return array
     */
    protected function formatAttachments(Email $email): array
    {
        $attachments = [];

        foreach ($email->getAttachments() as $attachment) {
            $headers = $attachment->getPreparedHeaders();
            $disposition = $headers->getHeaderBody('Content-Disposition');

            if (preg_match('/filename="(.+)"/', $disposition, $matches)) {
                $filename = $matches[1];
            } else {
                $filename = 'attachment';
            }

            $attachments[] = [
                'content' => base64_encode($attachment->getBody()),
                'filename' => $filename,
                'type' => $headers->getHeaderBody('Content-Type'),
                'disposition' => 'attachment',
            ];
        }

        return $attachments;
    }

    /**
     * Send email via cURL to SendGrid API.
     *
     * @param  array  $payload
     * @return void
     * @throws \RuntimeException
     */
    protected function sendViaCurl(array $payload): void
    {
        $ch = curl_init();

        curl_setopt_array($ch, [
            CURLOPT_URL => $this->endpoint,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($payload),
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $this->apiKey,
                'Content-Type: application/json',
            ],
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);

        curl_close($ch);

        if ($error) {
            throw new \RuntimeException('SendGrid cURL Error: ' . $error);
        }

        if ($httpCode >= 400) {
            $errorMessage = 'SendGrid API Error';
            if ($response) {
                $errorData = json_decode($response, true);
                if (isset($errorData['errors'])) {
                    $errorMessage .= ': ' . json_encode($errorData['errors']);
                } else {
                    $errorMessage .= ': ' . $response;
                }
            }
            throw new \RuntimeException($errorMessage . ' (HTTP ' . $httpCode . ')');
        }
    }

    /**
     * Get the string representation of the transport.
     *
     * @return string
     */
    public function __toString(): string
    {
        return 'sendgrid';
    }
}

