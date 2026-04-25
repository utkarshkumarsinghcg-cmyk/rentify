const express = require('express');
const propertyController = require('../controllers/propertyController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', propertyController.getAllProperties);
router.post('/ai-recommendations', propertyController.getAIRecommendations);

// Only owners and admins can create properties
router.post('/', protect, restrictTo('owner', 'admin'), propertyController.createProperty);

module.exports = router;
