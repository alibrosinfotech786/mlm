<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>ID Card - Tathastu Ayurveda</title>
    <style>
        @page {
            margin: 0;
            size: A4 portrait;
        }
        body {
            margin: 0;
            padding: 20px;
            background-color: #e5e7eb;
            font-family: Arial, sans-serif;
        }
    </style>
</head>
<body>
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #e5e7eb;">
        <tr>
            <td align="center" style="padding: 0 0 30px 0;">
                <!-- FRONT CARD -->
                <table cellpadding="0" cellspacing="0" border="0" width="500" style="background-color: #1a1a1a;">
                    <tr>
                        <td>
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <!-- LEFT SIDE -->
                                    <td width="55%" style="padding: 32px 24px; color: white; vertical-align: top;">
                                        <div style="font-size: 28px; font-weight: bold; margin-bottom: 4px; line-height: 1.2;">
                                            @php
                                                $nameParts = explode(' ', $user->name ?? 'User');
                                                $firstName = $nameParts[0] ?? 'User';
                                                $restName = implode(' ', array_slice($nameParts, 1));
                                            @endphp
                                            <span style="color: #FF9800;">{{ $firstName }}</span>
                                            @if($restName)
                                                <span style="color: white;"> {{ $restName }}</span>
                                            @endif
                                        </div>
                                        <div style="color: #9ca3af; font-size: 14px; margin-top: 4px;">{{ $user->user_id ?? '-' }}</div>
                                        
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 24px;">
                                            <!-- Phone -->
                                            <tr>
                                                <td style="padding-bottom: 8px;">
                                                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                        <tr>
                                                            <td width="30" style="vertical-align: top; padding-top: 2px;">
                                                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 18px; height: 18px;">
                                                                    <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="#FF9800" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                </svg>
                                                            </td>
                                                            <td style="vertical-align: top;">
                                                                <div style="color: #6b7280; font-size: 12px; margin-bottom: 2px;">Phone</div>
                                                                <div style="color: white; font-size: 12px;">{{ $user->phone ?? 'N/A' }}</div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            
                                            <!-- Email -->
                                            <tr>
                                                <td style="padding-bottom: 8px;">
                                                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                        <tr>
                                                            <td width="30" style="vertical-align: top; padding-top: 2px;">
                                                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 18px; height: 18px;">
                                                                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#FF9800" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                    <path d="L22 6L12 13L2 6" stroke="#FF9800" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                </svg>
                                                            </td>
                                                            <td style="vertical-align: top;">
                                                                <div style="color: #6b7280; font-size: 12px; margin-bottom: 2px;">Email</div>
                                                                <div style="color: white; font-size: 12px;">{{ $user->email ?? 'N/A' }}</div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            
                                            <!-- Sponsor -->
                                            <tr>
                                                <td style="padding-bottom: 8px;">
                                                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                        <tr>
                                                            <td width="30" style="vertical-align: top; padding-top: 2px;">
                                                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 18px; height: 18px;">
                                                                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#FF9800" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#FF9800" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                </svg>
                                                            </td>
                                                            <td style="vertical-align: top;">
                                                                <div style="color: #6b7280; font-size: 12px; margin-bottom: 2px;">Sponsor</div>
                                                                <div style="color: white; font-size: 12px;">{{ $user->sponsor_name ?? 'N/A' }}</div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            
                                            <!-- Website -->
                                            <tr>
                                                <td style="padding-bottom: 8px;">
                                                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                        <tr>
                                                            <td width="30" style="vertical-align: top; padding-top: 2px;">
                                                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 18px; height: 18px;">
                                                                    <circle cx="12" cy="12" r="10" stroke="#FF9800" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                    <path d="M2 12H22" stroke="#FF9800" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                    <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="#FF9800" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                </svg>
                                                            </td>
                                                            <td style="vertical-align: top;">
                                                                <div style="color: #6b7280; font-size: 12px; margin-bottom: 2px;">Website</div>
                                                                <div style="color: white; font-size: 12px;">tathastuayurveda.world</div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    
                                    <!-- RIGHT SIDE PROFILE IMAGE -->
                                    <td width="45%" style="vertical-align: middle; text-align: center; padding: 20px;">
                                        @if (isset($profilePictureBase64) && $profilePictureBase64)
                                            <img src="{{ $profilePictureBase64 }}" alt="Profile" style="width: 180px; height: 180px; border: 5px solid #FF9800; border-radius: 50%; object-fit: cover; display: block; margin: 0 auto;" />
                                        @else
                                            <div style="width: 180px; height: 180px; border: 5px solid #FF9800; border-radius: 50%; background-color: #e5e7eb; text-align: center; line-height: 180px; font-size: 48px; font-weight: bold; color: #1a1a1a; margin: 0 auto;">
                                                {{ strtoupper(substr($user->name ?? 'U', 0, 1)) }}
                                            </div>
                                        @endif
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- ORANGE STRIPE AT BOTTOM -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td style="background-color: #FF9800; height: 40px; padding-left: 32px; vertical-align: middle;">
                                        <div style="color: white; font-weight: 600; font-size: 14px; letter-spacing: 0.05em;">&nbsp;</div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <tr>
            <td align="center" style="padding: 0;">
                <!-- BACK CARD -->
                <table cellpadding="0" cellspacing="0" border="0" width="500" style="background-color: #1a1a1a;">
                    <tr>
                        <td>
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td align="center" style="padding: 40px 20px;">
                                        <div style="width: 200px; height: 200px; background-color: white; border: 5px solid #FF9800; border-radius: 50%; margin: 0 auto;">
                                            <div style="padding: 30px; text-align: center;">
                                                <img src="{{ $logoUrl ?? 'https://www.tathastuayurveda.world/images/logo.png' }}" alt="Logo" style="width: 140px; height: 140px; object-fit: contain;" />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- ORANGE STRIPE AT BOTTOM WITH WEBSITE -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td style="background-color: #FF9800; height: 40px; padding-left: 32px; vertical-align: middle;">
                                        <div style="color: white; font-weight: 600; font-size: 14px; letter-spacing: 0.05em;">www.tathastuayurveda.world</div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
