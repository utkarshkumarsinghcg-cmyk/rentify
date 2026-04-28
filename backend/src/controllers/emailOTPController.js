const crypto = require('crypto');
const EmailOTP = require('../models/EmailOTP');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { sendOTPEmail, sendWelcomeEmail } = require('../services/emailService');

/**
 * Send OTP to email
 * POST /api/auth/email-otp/send
 */
exports.sendEmailOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const normalizedEmail = email.toLowerCase().trim();

    // Rate limit: max 5 OTPs per email per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentOTPs = await EmailOTP.countDocuments({
      email: normalizedEmail,
      createdAt: { $gte: oneHourAgo }
    });

    if (recentOTPs >= 5) {
      return res.status(429).json({ 
        error: 'Too many OTP requests. Please wait before requesting another.' 
      });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete old OTPs for this email
    await EmailOTP.deleteMany({ email: normalizedEmail });

    // Save new OTP
    await EmailOTP.create({ email: normalizedEmail, otp, expiresAt });

    // Send email
    await sendOTPEmail(normalizedEmail, otp);

    console.log(`[Email OTP] Sent to ${normalizedEmail}`);
    res.json({ message: 'OTP sent to your email', email: normalizedEmail });
  } catch (error) {
    console.error('[Email OTP] Send error:', error.message);
    res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
  }
};

/**
 * Verify OTP and login/register
 * POST /api/auth/email-otp/verify
 */
exports.verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp, name, role } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });

    const normalizedEmail = email.toLowerCase().trim();

    // Find valid OTP
    const otpRecord = await EmailOTP.findOne({
      email: normalizedEmail,
      otp,
      expiresAt: { $gt: new Date() },
      verified: false
    });

    if (!otpRecord) {
      // Increment attempts on most recent OTP
      await EmailOTP.findOneAndUpdate(
        { email: normalizedEmail },
        { $inc: { attempts: 1 } }
      );

      // Check if too many failed attempts
      const latest = await EmailOTP.findOne({ email: normalizedEmail });
      if (latest && latest.attempts >= 5) {
        await EmailOTP.deleteMany({ email: normalizedEmail });
        return res.status(429).json({ error: 'Too many failed attempts. Please request a new OTP.' });
      }

      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Mark as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Find or create user
    let user = await User.findOne({ email: normalizedEmail });
    let isNewUser = false;

    if (!user) {
      // Block admin signup
      const VALID_ROLES = ['OWNER', 'RENTER', 'SERVICE', 'INSPECTOR'];
      const selectedRole = (role && VALID_ROLES.includes(role.toUpperCase()))
        ? role.toUpperCase()
        : 'RENTER';

      user = await User.create({
        name: name || normalizedEmail.split('@')[0],
        email: normalizedEmail,
        passwordHash: `EMAIL_OTP_${Date.now()}`,
        role: selectedRole,
        authProvider: 'email-otp'
      });
      isNewUser = true;
      console.log(`[Email OTP] New user: ${normalizedEmail} as ${selectedRole}`);

      // Send welcome email (non-blocking)
      sendWelcomeEmail(normalizedEmail, user.name, selectedRole).catch(err => 
        console.error('[Welcome Email] Error:', err.message)
      );
    }

    const token = generateToken(user._id);
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token,
      isNewUser
    });
  } catch (error) {
    console.error('[Email OTP] Verify error:', error.message);
    res.status(500).json({ error: 'Verification failed. Please try again.' });
  }
};
