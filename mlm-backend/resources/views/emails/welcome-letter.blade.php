<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome Letter - Tathastu Ayurveda</title>
    <style>
        @page {
            margin: 0;
            size: A4 portrait;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }

        .wrapper {
            position: relative;
            width: 100%;
        }

        .bg-img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1;
        }

        .logo-img {
            position: absolute;
            top: 15px;
            right: 8%;
            width: 140px;
            height: 140px;
            z-index: 30;
        }

        .content-wrapper {
            position: relative;
            z-index: 20;
            padding: 154px 60px 50px 60px;
            color: #1f2937;
            line-height: 1.4;
        }

        h1 {
            font-size: 1.5rem;
            font-weight: bold;
            color: #c2410c;
            margin-bottom: 0.5rem;
            margin-top: 0;
            text-align: center;
        }

        h2 {
            font-size: 1rem;
            font-weight: 600;
            color: #c2410c;
            margin-bottom: 0.75rem;
            text-align: center;
        }

        h3 {
            font-size: 0.95rem;
            font-weight: 600;
            color: #c2410c;
            margin-bottom: 0.5rem;
            margin-top: 0.5rem;
        }

        p {
            font-size: 0.75rem;
            margin-bottom: 0.65rem;
            text-align: justify;
        }

        .detail-row {
            font-size: 0.75rem;
            margin-bottom: 0.3rem;
        }

        .detail-label {
            font-weight: 600;
        }

        .detail-value {
            color: #1f2937;
        }

        .detail-value.highlight {
            color: #c2410c;
            font-weight: 600;
        }

        .closing {
            margin-top: 0.8rem;
            font-size: 0.75rem;
        }

        .closing-bold {
            font-weight: 600;
        }

        .closing-company {
            font-weight: 600;
            color: #c2410c;
        }

        .closing-tagline {
            font-size: 0.7rem;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        @if(!empty($backgroundImagePath))
        <img src="{{ $backgroundImagePath }}" alt="" class="bg-img" style="width: 100%; height: auto;" />
        @endif

        @if(!empty($logoPath))
        <img src="{{ $logoPath }}" alt="Logo" class="logo-img" />
        @endif

        <div class="content-wrapper">
            <h1>Welcome Letter</h1>

            <h2>Welcome to the Tathastu Ayurveda Family</h2>

            <p>
                It gives us immense pleasure to welcome you as a valued Distributor of
                <strong style="color: #c2410c;"> Tathastu Ayurveda</strong>.
                You are now part of a transparent, ethical, and fast-growing wellness organization
                dedicated to transforming lives through authentic Ayurvedic products and
                digital entrepreneurship.
            </p>

            <p>
                As you begin this exciting journey, we extend our best wishes for your growth and
                success. Your Distributor ID and other details mentioned below will be required for
                all future communication with the company. Kindly ensure that your contact and mailing
                details are accurate for seamless correspondence.
            </p>

            <p>
                If you need any assistance or clarification at any point, our Business Support Team
                is always available to guide you.
            </p>

            <h3>Your Registration Details</h3>

            <div class="detail-row">
                <span class="detail-label">Distributor Name:</span>
                <span class="detail-value"> {{ $user->name ?? '-' }}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Distributor ID:</span>
                <span class="detail-value"> {{ $user->user_id ?? '-' }}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Sponsor ID:</span>
                <span class="detail-value"> {{ $user->sponsor_id ?? 'N/A' }}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Sponsor Name:</span>
                <span class="detail-value"> {{ $user->sponsor_name ?? 'N/A' }}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Joining Date:</span>
                <span class="detail-value"> {{ $user->created_at ? \Carbon\Carbon::parse($user->created_at)->format('D M d Y') : '-' }}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Activation Date:</span>
                <span class="detail-value"> {{ ($user->activationDate ?? $user->activation_date) ?: 'Not Activated' }}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value highlight"> Active</span>
            </div>

            <p>
                Tathastu Ayurveda congratulates you on taking your first step towards a
                prosperous and rewarding future. We look forward to seeing you grow, lead,
                and achieve great success within our system.
            </p>

            <div class="closing">
                <p>
                    <span class="closing-bold">With Warm Regards,</span><br />
                    <span class="closing-company">Tathastu Ayurveda</span><br />
                    <span class="closing-tagline">Empowering Wellness, Wealth & Wisdom</span>
                </p>
            </div>
        </div>
    </div>
</body>
</html>
