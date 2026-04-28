import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import { Building2, Mail, Lock, Eye, EyeOff, ArrowRight, Home, Wrench, Search, User } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
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
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    
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
        role: selectedRole, // Send selected role for new accounts
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
      const response = await authService.login(formData.email, formData.password);
      handleLoginSuccess(response);
    } catch (error) {
      console.error('Login error:', error);
      const errMsg = error.response?.data?.error || error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
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
          
          {/* Testimonial Card */}
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

          {/* Role Selector */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">I am a</label>
            <div className="grid grid-cols-4 gap-2">
              {ROLES.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl text-xs font-bold transition-all duration-200 border-2 ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/25'
                        : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
                    }`}
                  >
                    <Icon size={16} />
                    {role.label}
                  </button>
                );
              })}
            </div>
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
            <span className="px-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Or sign in with email</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-400" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({...formData, email: e.target.value});
                    if(errors.email) setErrors({...errors, email: ''});
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border rounded-xl text-sm focus:ring-2 outline-none transition-all ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500/20 dark:border-red-500/50' 
                      : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                  } dark:text-white`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.email}</p>}
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
