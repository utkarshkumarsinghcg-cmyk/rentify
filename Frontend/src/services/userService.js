import api from './api';

const userService = {
  getServiceProviders: async () => {
    const response = await api.get('/users/service-providers');
    return response.data;
  },
  
  getInspectors: async () => {
    const response = await api.get('/users/inspectors');
    return response.data;
  },
  
  getUserProfile: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  }
};

export default userService;
