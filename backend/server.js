require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const http = require('http');

// Import routes
const authRoutes = require('./routes/auth');
const componentRoutes = require('./routes/components');
const buildRoutes = require('./routes/builds');
const communityRoutes = require('./routes/community');
const performanceRoutes = require('./routes/performance');
const rgbRoutes = require('./routes/rgb');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pc-simulator', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('[v0] MongoDB connected'))
.catch(err => console.error('[v0] MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/components', componentRoutes);
app.use('/api/builds', buildRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/rgb', rgbRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Socket.io events
io.on('connection', (socket) => {
  console.log(`[v0] User connected: ${socket.id}`);
  
  socket.on('join-build', (buildId) => {
    socket.join(`build-${buildId}`);
    console.log(`[v0] User ${socket.id} joined build ${buildId}`);
  });
  
  socket.on('leave-build', (buildId) => {
    socket.leave(`build-${buildId}`);
  });
  
  socket.on('build-update', (buildId, data) => {
    io.to(`build-${buildId}`).emit('build-updated', data);
  });
  
  socket.on('disconnect', () => {
    console.log(`[v0] User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`[v0] Server running on port ${PORT}`);
});

module.exports = { app, io };
