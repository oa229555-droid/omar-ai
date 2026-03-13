// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { logger } = require('./logger');

exports.auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id).select('-password -apiKeys');
    
    if (!user || !user.isActive) {
      throw new Error();
    }

    // Attach user to request
    req.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      plan: user.plan
    };
    
    next();
  } catch (error) {
    logger.error('Authentication failed:', error);
    res.status(401).json({
      error: 'Authentication required',
      message: 'الرجاء تسجيل الدخول أولاً'
    });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Access denied',
      message: 'هذه الصفحة مخصصة للمشرفين فقط'
    });
  }
  next();
};

exports.planRequired = (plan) => {
  return (req, res, next) => {
    const plans = {
      'pro': ['pro', 'enterprise'],
      'enterprise': ['enterprise']
    };

    if (!plans[plan]?.includes(req.user.plan)) {
      return res.status(403).json({
        error: 'Plan required',
        message: `هذه الميزة متاحة فقط للمشتركين في خطة ${plan}`,
        requiredPlan: plan
      });
    }
    next();
  };
};
