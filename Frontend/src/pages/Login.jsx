import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import { Building2, Mail, Lock, Eye, EyeOff, ArrowRight, Home, Wrench, Search, User, KeyRound, Timer, Phone } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from '../config/firebase';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const ROLES = [
  { id: 'OWNER', label: 'Owner', icon: Building2 },
  { id: 'RENTER', label: 'Tenant', icon: Home },
  { id: 'SERVICE', label: 'Service', icon: Wrench },
  { id: 'INSPECTOR', label: 'Inspector', icon: Search },
];

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('RENTER');
  const [loginMode, setLoginMode] = useState('password'); // 'password', 'email-otp', or 'phone-otp'
  const [otpStep, setOtpStep] = useState('input'); // 'input' or 'verify'
  
  // States for different modes
  const [otpEmail, setOtpEmail] = useState('');
  const [phone, setPhone] = useState('+91');
  const [otpCode, setOtpCode] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState(null);

  // Auto-detect role from URL, LocalStorage, or Referrer
  useEffect(() => {
    const referrer = document.referrer || '';
    const params = new URLSearchParams(window.location.search);
    const paramRole = params.get('role');
    const storedRole = localStorage.getItem('rentify_user_role');
    
    const roleMap = { 
      'owner': 'OWNER', 
      'renter': 'RENTER', 
      'tenant': 'RENTER', 
      'service': 'SERVICE', 
      'inspector': 'INSPECTOR' 
    };

    if (paramRole && roleMap[paramRole.toLowerCase()]) {
      setSelectedRole(roleMap[paramRole.toLowerCase()]);
    } else if (storedRole && roleMap[storedRole.toLowerCase()]) {
      setSelectedRole(roleMap[storedRole.toLowerCase()]);
    } else if (referrer.toLowerCase().includes('owner')) {
      setSelectedRole('OWNER');
    } else if (referrer.toLowerCase().includes('tenant') || referrer.toLowerCase().includes('renter')) {
      setSelectedRole('RENTER');
    } else if (referrer.toLowerCase().includes('service')) {
      setSelectedRole('SERVICE');
    } else if (referrer.toLowerCase().includes('inspector')) {
      setSelectedRole('INSPECTOR');
    }
  }, []);
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    
    if (!formData.password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSuccess = (response) => {
    dispatch(loginSuccess({ user: response.user, token: response.token }));
    const backendRole = response.user.role;
    const routeMap = { 'RENTER': 'tenant', 'OWNER': 'owner', 'SERVICE': 'service', 'INSPECTOR': 'inspector', 'ADMIN': 'admin' };
    localStorage.setItem('rentify_user_role', backendRole.toLowerCase() === 'renter' ? 'tenant' : backendRole.toLowerCase());
    toast.success('Welcome!');
    navigate(`/${routeMap[backendRole] || 'tenant'}-dashboard`);
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      setLoading(true);
      const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      const userInfo = await userInfoRes.json();
      
      const response = await authService.googleLoginWithInfo({
        email: userInfo.email,
        name: userInfo.name,
        googleId: userInfo.sub,
        picture: userInfo.picture,
        role: selectedRole,
      });
      
      handleLoginSuccess(response);
    } catch (err) {
      console.error('Google login error:', err);
      toast.error(err.response?.data?.error || err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => toast.error('Google login failed'),
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await authService.login(formData.username, formData.password, selectedRole);
      handleLoginSuccess(response);
    } catch (error) {
      console.error('Login error:', error);
      const errMsg = error.response?.data?.error || error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Email OTP handlers
  const handleSendEmailOTP = async (e) => {
    e.preventDefault();
    if (!otpEmail || !/\S+@\S+\.\S+/.test(otpEmail)) {
      toast.error('Please enter a valid email');
      return;
    }
    setLoading(true);
    try {
      await authService.sendEmailOTP(otpEmail);
      toast.success('OTP sent to your email! 📧');
      setOtpStep('verify');
      startTimer();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmailOTP = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      toast.error('Please enter the 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      const response = await authService.verifyEmailOTP({
        email: otpEmail,
        otp: otpCode,
        role: selectedRole,
      });
      handleLoginSuccess(response);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Phone OTP handlers
  const setupRecaptcha = () => {
    if (window.recaptchaVerifier) return;
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    });
  };

  const handleSendPhoneOTP = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast.error('Please enter a valid phone number with country code (e.g. +91...)');
      return;
    }

    setLoading(true);
    try {
      // 1. Check if user exists
      await authService.checkPhoneUser(phone);
      
      // 2. Check Backend Limit (330/day)
      await authService.checkPhoneLimit();
      
      // 3. Firebase Phone Auth
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(confirmation);
      
      // 4. Increment Backend Limit
      await authService.incrementPhoneLimit();
      
      toast.success('OTP sent to your phone! 📱');
      setOtpStep('verify');
      startTimer();
    } catch (err) {
      console.error('Phone OTP error:', err);
      toast.error(err.response?.data?.error || err.message || 'Failed to send SMS');
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then(widgetId => {
          window.grecaptcha.reset(widgetId);
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhoneOTP = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      toast.error('Please enter the 6-digit code');
      return;
    }
    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otpCode);
      const user = result.user;
      
      // Sync with backend
      const response = await authService.phoneLogin({
        phone: user.phoneNumber,
        role: selectedRole
      });
      
      handleLoginSuccess(response);
    } catch (err) {
      toast.error('Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    setOtpCountdown(60);
    const timer = setInterval(() => {
      setOtpCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
      {/* Hidden container for Firebase reCAPTCHA */}
      <div id="recaptcha-container"></div>

      {/* Left Side - Illustration */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        <div className="relative z-10 flex items-center gap-2 text-white">
          <Building2 size={32} />
          <span className="text-2xl font-black tracking-tight">Rentify</span>
        </div>
        
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-black text-white mb-6 leading-tight">Your Smart Home,<br/>Simplified.</h1>
          <p className="text-blue-100 text-lg mb-8">Manage properties, track maintenance, and handle payments seamlessly in one platform.</p>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl">
            <p className="text-white italic mb-4">"Rentify completely transformed how I manage my properties. The automated payment tracking saves me hours every week."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center font-bold text-white">SK</div>
              <div>
                <div className="text-white font-bold text-sm">Sarah Khan</div>
                <div className="text-blue-200 text-xs">Property Owner</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-md">
          <div className="text-center lg:text-left mb-6">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Welcome back</h2>
            <p className="text-slate-500 dark:text-slate-400">Please enter your details to sign in.</p>
          </div>

          {/* Auto-detected Role Badge (Subtle) */}
          <div className="mb-5 flex items-center justify-center lg:justify-start gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Persona:</span>
            <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black rounded-md border border-blue-100 dark:border-blue-800 flex items-center gap-1.5">
              {(() => {
                const roleObj = ROLES.find(r => r.id === selectedRole);
                const Icon = roleObj?.icon || Home;
                return <><Icon size={12} />{roleObj?.label || 'Tenant'}</>;
              })()}
            </span>
          </div>

          {/* Google Button */}
          <button
            onClick={() => googleLogin()}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 mb-5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md group"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 transition-transform group-hover:scale-110">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center before:flex-1 before:border-t before:border-slate-200 dark:before:border-slate-700 after:flex-1 after:border-t after:border-slate-200 dark:after:border-slate-700 mb-5">
            <span className="px-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Or sign in with</span>
          </div>

          {/* Login Mode Tabs */}
          <div className="flex mb-5 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            <button
              type="button"
              onClick={() => { setLoginMode('password'); setOtpStep('input'); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
                loginMode === 'password' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              <Lock size={12} /> Password
            </button>
            <button
              type="button"
              onClick={() => { setLoginMode('email-otp'); setOtpStep('input'); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
                loginMode === 'email-otp' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              <Mail size={12} /> Email OTP
            </button>
            <button
              type="button"
              onClick={() => { setLoginMode('phone-otp'); setOtpStep('input'); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
                loginMode === 'phone-otp' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              <Phone size={12} /> Phone
            </button>
          </div>

          {loginMode === 'phone-otp' ? (
            /* Phone OTP Form */
            otpStep === 'input' ? (
              <form onSubmit={handleSendPhoneOTP} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={18} className="text-slate-400" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:border-blue-500 focus:ring-blue-500/20 outline-none dark:text-white"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <p className="mt-1.5 text-[10px] text-slate-500 italic">Include country code (e.g. +91)</p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-70"
                >
                  {loading ? 'Sending SMS...' : 'Send OTP'}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyPhoneOTP} className="space-y-5">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Verification code sent to <strong className="text-blue-600">{phone}</strong>
                </p>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Enter Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center text-2xl font-mono font-bold tracking-[0.5em] focus:ring-2 focus:border-blue-500 focus:ring-blue-500/20 outline-none dark:text-white"
                    placeholder="000000"
                    autoFocus
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <button type="button" onClick={() => setOtpStep('input')} className="text-blue-600 font-bold hover:text-blue-500">← Change number</button>
                  {otpCountdown > 0 ? (
                    <span className="flex items-center gap-1 text-slate-400"><Timer size={12} /> Resend in {otpCountdown}s</span>
                  ) : (
                    <button type="button" onClick={handleSendPhoneOTP} className="text-blue-600 font-bold hover:text-blue-500">Resend SMS</button>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading || otpCode.length !== 6}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-70"
                >
                  {loading ? 'Verifying...' : 'Verify & Sign in'}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </form>
            )
          ) : loginMode === 'email-otp' ? (
            /* Email OTP Form */
            otpStep === 'input' ? (
              <form onSubmit={handleSendEmailOTP} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-slate-400" />
                    </div>
                    <input
                      type="email"
                      value={otpEmail}
                      onChange={(e) => setOtpEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:border-blue-500 focus:ring-blue-500/20 outline-none dark:text-white"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-70"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyEmailOTP} className="space-y-5">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  We sent a 6-digit code to <strong className="text-blue-600">{otpEmail}</strong>
                </p>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Enter OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center text-2xl font-mono font-bold tracking-[0.5em] focus:ring-2 focus:border-blue-500 focus:ring-blue-500/20 outline-none dark:text-white"
                    placeholder="000000"
                    autoFocus
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => { setOtpStep('input'); setOtpCode(''); }}
                    className="text-blue-600 font-bold hover:text-blue-500"
                  >
                    ← Change email
                  </button>
                  {otpCountdown > 0 ? (
                    <span className="flex items-center gap-1 text-slate-400">
                      <Timer size={12} /> Resend in {otpCountdown}s
                    </span>
                  ) : (
                    <button type="button" onClick={handleSendEmailOTP} className="text-blue-600 font-bold hover:text-blue-500">Resend OTP</button>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading || otpCode.length !== 6}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-70"
                >
                  {loading ? 'Verifying...' : 'Verify & Sign in'}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </form>
            )
          ) : (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => {
                      setFormData({...formData, username: e.target.value});
                      if(errors.username) setErrors({...errors, username: ''});
                    }}
                    className={`w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border rounded-xl text-sm focus:ring-2 outline-none transition-all ${
                      errors.username 
                        ? 'border-red-500 focus:ring-red-500/20 dark:border-red-500/50' 
                        : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                    } dark:text-white`}
                    placeholder="Enter your username"
                  />
                </div>
                {errors.username && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.username}</p>}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                  <Link to="/forgot-password" className="text-xs font-bold text-blue-600 hover:text-blue-500">Forgot Password?</Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({...formData, password: e.target.value});
                      if(errors.password) setErrors({...errors, password: ''});
                    }}
                    className={`w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-800 border rounded-xl text-sm focus:ring-2 outline-none transition-all ${
                      errors.password 
                        ? 'border-red-500 focus:ring-red-500/20 dark:border-red-500/50' 
                        : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                    } dark:text-white`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.password}</p>}
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600/20"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 dark:text-slate-400">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all focus:ring-4 focus:ring-blue-600/20 disabled:opacity-70"
              >
                {loading ? 'Signing in...' : 'Sign in'}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-blue-600 hover:text-blue-500">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
