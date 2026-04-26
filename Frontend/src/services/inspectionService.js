import api from './api';

const inspectionService = {
  getInspections: async () => {
    const response = await api.get('/inspections');
    return response.data;
  },
  
  createInspection: async (data) => {
    const response = await api.post('/inspections', data);
    return response.data;
  },
  
  updateInspection: async (id, data) => {
    const response = await api.patch(`/inspections/${id}`, data);
    return response.data;
  }
};

export default inspectionService;
