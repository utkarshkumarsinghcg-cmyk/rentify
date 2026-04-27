import api from './api';

const workflowService = {
  createRequest: async (type, propertyId, notes) => {
    const response = await api.post('/workflow', { type, propertyId, notes });
    return response.data;
  },

  getAdminRequests: async () => {
    const response = await api.get('/workflow/admin');
    return response.data;
  },

  updateRequest: async (id, data) => {
    const response = await api.patch(`/workflow/${id}`, data);
    return response.data;
  }
};

export default workflowService;
