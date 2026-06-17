export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email } = req.body;

        // Backend Validation
        if (!email) {
            return res.status(400).json({ error: 'Email field is required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // Check for Supabase environment variables
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

        let dbStatus = 'Mock/Memory Database';

        if (supabaseUrl && supabaseKey) {
            // Real Supabase insert using REST API
            const response = await fetch(`${supabaseUrl}/rest/v1/subscribers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify({
                    email,
                    created_at: new Date().toISOString()
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error('Database write failed:', errText);
                throw new Error('Failed to save subscriber to database');
            }
            dbStatus = 'Supabase PostgreSQL';
        } else {
            console.log(`[Mock DB] Storing Subscriber: Email: ${email}`);
        }

        // Send confirmation email via Resend
        const resendApiKey = process.env.RESEND_API_KEY;
        let emailSent = false;
        if (resendApiKey) {
            try {
                const emailResponse = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${resendApiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from: 'BotLeague Newsletter <onboarding@resend.dev>',
                        to: [email],
                        subject: '🤖 Subscribed: BotLeague Intel Feed!',
                        html: `
                            <div style="background-color: #0c0c12; color: #ffffff; padding: 40px; font-family: 'Segoe UI', sans-serif; border-radius: 8px; max-width: 600px; margin: 0 auto; border: 1px solid #fbbf24;">
                                <h1 style="color: #fbbf24; text-align: center; text-transform: uppercase; letter-spacing: 2px;">BotLeague Arena</h1>
                                <p style="font-size: 16px; line-height: 1.6; color: #b0b0bc;">Hi there,</p>
                                <p style="font-size: 16px; line-height: 1.6; color: #b0b0bc;">You have successfully subscribed to the **BotLeague Intel Feed**! You will now receive exclusive updates on battle cards, ticket drops, arena details, and tech logs directly in your inbox.</p>
                                <p style="font-size: 15px; line-height: 1.6; color: #8c8c9c; text-align: center; margin-top: 30px;">
                                    Stay tuned, Pilot. The first dispatch is loading...
                                </p>
                            </div>
                        `
                    })
                });
                if (emailResponse.ok) {
                    emailSent = true;
                    console.log(`Newsletter welcome email sent to ${email}`);
                } else {
                    const emailErr = await emailResponse.text();
                    console.error('Resend API email error:', emailErr);
                }
            } catch (emailErr) {
                console.error('Failed to send newsletter email:', emailErr);
            }
        } else {
            console.log(`[Resend Mock] Newsletter email for ${email} skipped (configure RESEND_API_KEY)`);
        }

        return res.status(200).json({
            success: true,
            message: 'Subscribed to newsletter successfully!',
            data: { email },
            database: dbStatus,
            emailSent
        });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}
