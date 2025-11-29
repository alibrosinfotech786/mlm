<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Your ID Card - Tathastu Ayurveda</title>
</head>
<body style="font-family: Arial, sans-serif; font-size: 14px; color: #111827;">
    <p>Dear {{ $user->name ?? 'Associate' }},</p>

    <p>
        Your digital ID card for <strong>Tathastu Ayurveda Pvt Ltd</strong> is attached to this email.
        You can open the attachment in any browser to view or print it.
    </p>

    <p>
        <strong>Summary:</strong><br>
        User ID: {{ $user->user_id ?? '-' }}<br>
        Sponsor ID: {{ $user->sponsor_id ?? 'N/A' }}<br>
        Sponsor Name: {{ $user->sponsor_name ?? 'N/A' }}
    </p>

    <p>
        With Best Regards,<br>
        <strong>Tathastu Ayurveda Pvt Ltd</strong>
    </p>
</body>
</html>


