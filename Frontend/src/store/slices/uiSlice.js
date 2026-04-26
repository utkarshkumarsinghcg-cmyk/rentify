import { createSlice } from '@reduxjs/toolkit';
import { getStorage, setStorage } from '../../utils/storage';

const initialState = {
  theme: getStorage('theme') || 'light',
  isLoading: false,
  isAuthModalOpen: false,
  authModalView: 'login', // 'login', 'signup', 'reset'
  isSurveyModalOpen: false,
  isSettingsModalOpen: false,
  isReceiptModalOpen: false,
  selectedPayment: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      setStorage('theme', state.theme);
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    openAuthModal: (state, action) => {
      state.isAuthModalOpen = true;
      state.authModalView = action.payload || 'login';
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },
    setAuthModalView: (state, action) => {
      state.authModalView = action.payload;
    },
    openSurveyModal: (state) => {
      state.isSurveyModalOpen = true;
    },
    closeSurveyModal: (state) => {
      state.isSurveyModalOpen = false;
    },
    openSettingsModal: (state) => {
      state.isSettingsModalOpen = true;
    },
    closeSettingsModal: (state) => {
      state.isSettingsModalOpen = false;
    },
    openReceiptModal: (state, action) => {
      state.isReceiptModalOpen = true;
      state.selectedPayment = action.payload;
    },
    closeReceiptModal: (state) => {
      state.isReceiptModalOpen = false;
      state.selectedPayment = null;
    },
  },
});

export const { 
  toggleTheme, 
  setLoading, 
  openAuthModal, 
  closeAuthModal, 
  setAuthModalView,
  openSurveyModal,
  closeSurveyModal,
  openSettingsModal,
  closeSettingsModal,
  openReceiptModal,
  closeReceiptModal
} = uiSlice.actions;
export default uiSlice.reducer;
