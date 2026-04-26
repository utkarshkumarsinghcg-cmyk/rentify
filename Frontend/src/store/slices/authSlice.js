import { createSlice } from '@reduxjs/toolkit';
import { setStorage, getStorage, removeStorage } from '../../utils/storage';

const initialState = {
  user: getStorage('user') || null,
  token: getStorage('auth_token') || null,
  isAuthenticated: !!getStorage('auth_token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      setStorage('user', action.payload.user);
      setStorage('auth_token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      removeStorage('user');
      removeStorage('auth_token');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
