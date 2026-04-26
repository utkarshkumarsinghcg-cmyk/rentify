import api from './api';

const maintenanceService = {
  createTicket: async (ticketData) => {
    const response = await api.post('/maintenance', ticketData);
    return response.data;
  },
  
  getTickets: async () => {
    const response = await api.get('/maintenance');
    return response.data;
  },
  
  updateStatus: async (id, statusData) => {
    const response = await api.patch(`/maintenance/${id}`, statusData);
    return response.data;
  },
  
  getAllTickets: async () => {
    const response = await api.get('/maintenance');
    return response.data;
  },
  
  assignProvider: async (ticketId, providerId) => {
    const response = await api.patch(`/maintenance/${ticketId}`, { assignedTo: providerId });
    return response.data;
  }
};

export default maintenanceService;
