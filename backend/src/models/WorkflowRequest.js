const mongoose = require('mongoose');

const workflowRequestSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['LEASE_APPROVAL', 'TOUR_REQUEST'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'ADMIN_REVIEWED', 'DETAILS_SENT', 'CONFIRMED', 'ASSIGNED', 'REJECTED'], 
    default: 'PENDING' 
  },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Owner for LEASE_APPROVAL, Renter for TOUR_REQUEST
  assignedInspector: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('WorkflowRequest', workflowRequestSchema);
