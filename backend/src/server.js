require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const { Server } = require('socket.io');
const { errorHandler } = require('./middleware/errorHandler');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const leaseRoutes = require('./routes/leases');
const maintenanceRoutes = require('./routes/maintenance');
const userRoutes = require('./routes/users');
const dashboardRoutes = require('./routes/dashboard');
const chatRoutes = require('./routes/chat');
const inspectionRoutes = require('./routes/inspections');
const workflowRoutes = require('./routes/workflow');

const { initWhatsApp } = require('./services/whatsappService');

// Connect to Database
connectDB();
// Initialize WhatsApp Bot
initWhatsApp();

const app = express();
const httpServer = http.createServer(app);

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_URL || 'http://localhost:5173';

// ── Dynamic CORS origin list ─────────────────────────────────
const allowedOrigins = [
  CLIENT_ORIGIN,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
].filter(Boolean);

// Accept any *.vercel.app or *.onrender.com domain automatically
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.onrender.com')
    ) {
      return callback(null, true);
    }
    console.warn(`[CORS] Blocked request from origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};

// ── Socket.io setup ──────────────────────────────────────────
const io = new Server(httpServer, { cors: corsOptions });

// Attach io to app so controllers can access it
app.set('io', io);

io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  // Each user joins a personal room identified by their userId
  socket.on('join', (userId) => {
    if (userId) {
      socket.join(userId);
      console.log(`[Socket] User ${userId} joined room`);
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});
// ─────────────────────────────────────────────────────────────

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/leases', leaseRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/workflow', workflowRoutes);

app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    dbHost: mongoose.connection.host || 'unknown',
    env: process.env.NODE_ENV || 'development'
  });
});

app.use(errorHandler);

// ─────────────────────────────────────────────────────────────
// Error handling for port conflict
httpServer.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please kill the process or wait a few seconds.`);
  } else {
    console.error('❌ Server error:', e);
  }
});

httpServer.listen(PORT, () => console.log(`Rentify API running on port ${PORT} with Socket.io`));

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  httpServer.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

