const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const { sendWhatsAppWelcome } = require('../services/whatsappService');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    
    // Block admin self-registration — admins can only be seeded
    if (role && role.toUpperCase() === 'ADMIN') {
      return res.status(403).json({ error: 'Admin accounts cannot be created via signup. Contact the platform administrator.' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      name,
      email: normalizedEmail,
      passwordHash,
      role,
      phone
    });
    
    // Trigger WhatsApp Welcome (non-blocking)
    if (phone) {
      sendWhatsAppWelcome(phone, user.name, user.role).catch(err => 
        console.error('[WhatsApp Bot] Welcome error:', err.message)
      );
    }
    
    const token = generateToken(user._id);
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Role Verification: Ensure user is logging in with their correct persona
    if (role && user.role.toUpperCase() !== role.toUpperCase()) {
      return res.status(403).json({ 
        error: `Account found, but you are registered as a ${user.role}. Please log in through the correct portal.` 
      });
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
    res.status(400).json({ error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
