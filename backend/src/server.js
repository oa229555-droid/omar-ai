const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const dotenv = require('dotenv')
const { createServer } = require('http')
const { Server } = require('socket.io')
const redis = require('redis')

dotenv.config()

// Import routes
const authRoutes = require('./routes/authRoutes')
const chatRoutes = require('./routes/chatRoutes')
const toolsRoutes = require('./routes/toolsRoutes')
const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes')

// Import middleware
const { errorHandler } = require('./middleware/errorHandler')
const { logger } = require('./middleware/logger')

// Initialize Express
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }
})

// Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
})

redisClient.connect().then(() => {
  logger.info('✅ Redis connected')
}).catch(err => {
  logger.error('❌ Redis connection failed:', err)
})

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests' }
})
app.use('/api/', limiter)

// Body parsing
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(mongoSanitize())
app.use(compression())

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  logger.info('✅ MongoDB connected')
}).catch(err => {
  logger.error('❌ MongoDB connection failed:', err)
  process.exit(1)
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/tools', toolsRoutes)
app.use('/api/user', userRoutes)
app.use('/api/admin', adminRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '10.0.0'
  })
})

// WebSocket
io.on('connection', (socket) => {
  logger.info(`🟢 Client connected: ${socket.id}`)

  socket.on('join-conversation', (conversationId) => {
    socket.join(conversationId)
  })

  socket.on('send-message', (data) => {
    io.to(data.conversationId).emit('new-message', data.message)
  })

  socket.on('disconnect', () => {
    logger.info(`🔴 Client disconnected: ${socket.id}`)
  })
})

// Error handling
app.use(errorHandler)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not found' })
})

// Start server
const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`)
  logger.info(`📱 Developer: Omar Abdo - 01289411976`)
})

module.exports = { app, io, redisClient }
