const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const { sendWhatsAppWelcome } = require('../services/whatsappService');

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phone } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    
    // Block admin self-registration
    if (role && role.toUpperCase() === 'ADMIN') {
      return res.status(403).json({ error: 'Admin accounts cannot be created via signup.' });
    }

    // Check if email exists
    const emailExists = await User.findOne({ email: normalizedEmail });
    if (emailExists) {
      return res.status(409).json({ 
        message: 'Email already registered', 
        error: 'An account with this email already exists. Please sign in instead.',
        loginRedirect: true 
      });
    }

    // Generate Unique Username
    let username = `${firstName.toLowerCase()}${Math.floor(1000 + Math.random() * 9000)}`;
    let usernameExists = await User.findOne({ username });
    while (usernameExists) {
      username = `${firstName.toLowerCase()}${Math.floor(1000 + Math.random() * 9000)}`;
      usernameExists = await User.findOne({ username });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      firstName,
      lastName,
      username,
      email: normalizedEmail,
      passwordHash,
      role,
      phone
    });
    
    if (phone) {
      sendWhatsAppWelcome(phone, `${user.firstName} ${user.lastName || ''}`.trim(), user.role).catch(err => 
        console.error('[WhatsApp Bot] Welcome error:', err.message)
      );
    }
    
    const token = generateToken(user._id);
    res.status(201).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
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
    const { username, password, role } = req.body;
    const normalizedUsername = username.toLowerCase().trim();
    const user = await User.findOne({ username: normalizedUsername });
    
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (role && user.role.toUpperCase() !== role.toUpperCase()) {
      return res.status(403).json({ 
        error: `Account found, but you are registered as a ${user.role}.` 
      });
    }
    
    const token = generateToken(user._id);
    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
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
