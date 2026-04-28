const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Verify connection on startup
transporter.verify()
  .then(() => console.log('✅ Email transporter ready'))
  .catch((err) => console.error('❌ Email transporter error:', err.message));

/**
 * Send OTP email with a premium HTML template
 */
const sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: `"Rentify" <${process.env.GMAIL_USER}>`,
    to,
    subject: `🔐 Your Rentify Verification Code: ${otp}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0f172a; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #2563eb, #4f46e5); padding: 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: white; letter-spacing: -0.5px;">🏠 Rentify</h1>
          <p style="margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Smart Rental Management</p>
        </div>
        
        <!-- Body -->
        <div style="padding: 32px;">
          <h2 style="color: #f1f5f9; font-size: 20px; margin: 0 0 8px; font-weight: 700;">Verification Code</h2>
          <p style="color: #94a3b8; font-size: 14px; margin: 0 0 24px; line-height: 1.6;">
            Use this code to verify your email address. It expires in <strong style="color: #60a5fa;">10 minutes</strong>.
          </p>
          
          <!-- OTP Box -->
          <div style="background: #1e293b; border: 2px solid #334155; border-radius: 12px; padding: 20px; text-align: center; margin: 0 0 24px;">
            <span style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #60a5fa; font-family: 'Courier New', monospace;">${otp}</span>
          </div>
          
          <p style="color: #64748b; font-size: 12px; margin: 0; line-height: 1.6;">
            If you didn't request this code, you can safely ignore this email.<br/>
            <strong>Never share this code with anyone.</strong>
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background: #0f172a; padding: 16px 32px; border-top: 1px solid #1e293b; text-align: center;">
          <p style="color: #475569; font-size: 11px; margin: 0;">© ${new Date().getFullYear()} Rentify. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Send welcome email after signup
 */
const sendWelcomeEmail = async (to, name, role) => {
  const mailOptions = {
    from: `"Rentify" <${process.env.GMAIL_USER}>`,
    to,
    subject: `🎉 Welcome to Rentify, ${name}!`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0f172a; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b;">
        <div style="background: linear-gradient(135deg, #2563eb, #4f46e5); padding: 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: white;">🏠 Welcome to Rentify!</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #f1f5f9; font-size: 20px; margin: 0 0 16px;">Hey ${name}! 👋</h2>
          <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
            Your account has been created as <strong style="color: #60a5fa;">${role}</strong>. 
            You're all set to explore Rentify's smart rental management platform.
          </p>
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login" 
             style="display: inline-block; background: linear-gradient(135deg, #2563eb, #4f46e5); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 14px;">
            Go to Dashboard →
          </a>
        </div>
        <div style="padding: 16px 32px; border-top: 1px solid #1e293b; text-align: center;">
          <p style="color: #475569; font-size: 11px; margin: 0;">© ${new Date().getFullYear()} Rentify</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail, sendWelcomeEmail };
