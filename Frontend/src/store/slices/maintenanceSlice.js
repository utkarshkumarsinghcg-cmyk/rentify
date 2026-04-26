import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tickets: [],
  filter: 'All', // 'All' | 'Pending' | 'In Progress' | 'Completed'
};

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {
    setTickets: (state, action) => {
      state.tickets = action.payload;
    },
    addTicket: (state, action) => {
      state.tickets.unshift(action.payload);
    },
    updateTicket: (state, action) => {
      const idx = state.tickets.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) state.tickets[idx] = { ...state.tickets[idx], ...action.payload };
    },
    removeTicket: (state, action) => {
      state.tickets = state.tickets.filter(t => t.id !== action.payload);
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
});

export const { setTickets, addTicket, updateTicket, removeTicket, setFilter } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;
