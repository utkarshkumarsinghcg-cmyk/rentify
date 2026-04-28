const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String },
  role: { 
    type: String, 
    enum: ['RENTER', 'OWNER', 'INSPECTOR', 'SERVICE', 'ADMIN'], 
    default: 'RENTER' 
  },
  phone: { type: String },
  rating: { type: Number, default: 4.5 },
  authProvider: { type: String, enum: ['local', 'google', 'email-otp', 'phone'], default: 'local' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
