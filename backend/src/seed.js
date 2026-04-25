const mongoose = require('mongoose');
const Property = require('./models/Property');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedProperties = [
    {
        title: "Modern Glass Villa with Infinity Pool",
        description: "A stunning architectural masterpiece with floor-to-ceiling windows and breathtaking views.",
        type: "villa",
        price: 4500,
        location: {
            address: "123 Beverly Hills",
            city: "Los Angeles",
            state: "CA",
            zipCode: "90210"
        },
        amenities: ["Pool", "Gym", "Smart Home", "Theater"],
        images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80"],
        bedrooms: 5,
        bathrooms: 4,
        area: 4200,
        features: { pool: true, gym: true, furnished: true }
    },
    {
        title: "Urban Loft in the Heart of Soho",
        description: "Industrial chic loft with high ceilings, exposed brick, and modern smart amenities.",
        type: "apartment",
        price: 3200,
        location: {
            address: "45 Broadway",
            city: "New York",
            state: "NY",
            zipCode: "10012"
        },
        amenities: ["Elevator", "Rooftop Access", "Smart Lock"],
        images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80"],
        bedrooms: 2,
        bathrooms: 2,
        area: 1500,
        features: { parking: true, petFriendly: true }
    },
    {
        title: "Cozy Smart Studio with Garden",
        description: "Perfect for digital nomads, this studio features automated lighting and climate control.",
        type: "studio",
        price: 1800,
        location: {
            address: "88 Maple St",
            city: "Seattle",
            state: "WA",
            zipCode: "98101"
        },
        amenities: ["Garden", "Fast Wi-Fi", "Keyless Entry"],
        images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"],
        bedrooms: 1,
        bathrooms: 1,
        area: 600,
        features: { petFriendly: true, furnished: true }
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Connected to DB for seeding...");

        // Get a user to act as owner (or create one)
        let owner = await User.findOne({ role: 'owner' });
        if (!owner) {
            owner = await User.create({
                firstName: "Global",
                lastName: "Owner",
                email: "owner@rentify.com",
                password: "password123",
                role: "owner"
            });
        }

        await Property.deleteMany({});
        const properties = seedProperties.map(p => ({ ...p, owner: owner._id }));
        await Property.insertMany(properties);

        console.log("Database Seeded successfully!");
        process.exit();
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
};

seedDB();
