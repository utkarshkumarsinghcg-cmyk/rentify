const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);


// Basic route
app.get('/', (req, res) => {
    res.send('Rentify API is running...');
});

// MongoDB Connection
const DB = process.env.DATABASE_URL;

mongoose.connect(DB)
    .then(() => console.log('DB connection successful!'))
    .catch(err => console.log('DB connection error:', err));

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
