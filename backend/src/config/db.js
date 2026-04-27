const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const dbUrl = process.env.DATABASE_URL || process.env.MONGO_URI;
    if (!dbUrl) {
      throw new Error('DATABASE_URL or MONGO_URI must be defined in environment variables');
    }
    const conn = await mongoose.connect(dbUrl);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
