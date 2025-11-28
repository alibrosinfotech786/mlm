<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Welcome Letter - Tathastu Ayurveda</title>
    <!--[if mso]>
    <style type="text/css">
        body, table, td {font-family: Arial, sans-serif !important;}
    </style>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f0; font-family: Arial, sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f0; padding: 20px 0;">
        <tr>
            <td align="center">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e7eb; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    
                    <!-- Decorative Top Border -->
                    <tr>
                        <td style="background-color: #86efac; height: 20px; padding: 0; border-top-left-radius: 10px; border-top-right-radius: 10px;">
                            &nbsp;
                        </td>
                    </tr>
                    
                    <!-- Header Section -->
                    <tr>
                        <td style="padding: 30px 40px 20px 40px; background-color: #ffffff;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="vertical-align: top;">
                                        <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: bold; color: #16a34a; line-height: 1.2; font-family: Arial, sans-serif;">Welcome Letter</h1>
                                        <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.5; font-family: Arial, sans-serif;">
                                            Welcome to our ever shine family of <span style="color: #16a34a; font-weight: 500;">Tathastu Ayurveda Pvt Ltd</span>
                                        </p>
                                    </td>
                                    <td style="vertical-align: top; text-align: right; width: 90px; padding-left: 20px;">
                                        <img src="{{ config('app.url') }}/images/logo.png" alt="Tathastu Ayurveda Logo" width="90" height="90" style="display: block; max-width: 90px; height: auto; border: 0;" />
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Content Section -->
                    <tr>
                        <td style="padding: 0 40px 30px 40px; background-color: #ffffff;">
                            <!-- Welcome Message -->
                            <p style="margin: 0 0 20px 0; font-size: 14px; color: #333333; line-height: 1.6; font-family: Arial, sans-serif;">
                                It gives us immense pleasure to welcome you as a <strong style="color: #16a34a; font-weight: 600;">Global Business Associate</strong> of <strong style="color: #16a34a; font-weight: 600;">Tathastu Ayurveda Pvt Ltd</strong>.
                            </p>
                            
                            <!-- Details Section -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 25px 0;">
                                <tr>
                                    <td style="padding: 6px 0; font-size: 14px; color: #333333; line-height: 1.6; font-family: Arial, sans-serif;">
                                        <strong style="font-weight: 600; color: #333333;">Associate Name:</strong> <span style="color: #333333;">{{ $user->name ?? '-' }}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0; font-size: 14px; color: #333333; line-height: 1.6; font-family: Arial, sans-serif;">
                                        <strong style="font-weight: 600; color: #333333;">User ID:</strong> <span style="color: #333333;">{{ $user->user_id ?? '-' }}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0; font-size: 14px; color: #333333; line-height: 1.6; font-family: Arial, sans-serif;">
                                        <strong style="font-weight: 600; color: #333333;">Sponsor ID:</strong> <span style="color: #333333;">{{ $user->sponsor_id ?? 'N/A' }}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0; font-size: 14px; color: #333333; line-height: 1.6; font-family: Arial, sans-serif;">
                                        <strong style="font-weight: 600; color: #333333;">Sponsor Name:</strong> <span style="color: #333333;">{{ $user->sponsor_name ?? 'N/A' }}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0; font-size: 14px; color: #333333; line-height: 1.6; font-family: Arial, sans-serif;">
                                        <strong style="font-weight: 600; color: #333333;">Joining Date:</strong> <span style="color: #333333;">{{ $user->created_at ? \Carbon\Carbon::parse($user->created_at)->format('D M d Y') : '-' }}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0; font-size: 14px; color: #333333; line-height: 1.6; font-family: Arial, sans-serif;">
                                        <strong style="font-weight: 600; color: #333333;">Date of Activation:</strong> <span style="color: #333333;">{{ $user->isActive ? ($user->updated_at ? \Carbon\Carbon::parse($user->updated_at)->format('D M d Y') : 'Activated') : 'Not Activated' }}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0; font-size: 14px; color: #333333; line-height: 1.6; font-family: Arial, sans-serif;">
                                        <strong style="font-weight: 600; color: #333333;">Status:</strong> <span style="color: #16a34a; font-weight: 600;">{{ $user->isActive ? 'Active' : 'Not Active' }}</span>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Closing -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                                <tr>
                                    <td style="font-size: 14px; color: #333333; line-height: 1.6; font-family: Arial, sans-serif;">
                                        <p style="margin: 0 0 5px 0; font-weight: 600; color: #333333;">With Best Regards,</p>
                                        <p style="margin: 0; color: #16a34a; font-weight: 500;">Tathastu Ayurveda Pvt Ltd</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Decorative Bottom Border -->
                    <tr>
                        <td style="background-color: #86efac; height: 20px; padding: 0; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
                            &nbsp;
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
