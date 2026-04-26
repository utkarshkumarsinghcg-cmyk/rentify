const mongoose = require('mongoose');

const maintenanceTicketSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  renter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED'], 
    default: 'OPEN' 
  },
  category: { 
    type: String, 
    enum: ['Maintenance', 'Financial Review', 'Lease Renewal', 'Property Inspection', 'Other'], 
    default: 'Maintenance' 
  },
  priority: { 
    type: String, 
    enum: ['LOW', 'MEDIUM', 'HIGH'], 
    default: 'MEDIUM' 
  },
}, { timestamps: true });

module.exports = mongoose.model('MaintenanceTicket', maintenanceTicketSchema);
