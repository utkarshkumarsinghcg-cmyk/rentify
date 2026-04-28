const express = require('express');
const { login, register, getMe } = require('../controllers/authController');
const { googleLogin } = require('../controllers/googleAuthController');
const { sendEmailOTP, verifyEmailOTP } = require('../controllers/emailOTPController');
const { phoneLogin } = require('../controllers/phoneAuthController');
const { checkPhoneLimit, incrementPhoneLimit } = require('../controllers/phoneLimitController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/email-otp/send', sendEmailOTP);
router.post('/email-otp/verify', verifyEmailOTP);

// Phone Auth Routes
router.get('/phone-otp/check-limit', checkPhoneLimit);
router.post('/phone-otp/increment-limit', incrementPhoneLimit);
router.post('/phone-login', phoneLogin);

router.get('/me', authenticate, getMe);

module.exports = router;
