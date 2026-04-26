const mongoose = require('mongoose');

const leaseSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  renter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  rentAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['ACTIVE', 'EXPIRED', 'TERMINATED'], 
    default: 'ACTIVE' 
  },
}, { timestamps: true });

module.exports = mongoose.model('Lease', leaseSchema);
