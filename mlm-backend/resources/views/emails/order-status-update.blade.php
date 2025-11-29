<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Status Update</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f0;font-family:Arial,sans-serif;">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f5f5f0;padding:20px 0;">
    <tr>
        <td align="center">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;background-color:#ffffff;border-radius:8px;border:1px solid #e5e7eb;overflow:hidden;">
                <tr>
                    <td style="background-color:#16a34a;color:#ffffff;padding:16px 24px;font-size:18px;font-weight:bold;">
                        Order Status Updated
                    </td>
                </tr>

                <tr>
                    <td style="padding:20px 24px;font-size:14px;color:#111827;">
                        <p style="margin:0 0 12px 0;">Dear {{ $order->billing_full_name ?? 'Customer' }},</p>
                        <p style="margin:0 0 12px 0;">
                            Your order <strong>{{ $order->order_number }}</strong> status has been updated.
                        </p>
                        <p style="margin:0 0 12px 0;">
                            <strong>Previous Status:</strong> <span style="text-transform:capitalize;">{{ $oldStatus }}</span><br>
                            <strong>Current Status:</strong> <span style="color:#16a34a;font-weight:600;text-transform:capitalize;">{{ $newStatus }}</span>
                        </p>
                    </td>
                </tr>

                <tr>
                    <td style="padding:0 24px 16px 24px;font-size:13px;color:#111827;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
                            <tr>
                                <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                                    <strong style="color:#6b7280;font-weight:600;">Order Number:</strong>
                                    <span style="color:#111827;margin-left:8px;">{{ $order->order_number }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                                    <strong style="color:#6b7280;font-weight:600;">Order Date:</strong>
                                    <span style="color:#111827;margin-left:8px;">{{ $order->created_at ? \Carbon\Carbon::parse($order->created_at)->format('D M d Y, h:i A') : '-' }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                                    <strong style="color:#6b7280;font-weight:600;">Total Amount:</strong>
                                    <span style="color:#111827;margin-left:8px;">₹{{ number_format($order->total_mrp, 2) }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                                    <strong style="color:#6b7280;font-weight:600;">Total BV:</strong>
                                    <span style="color:#111827;margin-left:8px;">{{ $order->total_bv }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                                    <strong style="color:#6b7280;font-weight:600;">Payment Mode:</strong>
                                    <span style="color:#111827;margin-left:8px;text-transform:uppercase;">{{ $order->payment_mode }}</span>
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

                @if($newStatus === 'delivered')
                <tr>
                    <td style="padding:0 24px 20px 24px;font-size:13px;color:#16a34a;background-color:#dcfce7;border-left:4px solid #16a34a;">
                        <p style="margin:0;font-weight:600;">🎉 Your order has been delivered!</p>
                        <p style="margin:8px 0 0 0;">Thank you for shopping with Tathastu Ayurveda. We hope you enjoy your products!</p>
                    </td>
                </tr>
                @elseif($newStatus === 'shipped')
                <tr>
                    <td style="padding:0 24px 20px 24px;font-size:13px;color:#1e40af;background-color:#dbeafe;border-left:4px solid #1e40af;">
                        <p style="margin:0;font-weight:600;">📦 Your order has been shipped!</p>
                        <p style="margin:8px 0 0 0;">Your order is on its way. You will receive it soon!</p>
                    </td>
                </tr>
                @elseif($newStatus === 'confirmed')
                <tr>
                    <td style="padding:0 24px 20px 24px;font-size:13px;color:#059669;background-color:#d1fae5;border-left:4px solid #059669;">
                        <p style="margin:0;font-weight:600;">✓ Your order has been confirmed!</p>
                        <p style="margin:8px 0 0 0;">We are processing your order and will update you soon.</p>
                    </td>
                </tr>
                @elseif($newStatus === 'cancelled')
                <tr>
                    <td style="padding:0 24px 20px 24px;font-size:13px;color:#dc2626;background-color:#fee2e2;border-left:4px solid #dc2626;">
                        <p style="margin:0;font-weight:600;">⚠️ Your order has been cancelled.</p>
                        <p style="margin:8px 0 0 0;">If you have any questions, please contact our support team.</p>
                    </td>
                </tr>
                @endif

                <tr>
                    <td style="padding:0 24px 20px 24px;font-size:13px;color:#6b7280;">
                        <p style="margin:0;">
                            You can track your order status anytime from your account dashboard.
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

