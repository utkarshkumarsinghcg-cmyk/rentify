import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  threads: {}, // { [contactId]: [{ id, sender, text, time }] }
  unreadCount: 2,
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    initThread: (state, action) => {
      const { contactId, messages } = action.payload;
      if (!state.threads[contactId]) state.threads[contactId] = messages;
    },
    sendMessage: (state, action) => {
      const { contactId, message } = action.payload;
      if (!state.threads[contactId]) state.threads[contactId] = [];
      state.threads[contactId].push(message);
    },
    receiveMessage: (state, action) => {
      const { contactId, message } = action.payload;
      if (!state.threads[contactId]) state.threads[contactId] = [];
      state.threads[contactId].push(message);
      state.unreadCount += 1;
    },
    markMessagesRead: (state) => {
      state.unreadCount = 0;
    },
  },
});

export const { initThread, sendMessage, receiveMessage, markMessagesRead } = messagesSlice.actions;
export default messagesSlice.reducer;
