// backend/src/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const { redisClient } = require('../server');

// Helper to get IP
const getIP = (req) => {
  return req.ip || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         'unknown';
};

// General API limiter
const apiLimiter = rateLimit({
  store: redisClient ? new RedisStore({
    client: redisClient,
    prefix: 'rl:api:'
  }) : undefined,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    error: 'Too many requests',
    message: 'لقد تجاوزت الحد المسموح من الطلبات، حاول بعد 15 دقيقة'
  },
  keyGenerator: getIP,
  standardHeaders: true,
  legacyHeaders: false
});

// Auth limiter (stricter)
const authLimiter = rateLimit({
  store: redisClient ? new RedisStore({
    client: redisClient,
    prefix: 'rl:auth:'
  }) : undefined,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: {
    error: 'Too many attempts',
    message: 'محاولات كثيرة جداً، حاول بعد 15 دقيقة'
  },
  keyGenerator: getIP,
  skipSuccessfulRequests: true
});

// Chat limiter
const chatLimiter = rateLimit({
  store: redisClient ? new RedisStore({
    client: redisClient,
    prefix: 'rl:chat:'
  }) : undefined,
  windowMs: 60 * 1000, // 1 minute
  max: (req) => {
    // Different limits based on user plan
    const plan = req.user?.plan || 'free';
    const limits = {
      free: 10,    // 10 messages per minute
      pro: 60,     // 60 messages per minute
      enterprise: 200 // 200 messages per minute
    };
    return limits[plan] || 10;
  },
  message: {
    error: 'Rate limit exceeded',
    message: 'لقد استهلكت حدك اليومي، حاول بعد دقيقة'
  },
  keyGenerator: (req) => req.user?.id || getIP(req)
});

// Tools limiter
const toolsLimiter = rateLimit({
  store: redisClient ? new RedisStore({
    client: redisClient,
    prefix: 'rl:tools:'
  }) : undefined,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: (req) => {
    const plan = req.user?.plan || 'free';
    const limits = {
      free: 20,    // 20 tools per hour
      pro: 100,    // 100 tools per hour
      enterprise: 500 // 500 tools per hour
    };
    return limits[plan] || 20;
  },
  message: {
    error: 'Rate limit exceeded',
    message: 'لقد استهلكت حدك اليومي من الأدوات'
  },
  keyGenerator: (req) => req.user?.id || getIP(req)
});

module.exports = {
  api: apiLimiter,
  auth: authLimiter,
  chat: chatLimiter,
  tools: toolsLimiter
};
