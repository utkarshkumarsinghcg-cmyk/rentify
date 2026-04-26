import api from './api';

/**
 * Chat Service
 * Handles communication between users and admins/managers.
 */
const chatService = {
  /**
   * Send a message to another user
   */
  sendMessage: async (receiverId, text) => {
    const response = await api.post('/chat/send', { receiverId, text });
    return response.data;
  },

  /**
   * Get all conversations for admin/manager
   */
  getConversations: async () => {
    const response = await api.get('/chat/conversations');
    return response.data;
  },

  /**
   * Get messages for a specific conversation
   */
  getConversation: async (otherUserId) => {
    const response = await api.get(`/chat/conversation/${otherUserId}`);
    return response.data;
  },

  /**
   * Mark messages as read
   */
  markAsRead: async (senderId) => {
    const response = await api.patch(`/chat/read/${senderId}`);
    return response.data;
  }
};

export default chatService;
