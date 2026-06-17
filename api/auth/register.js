const crypto = require('crypto');

module.exports = async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { username, email, password } = req.body;

        // Backend Validation
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Salt and Hash password using native crypto pbkdf2
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

        // Check database configurations
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

        let dbStatus = 'Mock/Memory Database';

        if (supabaseUrl && supabaseKey) {
            // First check if user already exists
            const checkRes = await fetch(`${supabaseUrl}/rest/v1/users?email=eq.${encodeURIComponent(email)}`, {
                method: 'GET',
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`
                }
            });

            if (checkRes.ok) {
                const existingUsers = await checkRes.json();
                if (existingUsers && existingUsers.length > 0) {
                    return res.status(400).json({ error: 'Email already registered' });
                }
            }

            // Insert new user
            const response = await fetch(`${supabaseUrl}/rest/v1/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify({
                    username,
                    email,
                    password_hash: hash,
                    password_salt: salt,
                    created_at: new Date().toISOString()
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error('Registration Database write failed:', errText);
                throw new Error('Database write error');
            }
            dbStatus = 'Supabase PostgreSQL';
        } else {
            console.log(`[Mock DB] Register User: ${username} (${email})`);
        }

        // Generate token
        const mockToken = Buffer.from(JSON.stringify({ email, username, exp: Date.now() + 24*60*60*1000 })).toString('base64');

        // Send confirmation email via Resend or Brevo
        const resendApiKey = process.env.RESEND_API_KEY;
        const brevoApiKey = process.env.BREVO_API_KEY;
        const brevoSenderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@botleague.com';
        let emailSent = false;
        
        const emailHtml = `
            <div style="background-color: #0c0c12; color: #ffffff; padding: 40px; font-family: 'Segoe UI', sans-serif; border-radius: 8px; max-width: 600px; margin: 0 auto; border: 1px solid #ff0055;">
                <h1 style="color: #ff0055; text-align: center; text-transform: uppercase; letter-spacing: 2px;">BotLeague Arena</h1>
                <p style="font-size: 16px; line-height: 1.6; color: #b0b0bc;">Hello <strong>${username}</strong>,</p>
                <p style="font-size: 16px; line-height: 1.6; color: #b0b0bc;">Your account has been successfully verified! You now have full pilot access to India's Ultimate Robotics Arena.</p>
                <div style="background-color: rgba(255,0,85,0.05); border: 1px dashed rgba(255,0,85,0.3); border-radius: 6px; padding: 20px; margin: 25px 0;">
                    <h3 style="color: #ff0055; margin-top: 0;">🔧 YOUR PROFILE LOG</h3>
                    <p style="margin: 5px 0; color: #d0d0dc;"><strong>Username:</strong> ${username}</p>
                    <p style="margin: 5px 0; color: #d0d0dc;"><strong>Portal Access:</strong> Granted (Level 1 Pilot)</p>
                    <p style="margin: 5px 0; color: #d0d0dc;"><strong>XP Multiplier:</strong> 1.0x active</p>
                </div>
                <p style="font-size: 15px; line-height: 1.6; color: #8c8c9c; text-align: center; margin-top: 30px;">
                    Prepare your Battle Bot. We will see you in the arena!
                </p>
            </div>
        `;

        if (brevoApiKey) {
            // Brevo allows sending to ANY email address in free sandbox mode!
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
                            name: 'BotLeague Arena',
                            email: brevoSenderEmail
                        },
                        to: [{ email, name: username }],
                        subject: '🤖 Welcome to BotLeague Arena!',
                        htmlContent: emailHtml
                    })
                });

                if (emailResponse.ok) {
                    emailSent = true;
                    console.log(`Welcome email successfully sent to ${email} via Brevo`);
                } else {
                    const emailErr = await emailResponse.text();
                    console.error('Brevo API email error:', emailErr);
                }
            } catch (emailErr) {
                console.error('Brevo service failed to send email:', emailErr);
            }
        } else if (resendApiKey) {
            // Resend requires verified domain to send to others
            try {
                const emailResponse = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${resendApiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from: 'BotLeague Arena <onboarding@resend.dev>',
                        to: [email],
                        subject: '🤖 Welcome to BotLeague Arena!',
                        html: emailHtml
                    })
                });
                
                if (emailResponse.ok) {
                    emailSent = true;
                    console.log(`Welcome email successfully sent to ${email} via Resend`);
                } else {
                    const emailErr = await emailResponse.text();
                    console.error('Resend API email error:', emailErr);
                }
            } catch (emailErr) {
                console.error('Resend service failed to send email:', emailErr);
            }
        } else {
            console.log(`[Email Mock] Welcome email for ${email} skipped (configure BREVO_API_KEY or RESEND_API_KEY)`);
        }

        return res.status(200).json({
            success: true,
            message: 'User registered successfully!',
            token: mockToken,
            user: { username, email },
            database: dbStatus,
            emailSent
        });

    } catch (err) {
        console.error('Registration server error:', err);
        return res.status(500).json({ error: err.message || 'Internal server error' });
    }
}
