const express = require('express');
const { login, register, getMe } = require('../controllers/authController');
const { googleLogin } = require('../controllers/googleAuthController');
const { sendEmailOTP, verifyEmailOTP } = require('../controllers/emailOTPController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/email-otp/send', sendEmailOTP);
router.post('/email-otp/verify', verifyEmailOTP);
router.get('/me', authenticate, getMe);

module.exports = router;
