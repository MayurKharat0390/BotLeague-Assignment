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

        return res.status(200).json({
            success: true,
            message: 'User registered successfully!',
            token: mockToken,
            user: { username, email },
            database: dbStatus
        });

    } catch (err) {
        console.error('Registration server error:', err);
        return res.status(500).json({ error: err.message || 'Internal server error' });
    }
}
