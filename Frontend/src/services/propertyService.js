import api from './api';

/**
 * Property Service
 * Handles all API calls related to property management and search.
 */
const propertyService = {
  /**
   * Fetch all properties with optional filters
   */
  getProperties: async (filters = {}) => {
    const response = await api.get('/properties', { params: filters });
    return response.data;
  },

  /**
   * Get single property details by ID
   */
  getPropertyById: async (id) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  /**
   * Create a new property listing (Owner only)
   */
  createProperty: async (propertyData) => {
    const response = await api.post('/properties', propertyData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  /**
   * Update existing property (Owner only)
   */
  updateProperty: async (id, updateData) => {
    const response = await api.put(`/properties/${id}`, updateData);
    return response.data;
  },

  /**
   * Delete property (Owner only)
   */
  deleteProperty: async (id) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },

  /**
   * Get recommended properties for a user
   */
  getRecommendations: async () => {
    const response = await api.get('/properties/recommendations');
    return response.data;
  },

  /**
   * Get Owner Dashboard Stats
   */
  getOwnerDashboard: async () => {
    const response = await api.get('/dashboard/owner');
    return response.data;
  },

  /**
   * Get Renter Dashboard Stats
   */
  getRenterDashboard: async () => {
    const response = await api.get('/dashboard/renter');
    return response.data;
  },

  /**
   * Get Service Dashboard Stats
   */
  getServiceDashboard: async () => {
    const response = await api.get('/dashboard/service');
    return response.data;
  },

  /**
   * Get Inspector Dashboard Stats
   */
  getInspectorDashboard: async () => {
    const response = await api.get('/dashboard/inspector');
    return response.data;
  },

  /**
   * Get Admin Dashboard Stats
   */
  getAdminDashboard: async () => {
    const response = await api.get('/dashboard/admin');
    return response.data;
  }
};

export default propertyService;
