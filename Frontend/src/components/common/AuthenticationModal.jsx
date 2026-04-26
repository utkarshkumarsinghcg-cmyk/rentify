import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { closeAuthModal, setAuthModalView } from '../../store/slices/uiSlice';
import { loginSuccess } from '../../store/slices/authSlice';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
import Input from './Input';
import Button from './Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import authService from '../../services/authService';

// ─── Shared Components ───────────────────────────────────────────────
const GoogleButton = ({ label, onClick }) => (
  <Button 
    type="button" 
    variant="outline" 
    className="w-full flex items-center justify-center gap-2 border-slate-200 hover:bg-slate-50 transition-all h-11 text-sm font-medium"
    onClick={onClick}
  >
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
    {label}
  </Button>
);

// ─── Login Form ──────────────────────────────────────────────────────
const LoginForm = ({ dispatch, navigate, location }) => {
  // Extract role from URL if present (e.g., /welcome/owner)
  const pathParts = location.pathname.split('/');
  const activeRole = pathParts.includes('welcome') ? pathParts[pathParts.indexOf('welcome') + 1] : null;

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await authService.login(values.email, values.password, activeRole);
        dispatch(loginSuccess({ user: response.user, token: response.token }));
        toast.success('Welcome back!');
        dispatch(closeAuthModal());
        navigate('/dashboard');
      } catch (error) {
        toast.error(error.message || 'Login failed.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="bg-white dark:bg-slate-900 p-8">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h2>
        <p className="text-slate-500 text-sm mt-1">Sign in to your account to continue</p>
      </div>
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          {...formik.getFieldProps('email')}
          error={formik.touched.email && formik.errors.email}
        />
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
            <button type="button" onClick={() => dispatch(setAuthModalView('reset'))} className="text-xs text-blue-600 hover:underline">Forgot?</button>
          </div>
          <Input
            type="password"
            placeholder="••••••••"
            {...formik.getFieldProps('password')}
            error={formik.touched.password && formik.errors.password}
          />
        </div>
        <Button type="submit" className="w-full h-11" isLoading={formik.isSubmitting}>Sign In</Button>
        
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase">Or</span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        <GoogleButton label="Continue with Google" onClick={() => {}} />

        <p className="text-center text-sm text-slate-500 pt-2">
          Don't have an account? <button type="button" onClick={() => dispatch(setAuthModalView('signup'))} className="text-blue-600 font-semibold hover:underline">Sign up</button>
        </p>
      </form>
    </div>
  );
};

// ─── Signup Form ─────────────────────────────────────────────────────
const SignupForm = ({ dispatch, navigate, location }) => {
  let defaultRole = 'renter';
  if (location && location.pathname.startsWith('/welcome/')) {
    defaultRole = location.pathname.split('/')[2];
  }

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', role: defaultRole },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().min(6, 'Min 6 chars').required('Required'),
      role: Yup.string().required('Required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await authService.register(values);
        dispatch(loginSuccess({ user: response.user, token: response.token }));
        toast.success('Account created!');
        dispatch(closeAuthModal());
        navigate('/dashboard');
      } catch (error) {
        toast.error(error.message || 'Signup failed.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="bg-white dark:bg-slate-900 p-8">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Account</h2>
        <p className="text-slate-500 text-sm mt-1">Join Rentify today</p>
      </div>
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <Input
          label="Full Name"
          placeholder="John Doe"
          {...formik.getFieldProps('name')}
          error={formik.touched.name && formik.errors.name}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          {...formik.getFieldProps('email')}
          error={formik.touched.email && formik.errors.email}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          {...formik.getFieldProps('password')}
          error={formik.touched.password && formik.errors.password}
        />
        
        <Button type="submit" className="w-full h-11" isLoading={formik.isSubmitting}>Create Account</Button>

        <p className="text-center text-sm text-slate-500 pt-2">
          Already have an account? <button type="button" onClick={() => dispatch(setAuthModalView('login'))} className="text-blue-600 font-semibold hover:underline">Sign in</button>
        </p>
      </form>
    </div>
  );
};

// ─── Reset Form ──────────────────────────────────────────────────────
const ResetForm = ({ dispatch }) => {
  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: Yup.object({ email: Yup.string().email('Invalid email').required('Required') }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await new Promise(r => setTimeout(r, 800));
        toast.success('Reset link sent!');
        dispatch(setAuthModalView('login'));
      } catch {
        toast.error('Failed.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="bg-white dark:bg-slate-900 p-8">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Reset Password</h2>
        <p className="text-slate-500 text-sm mt-1">We'll help you get back in</p>
      </div>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <Input
          label="Email Address"
          placeholder="name@example.com"
          {...formik.getFieldProps('email')}
          error={formik.touched.email && formik.errors.email}
        />
        <div className="space-y-4">
          <Button type="submit" className="w-full h-11" isLoading={formik.isSubmitting}>Send Reset Link</Button>
          <button type="button" onClick={() => dispatch(setAuthModalView('login'))} className="w-full text-sm text-slate-500 hover:text-blue-600 transition-colors">← Back to Login</button>
        </div>
      </form>
    </div>
  );
};

// ─── Main Modal Shell ─────────────────────────────────────────────────
const AuthenticationModal = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthModalOpen, authModalView } = useSelector((state) => state.ui);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') dispatch(closeAuthModal());
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [dispatch]);

  if (!isAuthModalOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) dispatch(closeAuthModal());
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4" onClick={handleBackdropClick}>
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => dispatch(closeAuthModal())}
          className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        {/* Content */}
        <div className="max-h-[90vh] overflow-y-auto custom-scrollbar">
          {authModalView === 'login'  && <LoginForm  dispatch={dispatch} navigate={navigate} location={location} />}
          {authModalView === 'signup' && <SignupForm  dispatch={dispatch} navigate={navigate} location={location} />}
          {authModalView === 'reset'  && <ResetForm   dispatch={dispatch} />}
        </div>
      </div>
    </div>
  );
};

export default AuthenticationModal;
