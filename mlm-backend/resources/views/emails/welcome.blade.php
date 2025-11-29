<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Tathastu Ayurveda</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #16a34a;
        }
        .header h1 {
            color: #16a34a;
            margin: 0;
            font-size: 28px;
        }
        .content {
            margin-bottom: 30px;
        }
        .content h2 {
            color: #16a34a;
            font-size: 22px;
            margin-top: 0;
        }
        .info-box {
            background-color: #f0fdf4;
            border-left: 4px solid #16a34a;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .info-box strong {
            color: #15803d;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #16a34a;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
        }
        .button:hover {
            background-color: #15803d;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
        }
        .footer a {
            color: #16a34a;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌿 Welcome to Tathastu Ayurveda! 🌿</h1>
        </div>
        
        <div class="content">
            <p>Dear <strong>{{ $user->name }}</strong>,</p>
            
            <p>We are thrilled to welcome you to the Tathastu Ayurveda family! Your account has been successfully created and you're now part of our growing community.</p>
            
            <div class="info-box">
                <p><strong>Your Account Details:</strong></p>
                <p><strong>User ID:</strong> {{ $user->user_id }}</p>
                <p><strong>Email:</strong> {{ $user->email }}</p>
                <p><strong>Phone:</strong> {{ $user->phone }}</p>
                @if($user->sponsor_name)
                <p><strong>Sponsor:</strong> {{ $user->sponsor_name }} ({{ $user->sponsor_id }})</p>
                @endif
            </div>
            
            <h2>What's Next?</h2>
            <ul>
                <li>Complete your profile and KYC verification</li>
                <li>Explore our range of authentic Ayurvedic products</li>
                <li>Start building your network and earning rewards</li>
                <li>Access training materials and resources</li>
            </ul>
            
            <p style="text-align: center;">
                <a href="{{ config('app.url') }}/admin/dashboard" class="button">Access Your Dashboard</a>
            </p>
            
            <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team.</p>
            
            <p>Once again, welcome aboard! We're excited to have you with us on this journey.</p>
            
            <p>Best regards,<br>
            <strong>The Tathastu Ayurveda Team</strong></p>
        </div>
        
        <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>© {{ date('Y') }} Tathastu Ayurveda. All rights reserved.</p>
            <p>
                <a href="{{ config('app.url') }}">Visit our website</a> | 
                <a href="mailto:tathastuayurveda@zohomail.in">Contact Support</a>
            </p>
        </div>
    </div>
</body>
</html>

