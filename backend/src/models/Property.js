const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Property title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Property description is required']
    },
    type: {
        type: String,
        enum: ['apartment', 'house', 'studio', 'villa', 'condo'],
        required: true
    },
    location: {
        address: String,
        city: String,
        state: String,
        zipCode: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    amenities: [String],
    images: [String],
    bedrooms: Number,
    bathrooms: Number,
    area: Number, // in sq ft
    status: {
        type: String,
        enum: ['available', 'rented', 'maintenance'],
        default: 'available'
    },
    features: {
        petFriendly: Boolean,
        furnished: Boolean,
        parking: Boolean,
        gym: Boolean,
        pool: Boolean
    }
}, {
    timestamps: true
});

// Index for search
propertySchema.index({ title: 'text', description: 'text', 'location.city': 'text' });

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
