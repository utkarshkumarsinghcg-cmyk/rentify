const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const VALID_ROLES = ['OWNER', 'RENTER', 'SERVICE', 'INSPECTOR'];

exports.googleLogin = async (req, res) => {
  try {
    const { credential, email, name, googleId, role } = req.body;
    
    let normalizedEmail, userName;

    if (credential) {
      // Flow 1: ID Token verification (from GoogleLogin component)
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      normalizedEmail = payload.email.toLowerCase().trim();
      userName = payload.name;
    } else if (email && googleId) {
      // Flow 2: Access token flow (from useGoogleLogin hook — custom button)
      normalizedEmail = email.toLowerCase().trim();
      userName = name;
    } else {
      return res.status(400).json({ error: 'Google credential or user info is required' });
    }

    // Find existing user
    let user = await User.findOne({ email: normalizedEmail });
    
    if (user) {
      // Existing user — log them in with their stored role (ignore selected role)
      console.log(`[Google Auth] Existing user login: ${normalizedEmail} (${user.role})`);
    } else {
      // New user — use selected role (block ADMIN)
      const selectedRole = (role && VALID_ROLES.includes(role.toUpperCase())) 
        ? role.toUpperCase() 
        : 'RENTER';

      user = await User.create({
        name: userName,
        email: normalizedEmail,
        passwordHash: `GOOGLE_${googleId || 'oauth'}`,
        role: selectedRole,
        authProvider: 'google'
      });
      console.log(`[Google Auth] New user created: ${normalizedEmail} as ${selectedRole}`);
    }

    const token = generateToken(user._id);
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('[Google Auth] Error:', error.message);
    res.status(401).json({ error: 'Google authentication failed. Please try again.' });
  }
};
