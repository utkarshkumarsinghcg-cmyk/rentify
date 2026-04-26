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

// Connect to Database
connectDB();

const app = express();
const httpServer = http.createServer(app);

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_URL || 'http://localhost:5173';

// ── Socket.io setup ──────────────────────────────────────────
const io = new Server(httpServer, {
  cors: { origin: true, credentials: true }
});

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
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/leases', leaseRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/inspections', inspectionRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use(errorHandler);

httpServer.listen(PORT, () => console.log(`Rentify API running on port ${PORT} with Socket.io`));
