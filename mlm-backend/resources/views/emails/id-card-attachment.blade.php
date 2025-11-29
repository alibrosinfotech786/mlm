<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ID Card - Tathastu Ayurveda</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f0;font-family:Arial,sans-serif;">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f5f5f0;padding:20px 0;">
    <tr>
        <td align="center">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="360" style="max-width:360px;background-color:#ffffff;border-radius:16px;border:1px solid #e5e7eb;box-shadow:0 2px 4px rgba(0,0,0,0.08);overflow:hidden;">
                <!-- Header -->
                <tr>
                    <td align="center" style="background-color:#15803d;padding:20px 16px 16px 16px;">
                        <img src="https://www.tathastuayurveda.world/images/logo.png" alt="Tathastu Ayurveda Logo" width="96" height="96" style="display:block;border-radius:16px;margin-bottom:8px;">
                        <h1 style="margin:0;font-size:18px;font-weight:bold;color:#ffffff;letter-spacing:0.08em;text-transform:uppercase;">
                            Tathastu Ayurveda
                        </h1>
                        <p style="margin:4px 0 0 0;font-size:11px;color:rgba(255,255,255,0.9);letter-spacing:0.16em;text-transform:uppercase;">
                            Healing Roots, Cultivating Prosperity
                        </p>
                    </td>
                </tr>

                <!-- Profile (avatar centered under header) -->
                <tr>
                    <td align="center" style="padding:24px 16px 10px 16px;text-align:center;">
                        @php
                            $photo = $user->profile_picture
                                ? (config('app.url') . '/' . ltrim($user->profile_picture, '/'))
                                : null;
                        @endphp

                        <div style="margin:0 auto;width:112px;height:112px;border-radius:999px;border:4px solid #16a34a;overflow:hidden;background-color:#ffffff;">
                            @if ($photo)
                                <img src="{{ $photo }}" alt="{{ $user->name }} Profile" width="112" height="112" style="display:block;width:112px;height:112px;object-fit:cover;">
                            @else
                                <span style="display:block;width:112px;height:112px;line-height:112px;text-align:center;font-size:36px;font-weight:bold;color:#15803d;background-color:#dcfce7;">
                                    {{ strtoupper(substr($user->name ?? 'U', 0, 1)) }}
                                </span>
                            @endif
                        </div>

                        <p style="margin:16px 0 0 0;font-size:16px;font-weight:600;color:#111827;text-transform:capitalize;">
                            {{ $user->name ?? '-' }}
                        </p>
                        <p style="margin:4px 0 0 0;font-size:13px;font-weight:600;color:#15803d;">
                            Distributor
                        </p>
                    </td>
                </tr>

                <!-- Divider -->
                <tr>
                    <td style="padding:0 16px;">
                        <hr style="border:none;border-top:1px solid #e5e7eb;margin:4px 0;">
                    </td>
                </tr>

                <!-- Details -->
                <tr>
                    <td style="padding:8px 18px 16px 18px;font-size:13px;color:#111827;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                                <td style="padding:4px 0;border-bottom:1px solid #e5e7eb;">
                                    <span style="font-weight:500;color:#6b7280;">User ID:</span>
                                    <span style="float:right;font-weight:600;color:#111827;">{{ $user->user_id ?? '-' }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:4px 0;border-bottom:1px solid #e5e7eb;">
                                    <span style="font-weight:500;color:#6b7280;">Sponsor ID:</span>
                                    <span style="float:right;font-weight:600;color:#111827;">{{ $user->sponsor_id ?? 'N/A' }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:4px 0;border-bottom:1px solid #e5e7eb;">
                                    <span style="font-weight:500;color:#6b7280;">Sponsor Name:</span>
                                    <span style="float:right;font-weight:600;color:#111827;">{{ $user->sponsor_name ?? 'N/A' }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:4px 0;border-bottom:1px solid #e5e7eb;">
                                    <span style="font-weight:500;color:#6b7280;">Join Date:</span>
                                    <span style="float:right;font-weight:600;color:#111827;">
                                        @if($user->created_at)
                                            {{ \Carbon\Carbon::parse($user->created_at)->toFormattedDateString() }}
                                        @else
                                            -
                                        @endif
                                    </span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td align="center" style="background-color:#15803d;padding:10px 8px;">
                        <p style="margin:0;font-size:11px;color:#ffffff;letter-spacing:0.16em;text-transform:uppercase;">
                            www.tathastuayurveda.in
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>


