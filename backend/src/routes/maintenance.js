const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, maintenanceController.getTickets);
router.post('/', authenticate, maintenanceController.createTicket);
router.patch('/:id', authenticate, maintenanceController.updateTicketStatus);

module.exports = router;
