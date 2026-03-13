// backend/src/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss');
const { createServer } = require('http');
const { Server } = require('socket.io');
const redis = require('redis');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const toolsRoutes = require('./routes/toolsRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { logger } = require('./middleware/logger');

// Initialize Express app
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }
});

// Redis client for caching
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.connect().then(() => {
  logger.info('✅ Redis connected');
}).catch(err => {
  logger.error('❌ Redis connection failed:', err);
});

// ==================== Security Middleware ====================
app.use(helmet({
  contentSecurityPolicy: false,
}));

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Compression
app.use(compression());

// Logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// ==================== Database Connection ====================
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  logger.info('✅ MongoDB connected successfully');
})
.catch(err => {
  logger.error('❌ MongoDB connection failed:', err);
  process.exit(1);
});

// ==================== Routes ====================
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '10.0.0'
  });
});

// ==================== WebSocket for real-time chat ====================
io.on('connection', (socket) => {
  logger.info(`🟢 Client connected: ${socket.id}`);

  socket.on('join-conversation', (conversationId) => {
    socket.join(conversationId);
    logger.info(`Client ${socket.id} joined conversation: ${conversationId}`);
  });

  socket.on('leave-conversation', (conversationId) => {
    socket.leave(conversationId);
    logger.info(`Client ${socket.id} left conversation: ${conversationId}`);
  });

  socket.on('send-message', async (data) => {
    try {
      // Broadcast message to all clients in the conversation
      io.to(data.conversationId).emit('new-message', data.message);
    } catch (error) {
      logger.error('WebSocket error:', error);
    }
  });

  socket.on('disconnect', () => {
    logger.info(`🔴 Client disconnected: ${socket.id}`);
  });
});

// ==================== Error Handling ====================
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested resource does not exist'
  });
});

// ==================== Start Server ====================
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  logger.info(`🚀 OMNIA AI Server running on port ${PORT}`);
  logger.info(`📱 Developer: Omar Abdo - 01289411976`);
  logger.info(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  httpServer.close(() => {
    logger.info('HTTP server closed');
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = { app, io, redisClient };
