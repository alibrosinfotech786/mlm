<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wallet Request Status Update</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f0;font-family:Arial,sans-serif;">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f5f5f0;padding:20px 0;">
    <tr>
        <td align="center">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;background-color:#ffffff;border-radius:8px;border:1px solid #e5e7eb;overflow:hidden;">
                <tr>
                    <td style="background-color:#16a34a;color:#ffffff;padding:16px 24px;font-size:18px;font-weight:bold;">
                        Wallet Request Status Updated
                    </td>
                </tr>

                <tr>
                    <td style="padding:20px 24px;font-size:14px;color:#111827;">
                        <p style="margin:0 0 12px 0;">Dear {{ $user->name ?? 'Customer' }},</p>
                        <p style="margin:0 0 12px 0;">
                            Your wallet deposit request status has been updated.
                        </p>
                        <p style="margin:0 0 12px 0;">
                            <strong>Previous Status:</strong> <span style="text-transform:capitalize;">{{ $oldStatus ?? 'Pending' }}</span><br>
                            <strong>Current Status:</strong> <span style="color:#16a34a;font-weight:600;text-transform:capitalize;">{{ $newStatus }}</span>
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
                                    <strong style="color:#6b7280;font-weight:600;">Request Date:</strong>
                                    <span style="color:#111827;margin-left:8px;">{{ $transaction->created_at ? \Carbon\Carbon::parse($transaction->created_at)->format('D M d Y, h:i A') : '-' }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;">
                                    <strong style="color:#6b7280;font-weight:600;">Status Updated:</strong>
                                    <span style="color:#16a34a;font-weight:600;margin-left:8px;text-transform:capitalize;">{{ $newStatus }}</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                @if($newStatus === 'approved')
                <tr>
                    <td style="padding:0 24px 20px 24px;font-size:13px;color:#059669;background-color:#d1fae5;border-left:4px solid #059669;">
                        <p style="margin:0;font-weight:600;">✓ Your wallet deposit has been approved!</p>
                        <p style="margin:8px 0 0 0;">The amount of ₹{{ number_format($transaction->deposit_amount, 2) }} has been credited to your wallet balance.</p>
                    </td>
                </tr>
                @elseif($newStatus === 'rejected')
                <tr>
                    <td style="padding:0 24px 20px 24px;font-size:13px;color:#dc2626;background-color:#fee2e2;border-left:4px solid #dc2626;">
                        <p style="margin:0;font-weight:600;">⚠️ Your wallet deposit request has been rejected.</p>
                        <p style="margin:8px 0 0 0;">If you have any questions or concerns, please contact our support team.</p>
                    </td>
                </tr>
                @elseif($newStatus === 'pending')
                <tr>
                    <td style="padding:0 24px 20px 24px;font-size:13px;color:#1e40af;background-color:#dbeafe;border-left:4px solid #1e40af;">
                        <p style="margin:0;font-weight:600;">⏳ Your wallet deposit request is pending review.</p>
                        <p style="margin:8px 0 0 0;">We are reviewing your request and will update you soon.</p>
                    </td>
                </tr>
                @endif

                <tr>
                    <td style="padding:0 24px 20px 24px;font-size:13px;color:#6b7280;">
                        <p style="margin:0;">
                            You can check your wallet balance and transaction history from your account dashboard.
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

