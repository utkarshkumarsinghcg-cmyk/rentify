const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  try {
    const { credential, email, name, googleId } = req.body;
    
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

    // Find existing user or create new one
    let user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      // First-time Google user → create with RENTER role by default
      user = await User.create({
        name: userName,
        email: normalizedEmail,
        passwordHash: `GOOGLE_${googleId || 'oauth'}`,
        role: 'RENTER',
        authProvider: 'google'
      });
      console.log(`[Google Auth] New user created: ${normalizedEmail}`);
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
