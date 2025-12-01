<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KYC {{ $isUpdate ? 'Update' : 'Submission' }} Confirmation</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f0;font-family:Arial,sans-serif;">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f5f5f0;padding:20px 0;">
    <tr>
        <td align="center">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;background-color:#ffffff;border-radius:8px;border:1px solid #e5e7eb;overflow:hidden;">
                <tr>
                    <td style="background-color:#16a34a;color:#ffffff;padding:16px 24px;font-size:18px;font-weight:bold;">
                        KYC {{ $isUpdate ? 'Details Updated' : 'Submission Confirmed' }}
                    </td>
                </tr>

                <tr>
                    <td style="padding:20px 24px;font-size:14px;color:#111827;">
                        <p style="margin:0 0 12px 0;">Dear {{ $user->name ?? 'Customer' }},</p>
                        <p style="margin:0 0 12px 0;">
                            @if($isUpdate)
                                Your KYC (Know Your Customer) details have been updated successfully.
                            @else
                                Thank you for submitting your KYC (Know Your Customer) details. Your submission has been received and is currently under review.
                            @endif
                        </p>
                        <p style="margin:0 0 12px 0;">
                            Here is a summary of your KYC information:
                        </p>
                    </td>
                </tr>

                <tr>
                    <td style="padding:0 24px 16px 24px;font-size:13px;color:#111827;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
                            <tr>
                                <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                                    <strong style="color:#6b7280;font-weight:600;">User ID:</strong>
                                    <span style="color:#111827;margin-left:8px;">{{ $user->user_id ?? '-' }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                                    <strong style="color:#6b7280;font-weight:600;">Full Name:</strong>
                                    <span style="color:#111827;margin-left:8px;">{{ $kyc->full_name ?? '-' }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                                    <strong style="color:#6b7280;font-weight:600;">Date of Birth:</strong>
                                    <span style="color:#111827;margin-left:8px;">{{ $kyc->dob ? \Carbon\Carbon::parse($kyc->dob)->format('D M d Y') : '-' }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                                    <strong style="color:#6b7280;font-weight:600;">PAN Number:</strong>
                                    <span style="color:#111827;margin-left:8px;">{{ $kyc->pan_number ?? '-' }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                                    <strong style="color:#6b7280;font-weight:600;">Aadhar Number:</strong>
                                    <span style="color:#111827;margin-left:8px;">{{ $kyc->aadhar_number ?? '-' }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                                    <strong style="color:#6b7280;font-weight:600;">Bank Name:</strong>
                                    <span style="color:#111827;margin-left:8px;">{{ $kyc->bank_name ?? '-' }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                                    <strong style="color:#6b7280;font-weight:600;">Account Holder Name:</strong>
                                    <span style="color:#111827;margin-left:8px;">{{ $kyc->account_holder_name ?? '-' }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                                    <strong style="color:#6b7280;font-weight:600;">Account Number:</strong>
                                    <span style="color:#111827;margin-left:8px;">{{ $kyc->account_number ? '****' . substr($kyc->account_number, -4) : '-' }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                                    <strong style="color:#6b7280;font-weight:600;">IFSC Code:</strong>
                                    <span style="color:#111827;margin-left:8px;">{{ $kyc->ifsc_code ?? '-' }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                                    <strong style="color:#6b7280;font-weight:600;">Branch Name:</strong>
                                    <span style="color:#111827;margin-left:8px;">{{ $kyc->branch_name ?? '-' }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                                    <strong style="color:#6b7280;font-weight:600;">Status:</strong>
                                    <span style="color:#16a34a;font-weight:600;margin-left:8px;text-transform:capitalize;">{{ $kyc->status ?? 'Pending' }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;">
                                    <strong style="color:#6b7280;font-weight:600;">{{ $isUpdate ? 'Updated' : 'Submitted' }} Date:</strong>
                                    <span style="color:#111827;margin-left:8px;">{{ $kyc->updated_at ? \Carbon\Carbon::parse($kyc->updated_at)->format('D M d Y, h:i A') : ($kyc->created_at ? \Carbon\Carbon::parse($kyc->created_at)->format('D M d Y, h:i A') : '-') }}</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                @if(!$isUpdate)
                <tr>
                    <td style="padding:0 24px 20px 24px;font-size:13px;color:#059669;background-color:#d1fae5;border-left:4px solid #059669;">
                        <p style="margin:0;font-weight:600;">✓ Your KYC submission has been received!</p>
                        <p style="margin:8px 0 0 0;">Our team will review your documents and update the status soon. You will be notified once the review is complete.</p>
                    </td>
                </tr>
                @else
                <tr>
                    <td style="padding:0 24px 20px 24px;font-size:13px;color:#1e40af;background-color:#dbeafe;border-left:4px solid #1e40af;">
                        <p style="margin:0;font-weight:600;">✓ Your KYC details have been updated!</p>
                        <p style="margin:8px 0 0 0;">The changes have been saved and will be reviewed by our team if needed.</p>
                    </td>
                </tr>
                @endif

                <tr>
                    <td style="padding:0 24px 20px 24px;font-size:13px;color:#6b7280;">
                        <p style="margin:0;">
                            You can check your KYC status anytime from your account dashboard.
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

