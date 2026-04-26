import axios from 'axios';
import { getStorage } from '../utils/storage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = getStorage('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors here (e.g., 401 Unauthorized)
    if (error.response?.status === 401) {
      const originalRequest = error.config;
      // Do not redirect on 401 if the user is currently trying to log in
      if (originalRequest && !originalRequest.url.includes('/auth/login')) {
        console.error('Unauthorized access - invalid token. Clearing session.');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('rentify_user_role');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
