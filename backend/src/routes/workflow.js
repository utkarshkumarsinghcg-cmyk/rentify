const express = require('express');
const router = express.Router();
const { createRequest, getAdminRequests, updateRequestStatus } = require('../controllers/workflowController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.post('/', createRequest);
router.get('/admin', authorize('ADMIN', 'INSPECTOR'), getAdminRequests);
router.patch('/:id', authorize('ADMIN', 'INSPECTOR'), updateRequestStatus);

module.exports = router;
