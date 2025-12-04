<?php

namespace App\Mail\Transports;

use Symfony\Component\Mailer\SentMessage;
use Symfony\Component\Mailer\Transport\AbstractTransport;
use Symfony\Component\Mime\MessageConverter;
use Symfony\Component\Mime\Email;

class SendGridTransport extends AbstractTransport
{
    protected $apiKey;
    protected $fromEmail;
    protected $fromName;

    public function __construct(string $apiKey, string $fromEmail, string $fromName = '')
    {
        $this->apiKey = $apiKey;
        $this->fromEmail = $fromEmail;
        $this->fromName = $fromName;
        parent::__construct();
    }

    protected function doSend(SentMessage $message): void
    {
        $email = MessageConverter::toEmail($message->getOriginalMessage());
        
        $payload = $this->buildPayload($email);
        
        $ch = curl_init('https://api.sendgrid.com/v3/mail/send');
        
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $this->apiKey,
                'Content-Type: application/json',
            ],
            CURLOPT_POSTFIELDS => json_encode($payload),
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);
        
        if ($httpCode >= 400) {
            $errorMessage = $error ?: 'SendGrid API error';
            if ($response) {
                $errorData = json_decode($response, true);
                if (isset($errorData['errors'][0]['message'])) {
                    $errorMessage = $errorData['errors'][0]['message'];
                }
            }
            throw new \RuntimeException('SendGrid API Error: ' . $errorMessage . ' (HTTP ' . $httpCode . ')');
        }
    }

    protected function buildPayload(Email $email): array
    {
        $payload = [
            'personalizations' => [
                [
                    'to' => $this->formatAddresses($email->getTo()),
                ],
            ],
            'from' => [
                'email' => $this->fromEmail,
                'name' => $this->fromName,
            ],
            'subject' => $email->getSubject() ?? '',
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
            $replyTo = $email->getReplyTo()[0];
            $payload['reply_to'] = [
                'email' => $replyTo->getAddress(),
                'name' => $replyTo->getName(),
            ];
        }

        // Add email content
        $htmlBody = $email->getHtmlBody();
        $textBody = $email->getTextBody();

        $payload['content'] = [];
        
        if ($htmlBody) {
            $payload['content'][] = [
                'type' => 'text/html',
                'value' => $htmlBody,
            ];
        }
        
        if ($textBody) {
            $payload['content'][] = [
                'type' => 'text/plain',
                'value' => $textBody,
            ];
        }

        // Add attachments
        $attachments = $email->getAttachments();
        if (count($attachments) > 0) {
            $payload['attachments'] = [];
            foreach ($attachments as $attachment) {
                $payload['attachments'][] = [
                    'content' => base64_encode($attachment->getBody()),
                    'filename' => $attachment->getFilename(),
                    'type' => $attachment->getContentType(),
                    'disposition' => 'attachment',
                ];
            }
        }

        return $payload;
    }

    protected function formatAddresses(array $addresses): array
    {
        $formatted = [];
        foreach ($addresses as $address) {
            $formatted[] = [
                'email' => $address->getAddress(),
                'name' => $address->getName(),
            ];
        }
        return $formatted;
    }

    public function __toString(): string
    {
        return 'sendgrid';
    }
}

