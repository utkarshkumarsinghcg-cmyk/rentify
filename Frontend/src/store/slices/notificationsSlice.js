import { createSlice } from '@reduxjs/toolkit';

const initialNotifications = [
  { id: 'n1', title: 'Kitchen Sink Leak reported', desc: 'DLF Capital Greens — new maintenance ticket opened.', time: '2h ago', read: false, icon: 'wrench' },
  { id: 'n2', title: 'New tenant inquiry', desc: 'Riverside Court 2BHK has a new prospective tenant enquiry.', time: '5h ago', read: false, icon: 'user' },
  { id: 'n3', title: 'Lease renewal due', desc: 'Skyline Lofts #402 — lease expires in 30 days.', time: '1d ago', read: false, icon: 'file' },
];

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: initialNotifications,
    unreadCount: initialNotifications.filter(n => !n.read).length,
  },
  reducers: {
    markAllRead: (state) => {
      state.items = state.items.map(n => ({ ...n, read: true }));
      state.unreadCount = 0;
    },
    markRead: (state, action) => {
      const n = state.items.find(n => n.id === action.payload);
      if (n && !n.read) { n.read = true; state.unreadCount = Math.max(0, state.unreadCount - 1); }
    },
    addNotification: (state, action) => {
      state.items.unshift({ ...action.payload, read: false });
      state.unreadCount += 1;
    },
  },
});

export const { markAllRead, markRead, addNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
