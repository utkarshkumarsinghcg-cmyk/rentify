const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticate } = require('../middleware/auth');

router.post('/send', authenticate, chatController.sendMessage);
router.get('/conversations', authenticate, chatController.getAdminConversations);
router.get('/conversation/:otherUserId', authenticate, chatController.getConversation);
router.patch('/read/:senderId', authenticate, chatController.markAsRead);

module.exports = router;
