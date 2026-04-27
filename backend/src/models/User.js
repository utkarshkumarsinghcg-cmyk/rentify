const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['RENTER', 'OWNER', 'INSPECTOR', 'SERVICE', 'ADMIN'], 
    default: 'RENTER' 
  },
  phone: { type: String },
  rating: { type: Number, default: 4.5 },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
