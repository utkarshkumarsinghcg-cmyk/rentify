import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import { Building2, User, Mail, Phone, Lock, ArrowRight, ShieldCheck, Wrench, Search, CheckCircle2, Wand2 } from 'lucide-react';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const ROLES = [
  { id: 'OWNER', title: 'Owner', icon: Building2, desc: 'List and manage properties' },
  { id: 'RENTER', title: 'Tenant', icon: User, desc: 'Find and rent your perfect home' },
  { id: 'SERVICE', title: 'Service Provider', icon: Wrench, desc: 'Offer maintenance services' },
  { id: 'INSPECTOR', title: 'Inspector', icon: Search, desc: 'Conduct property inspections' },
];

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Auto-detect role from URL referrer or localStorage
  const detectRole = () => {
    const storedRole = localStorage.getItem('rentify_user_role');
    const referrer = document.referrer || '';
    const roleMap = { 'owner': 'OWNER', 'renter': 'RENTER', 'tenant': 'RENTER', 'service': 'SERVICE', 'inspector': 'INSPECTOR' };
    
    // Check URL search params first (e.g., /signup?role=owner)
    const params = new URLSearchParams(location.search);
    const paramRole = params.get('role');
    if (paramRole && roleMap[paramRole.toLowerCase()]) return roleMap[paramRole.toLowerCase()];
    
    // Check localStorage
    if (storedRole && roleMap[storedRole.toLowerCase()]) return roleMap[storedRole.toLowerCase()];
    
    // Check referrer URL
    for (const [key, value] of Object.entries(roleMap)) {
      if (referrer.includes(`/welcome/${key}`)) return value;
    }
    
    return 'RENTER'; // Default
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: detectRole(),
    roleInfo: {}
  });

  const detectedRoleLabel = ROLES.find(r => r.id === formData.role)?.title || 'Tenant';

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name || formData.name.trim().split(' ').length < 2) {
      newErrors.name = 'Please enter your full name (at least 2 words)';
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!/^\+?91?\s?[6-9]\d{9}$/.test(formData.phone?.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Valid Indian phone number required';
    }
    if (formData.password.length < 8 || !/[A-Z]/.test(formData.password) || !/[0-9]/.test(formData.password) || !/[!@#$%^&*]/.test(formData.password)) {
      newErrors.password = 'Min 8 chars, 1 uppercase, 1 number, 1 special char';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const special = "!@#$%^&*";
    
    let pwd = "";
    pwd += uppercase[Math.floor(Math.random() * uppercase.length)];
    pwd += special[Math.floor(Math.random() * special.length)];
    pwd += numbers[Math.floor(Math.random() * numbers.length)];
    pwd += numbers[Math.floor(Math.random() * numbers.length)];
    
    for (let i = 0; i < 8; i++) {
      pwd += chars[Math.floor(Math.random() * chars.length)];
    }
    
    // Shuffle
    pwd = pwd.split('').sort(() => 0.5 - Math.random()).join('');
    
    setFormData({ ...formData, password: pwd, confirmPassword: pwd });
    toast.success('Strong password generated!');
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      const backendRole = response.user.role;
      const routeMap = {
        'RENTER': 'tenant',
        'OWNER': 'owner',
        'SERVICE': 'service',
        'INSPECTOR': 'inspector',
        'ADMIN': 'admin'
      };
      const dashboardPrefix = routeMap[backendRole] || 'tenant';
      
      dispatch(loginSuccess({ user: response.user, token: response.token }));
      localStorage.setItem('rentify_user_role', backendRole.toLowerCase() === 'renter' ? 'tenant' : backendRole.toLowerCase());
      
      toast.success('Welcome to SmartRent! 🎉');
      navigate(`/${dashboardPrefix}-dashboard`);
    } catch (error) {
      console.error("Registration error:", error);
      const errMsg = error.response?.data?.error || error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      toast.error(errMsg, { id: 'signup-error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
      {/* Left Side */}
      <div className="hidden lg:flex w-5/12 bg-indigo-600 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
        <div className="relative z-10 flex items-center gap-2 text-white">
          <Building2 size={32} />
          <span className="text-2xl font-black tracking-tight">Rentify</span>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-white mb-6 leading-tight">Join the Future of<br/>Real Estate.</h1>
          <p className="text-indigo-100 text-lg">Create your account to start managing, renting, or servicing properties with ease.</p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-8 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-xl">
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className={`text-xs font-bold ${step >= 1 ? 'text-indigo-600' : 'text-slate-400'}`}>Personal Info</span>
              <span className={`text-xs font-bold ${step >= 2 ? 'text-indigo-600' : 'text-slate-400'}`}>Details</span>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div className={`h-full bg-indigo-600 transition-all duration-300 ${step === 1 ? 'w-1/2' : 'w-full'}`}></div>
            </div>
            {/* Show detected role */}
            <div className="mt-3 flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <CheckCircle2 size={14} />
              Signing up as: {detectedRoleLabel}
            </div>
          </div>

          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">
            {step === 1 ? 'Create Account' : 'Final Details'}
          </h2>

          <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="space-y-5">
            
            {step === 1 && (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className={`w-full px-4 py-2.5 bg-white dark:bg-slate-800 border rounded-xl text-sm focus:ring-2 outline-none transition-all ${errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'} dark:text-white`}
                      placeholder="e.g. Amit Kumar"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className={`w-full px-4 py-2.5 bg-white dark:bg-slate-800 border rounded-xl text-sm focus:ring-2 outline-none transition-all ${errors.phone ? 'border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'} dark:text-white`}
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={`w-full px-4 py-2.5 bg-white dark:bg-slate-800 border rounded-xl text-sm focus:ring-2 outline-none transition-all ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'} dark:text-white`}
                    placeholder="name@example.com"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between items-end mb-1.5">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                      <button 
                        type="button" 
                        onClick={generatePassword}
                        className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
                      >
                        <Wand2 size={12} /> Auto-generate
                      </button>
                    </div>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className={`w-full px-4 py-2.5 bg-white dark:bg-slate-800 border rounded-xl text-sm focus:ring-2 outline-none transition-all ${errors.password ? 'border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'} dark:text-white`}
                      placeholder="••••••••"
                    />
                    {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Confirm Password</label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className={`w-full px-4 py-2.5 bg-white dark:bg-slate-800 border rounded-xl text-sm focus:ring-2 outline-none transition-all ${errors.confirmPassword ? 'border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'} dark:text-white`}
                      placeholder="••••••••"
                    />
                    {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>
            )}



            {step === 2 && (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                {/* Other roles mock fields for UI completeness */}
                {formData.role === 'SERVICE' && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Primary Service</label>
                    <select className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:border-indigo-500 outline-none dark:text-white">
                      <option>Plumbing</option><option>Electrical</option><option>HVAC</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            <div className="pt-4 flex gap-3">
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                } text-white`}
              >
                {step < 2 ? (
                  <>Continue <ArrowRight size={16} /></>
                ) : loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Signing up...
                  </span>
                ) : (
                  'Complete Signup'
                )}
              </button>
            </div>
            
            {step === 1 && (
              <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-500">Sign In</Link>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
