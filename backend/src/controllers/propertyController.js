const Property = require('../models/Property');

exports.createProperty = async (req, res) => {
    try {
        const property = await Property.create({
            ...req.body,
            owner: req.user.id
        });
        res.status(201).json({
            status: 'success',
            data: { property }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find().populate('owner', 'firstName lastName email');
        res.status(200).json({
            status: 'success',
            results: properties.length,
            data: { properties }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.getAIRecommendations = async (req, res) => {
    try {
        // In a real scenario, this would use a machine learning model or LLM
        // We'll simulate this by matching user preferences with property features
        const { preferences } = req.body; // e.g., { city: 'New York', maxPrice: 3000, pets: true }
        
        let query = { status: 'available' };
        
        if (preferences.city) query['location.city'] = new RegExp(preferences.city, 'i');
        if (preferences.maxPrice) query.price = { $lte: preferences.maxPrice };
        if (preferences.pets) query['features.petFriendly'] = true;

        const properties = await Property.find(query).limit(5);

        // Add a mock "Match Score"
        const recommendations = properties.map(p => ({
            ...p.toObject(),
            matchScore: Math.floor(Math.random() * (100 - 85 + 1) + 85) // Random score between 85-100
        })).sort((a, b) => b.matchScore - a.matchScore);

        res.status(200).json({
            status: 'success',
            data: { recommendations }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};
