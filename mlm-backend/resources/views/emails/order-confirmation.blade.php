<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Order Confirmation</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f0;font-family:Arial,sans-serif;">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f5f5f0;padding:20px 0;">
    <tr>
        <td align="center">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;background-color:#ffffff;border-radius:8px;border:1px solid #e5e7eb;overflow:hidden;">
                <tr>
                    <td style="background-color:#16a34a;color:#ffffff;padding:16px 24px;font-size:18px;font-weight:bold;">
                        Your Order is placed
                    </td>
                </tr>

                <tr>
                    <td style="padding:20px 24px;font-size:14px;color:#111827;">
                        <p style="margin:0 0 12px 0;">Dear {{ $order->billing_full_name ?? 'Customer' }},</p>
                        <p style="margin:0 0 12px 0;">
                            Thank you for shopping with <strong>Tathastu Ayurveda</strong>. Your order
                            <strong>{{ $order->order_number }}</strong> has been placed successfully.
                        </p>
                        <p style="margin:0 0 12px 0;">
                            Here is a summary of your order:
                        </p>
                    </td>
                </tr>

                <tr>
                    <td style="padding:0 24px 16px 24px;font-size:13px;color:#111827;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
                            <thead>
                            <tr style="background-color:#f3f4f6;">
                                <th align="left" style="padding:8px 6px;font-weight:600;">Product</th>
                                <th align="center" style="padding:8px 6px;font-weight:600;">Qty</th>
                                <th align="right" style="padding:8px 6px;font-weight:600;">MRP</th>
                                <th align="right" style="padding:8px 6px;font-weight:600;">Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            @foreach ($order->orderItems as $item)
                                <tr>
                                    <td style="padding:6px 6px;border-bottom:1px solid #e5e7eb;">
                                        {{ $item->product_name }}
                                    </td>
                                    <td align="center" style="padding:6px 6px;border-bottom:1px solid #e5e7eb;">
                                        {{ $item->quantity }}
                                    </td>
                                    <td align="right" style="padding:6px 6px;border-bottom:1px solid #e5e7eb;">
                                        ₹{{ number_format($item->mrp, 2) }}
                                    </td>
                                    <td align="right" style="padding:6px 6px;border-bottom:1px solid #e5e7eb;">
                                        ₹{{ number_format($item->total, 2) }}
                                    </td>
                                </tr>
                            @endforeach
                            </tbody>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td style="padding:0 24px 20px 24px;font-size:14px;color:#111827;">
                        <p style="margin:12px 0 4px 0;"><strong>Total BV:</strong> {{ $order->total_bv }}</p>
                        <p style="margin:0 0 12px 0;"><strong>Total Amount:</strong> ₹{{ number_format($order->total_mrp, 2) }}</p>
                        <p style="margin:0 0 4px 0;font-size:12px;color:#6b7280;">
                            Payment Mode: {{ strtoupper($order->payment_mode) }}
                        </p>
                    </td>
                </tr>

                <tr>
                    <td style="padding:0 24px 20px 24px;font-size:12px;color:#6b7280;">
                        <p style="margin:0 0 4px 0;">Billing Email: {{ $order->billing_email }}</p>
                        <p style="margin:0 0 4px 0;">Contact: {{ $order->billing_contact }}</p>
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


