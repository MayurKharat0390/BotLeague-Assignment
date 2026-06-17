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
        const { email, password } = req.body;

        // Backend Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

        let userRecord = null;
        let dbStatus = 'Mock/Memory Database';

        if (supabaseUrl && supabaseKey) {
            // Find user in database
            const response = await fetch(`${supabaseUrl}/rest/v1/users?email=eq.${encodeURIComponent(email)}`, {
                method: 'GET',
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`
                }
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error('Database query failed:', errText);
                throw new Error('Database connection issue');
            }

            const users = await response.json();
            if (!users || users.length === 0) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            userRecord = users[0];
            dbStatus = 'Supabase PostgreSQL';

            // Verify password using saved salt & hash
            const verifyHash = crypto.pbkdf2Sync(password, userRecord.password_salt, 1000, 64, 'sha512').toString('hex');
            if (verifyHash !== userRecord.password_hash) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }
        } else {
            // Mock authentication fallback
            if (email === 'admin@botleague.com' && password === 'password123') {
                userRecord = { username: 'AdminBot', email: 'admin@botleague.com' };
            } else if (password.length >= 6) {
                // If local/offline mock database mode, accept any password >= 6 chars
                userRecord = { username: email.split('@')[0], email };
            } else {
                return res.status(401).json({ error: 'Invalid email or password. (Mock Mode: Password must be >= 6 characters. Try admin@botleague.com / password123)' });
            }
        }

        const username = userRecord.username;
        const mockToken = Buffer.from(JSON.stringify({ email, username, exp: Date.now() + 24*60*60*1000 })).toString('base64');

        return res.status(200).json({
            success: true,
            message: 'Logged in successfully!',
            token: mockToken,
            user: { username, email },
            database: dbStatus
        });

    } catch (err) {
        console.error('Login server error:', err);
        return res.status(500).json({ error: err.message || 'Internal server error' });
    }
}
