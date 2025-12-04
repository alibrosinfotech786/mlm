<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wallet Request Confirmation</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f0;font-family:Arial,sans-serif;">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f5f5f0;padding:20px 0;">
    <tr>
        <td align="center">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;background-color:#ffffff;border-radius:8px;border:1px solid #e5e7eb;overflow:hidden;">
                <tr>
                    <td style="background-color:#16a34a;color:#ffffff;padding:16px 24px;font-size:18px;font-weight:bold;">
                        Wallet Request Submitted
                    </td>
                </tr>

                <tr>
                    <td style="padding:20px 24px;font-size:14px;color:#111827;">
                        <p style="margin:0 0 12px 0;">Dear {{ $user->name ?? 'Customer' }},</p>
                        <p style="margin:0 0 12px 0;">
                            Thank you for your wallet deposit request. Your request has been submitted successfully and is currently under review.
                        </p>
                        <p style="margin:0 0 12px 0;">
                            Here are the details of your wallet request:
                        </p>
                    </td>
                </tr>

                <tr>
                    <td style="padding:0 24px 16px 24px;font-size:13px;color:#111827;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
                            <tr>
                                <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                                    <strong style="color:#6b7280;font-weight:600;">Transaction ID:</strong>
                                    <span style="color:#111827;margin-left:8px;">{{ $transaction->auto_transaction_id }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                                    <strong style="color:#6b7280;font-weight:600;">User ID:</strong>
                                    <span style="color:#111827;margin-left:8px;">{{ $user->user_id ?? '-' }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                                    <strong style="color:#6b7280;font-weight:600;">Deposit Amount:</strong>
                                    <span style="color:#111827;margin-left:8px;">₹{{ number_format($transaction->deposit_amount, 2) }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                                    <strong style="color:#6b7280;font-weight:600;">Deposit By:</strong>
                                    <span style="color:#111827;margin-left:8px;">{{ $transaction->deposit_by }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                                    <strong style="color:#6b7280;font-weight:600;">Deposit To:</strong>
                                    <span style="color:#111827;margin-left:8px;">{{ $transaction->deposit_to }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                                    <strong style="color:#6b7280;font-weight:600;">Reference Transaction ID:</strong>
                                    <span style="color:#111827;margin-left:8px;">{{ $transaction->ref_transaction_id }}</span>
                                </td>
                            </tr>
                            @if($transaction->remark)
                            <tr>
                                <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                                    <strong style="color:#6b7280;font-weight:600;">Remark:</strong>
                                    <span style="color:#111827;margin-left:8px;">{{ $transaction->remark }}</span>
                                </td>
                            </tr>
                            @endif
                            <tr>
                                <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                                    <strong style="color:#6b7280;font-weight:600;">Status:</strong>
                                    <span style="color:#16a34a;font-weight:600;margin-left:8px;text-transform:capitalize;">{{ $transaction->status ?? 'Pending' }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;">
                                    <strong style="color:#6b7280;font-weight:600;">Request Date:</strong>
                                    <span style="color:#111827;margin-left:8px;">{{ $transaction->created_at ? \Carbon\Carbon::parse($transaction->created_at)->format('D M d Y, h:i A') : '-' }}</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td style="padding:0 24px 20px 24px;font-size:13px;color:#6b7280;">
                        <p style="margin:0 0 8px 0;">
                            Your request will be reviewed by our team. You will be notified once the status is updated.
                        </p>
                        <p style="margin:0;">
                            If you have any questions, please contact our support team.
                        </p>
                    </td>
                </tr>

                <tr>
                    <td style="background-color:#f3f4f6;color:#6b7280;font-size:11px;padding:10px 24px;text-align:center;">
                        &copy; {{ date('Y') }} Tathastu Ayurveda Pvt Ltd. All rights reserved.
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>

