const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', propertyController.getProperties);
router.get('/:id', propertyController.getPropertyById);

// Protected routes (require auth)
router.post('/', authenticate, authorize('OWNER'), propertyController.createProperty);
router.put('/:id', authenticate, authorize('OWNER'), propertyController.updateProperty);
router.delete('/:id', authenticate, authorize('OWNER'), propertyController.deleteProperty);

module.exports = router;
