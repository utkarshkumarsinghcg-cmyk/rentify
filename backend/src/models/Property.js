const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  rent: { type: Number, required: true },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  type: { 
    type: String, 
    enum: ['APARTMENT', 'HOUSE', 'STUDIO', 'VILLA'], 
    default: 'APARTMENT' 
  },
  isAvailable: { type: Boolean, default: true },
  status: { 
    type: String, 
    enum: ['AVAILABLE', 'PENDING_INSPECTION', 'INSPECTED', 'BOOKED'], 
    default: 'AVAILABLE' 
  },
  pincode: { type: String },
  addressDetails: { type: String },
  amenities: [{ type: String }],
  images: [{ type: String }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
