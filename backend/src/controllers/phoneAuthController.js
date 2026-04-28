const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { sendWhatsAppWelcome } = require('../services/whatsappService');

/**
 * Handle user login/registration after successful Firebase Phone Verification.
 */
exports.phoneLogin = async (req, res) => {
  try {
    const { phone, role, name } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone number is required' });

    // Find or create user
    let user = await User.findOne({ phone: phone });
    let isNewUser = false;

    if (!user) {
      const VALID_ROLES = ['OWNER', 'RENTER', 'SERVICE', 'INSPECTOR'];
      const selectedRole = (role && VALID_ROLES.includes(role.toUpperCase()))
        ? role.toUpperCase()
        : 'RENTER';

      user = await User.create({
        name: name || `User_${phone.slice(-4)}`,
        phone: phone,
        email: `${phone}@rentify.com`, // Placeholder email
        passwordHash: `PHONE_AUTH_${Date.now()}`,
        role: selectedRole,
        authProvider: 'phone'
      });
      isNewUser = true;
      console.log(`[Phone Auth] New user: ${phone} as ${selectedRole}`);

      // Trigger WhatsApp Welcome (non-blocking)
      sendWhatsAppWelcome(phone, user.name, user.role).catch(err => 
        console.error('[WhatsApp Bot] Welcome error:', err.message)
      );
    }

    const token = generateToken(user._id);
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token,
      isNewUser
    });
  } catch (error) {
    console.error('[Phone Auth] Login error:', error.message);
    res.status(500).json({ error: 'Authentication failed' });
  }
};
