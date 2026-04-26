import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import propertyReducer from './slices/propertySlice';
import maintenanceReducer from './slices/maintenanceSlice';
import messagesReducer from './slices/messagesSlice';
import notificationsReducer from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    property: propertyReducer,
    maintenance: maintenanceReducer,
    messages: messagesReducer,
    notifications: notificationsReducer,
  },
});
