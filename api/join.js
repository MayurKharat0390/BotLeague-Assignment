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
        const { name, email, role, loc } = req.body;

        // Backend Validation
        if (!name || !email || !role) {
            return res.status(400).json({ error: 'Missing required fields: name, email, role' });
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
            const response = await fetch(`${supabaseUrl}/rest/v1/registrations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify({
                    name,
                    email,
                    role,
                    location: loc || '',
                    created_at: new Date().toISOString()
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error('Database write failed:', errText);
                throw new Error('Failed to save registration to database');
            }
            dbStatus = 'Supabase PostgreSQL';
        } else {
            console.log(`[Mock DB] Storing Registration: Name: ${name}, Email: ${email}, Role: ${role}`);
        }

        // Send confirmation email via Resend or Brevo
        const resendApiKey = process.env.RESEND_API_KEY;
        const brevoApiKey = process.env.BREVO_API_KEY;
        const brevoSenderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@botleague.com';
        let emailSent = false;

        const emailHtml = `
            <div style="background-color: #0c0c12; color: #ffffff; padding: 40px; font-family: 'Segoe UI', sans-serif; border-radius: 8px; max-width: 600px; margin: 0 auto; border: 1px solid #38bdf8;">
                <h1 style="color: #38bdf8; text-align: center; text-transform: uppercase; letter-spacing: 2px;">Ecosystem Portal</h1>
                <p style="font-size: 16px; line-height: 1.6; color: #b0b0bc;">Hello <strong>${name}</strong>,</p>
                <p style="font-size: 16px; line-height: 1.6; color: #b0b0bc;">We have successfully received your application to join the BotLeague Ecosystem as a <strong>${role}</strong>.</p>
                <div style="background-color: rgba(56,189,248,0.05); border: 1px dashed rgba(56,189,248,0.3); border-radius: 6px; padding: 20px; margin: 25px 0;">
                    <h3 style="color: #38bdf8; margin-top: 0;">📋 APPLICATION LOG</h3>
                    <p style="margin: 5px 0; color: #d0d0dc;"><strong>Name / Org:</strong> ${name}</p>
                    <p style="margin: 5px 0; color: #d0d0dc;"><strong>Role Applied:</strong> ${role}</p>
                    <p style="margin: 5px 0; color: #d0d0dc;"><strong>Location:</strong> ${loc || 'Not Specified'}</p>
                    <p style="margin: 5px 0; color: #d0d0dc;"><strong>Status:</strong> Under Review ⏳</p>
                </div>
                <p style="font-size: 15px; line-height: 1.6; color: #8c8c9c; text-align: center; margin-top: 30px;">
                    Our operations team will review your credentials and contact you shortly.
                </p>
            </div>
        `;

        if (brevoApiKey) {
            try {
                const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json',
                        'api-key': brevoApiKey,
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        sender: {
                            name: 'BotLeague Ecosystem',
                            email: brevoSenderEmail
                        },
                        to: [{ email, name }],
                        subject: `🤖 Application Received: BotLeague ${role}!`,
                        htmlContent: emailHtml
                    })
                });
                if (emailResponse.ok) {
                    emailSent = true;
                    console.log(`Ecosystem confirmation email sent to ${email} via Brevo`);
                } else {
                    const emailErr = await emailResponse.text();
                    console.error('Brevo API email error:', emailErr);
                }
            } catch (emailErr) {
                console.error('Failed to send ecosystem confirmation email via Brevo:', emailErr);
            }
        } else if (resendApiKey) {
            try {
                const emailResponse = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${resendApiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from: 'BotLeague Ecosystem <onboarding@resend.dev>',
                        to: [email],
                        subject: `🤖 Application Received: BotLeague ${role}!`,
                        html: emailHtml
                    })
                });
                if (emailResponse.ok) {
                    emailSent = true;
                    console.log(`Ecosystem confirmation email sent to ${email} via Resend`);
                } else {
                    const emailErr = await emailResponse.text();
                    console.error('Resend API email error:', emailErr);
                }
            } catch (emailErr) {
                console.error('Failed to send ecosystem confirmation email via Resend:', emailErr);
            }
        } else {
            console.log(`[Email Mock] Ecosystem email for ${email} skipped (configure BREVO_API_KEY or RESEND_API_KEY)`);
        }

        return res.status(200).json({
            success: true,
            message: 'Successfully registered for the BotLeague Ecosystem!',
            data: { name, email, role },
            database: dbStatus,
            emailSent
        });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}
