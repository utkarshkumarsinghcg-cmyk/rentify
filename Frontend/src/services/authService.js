import api from './api';

/**
 * Authentication Service
 * Handles all API calls related to user authentication and session management.
 */
const authService = {
  /**
   * Login user with email and password
   */
  login: async (email, password, role) => {
    try {
      const response = await api.post('/auth/login', { email, password, role });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  },

  /**
   * Register a new user (Renter or Owner)
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Handle Google OAuth Login (ID token flow)
   */
  googleLogin: async (credential) => {
    const response = await api.post('/auth/google', { credential });
    return response.data;
  },

  /**
   * Handle Google OAuth Login (access token flow — custom button)
   */
  googleLoginWithInfo: async (userInfo) => {
    const response = await api.post('/auth/google', userInfo);
    return response.data;
  },

  /**
   * Request password reset link
   */
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token, newPassword) => {
    const response = await api.post(`/auth/reset-password/${token}`, { password: newPassword });
    return response.data;
  },

  /**
   * Send Email OTP
   */
  sendEmailOTP: async (email) => {
    const response = await api.post('/auth/email-otp/send', { email });
    return response.data;
  },

  /**
   * Verify Email OTP and login/register
   */
  verifyEmailOTP: async ({ email, otp, name, role }) => {
    const response = await api.post('/auth/email-otp/verify', { email, otp, name, role });
    return response.data;
  },

  /**
   * Check if daily phone SMS limit is reached
   */
  checkPhoneLimit: async () => {
    const response = await api.get('/auth/phone-otp/check-limit');
    return response.data;
  },

  /**
   * Increment daily phone SMS count
   */
  incrementPhoneLimit: async () => {
    const response = await api.post('/auth/phone-otp/increment-limit');
    return response.data;
  },

  /**
   * Login/Register with phone after Firebase verification
   */
  phoneLogin: async ({ phone, role, name }) => {
    const response = await api.post('/auth/phone-login', { phone, role, name });
    return response.data;
  },

  /**
   * Get current user profile (for session persistence)
   */
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  }
};

export default authService;
