// backend/src/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const { logger } = require('../middleware/logger');
const { sendEmail } = require('../utils/email');
const { redisClient } = require('../server');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, fullName } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        message: 'البريد الإلكتروني أو اسم المستخدم موجود بالفعل'
      });
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      fullName,
      verificationToken,
      loginHistory: [{
        ip: req.ip,
        userAgent: req.get('user-agent')
      }]
    });

    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    await sendEmail({
      to: email,
      subject: 'تفعيل حسابك في OMNIA AI',
      html: `
        <h1>مرحباً ${username}!</h1>
        <p>شكراً لتسجيلك في OMNIA AI</p>
        <p>لتفعيل حسابك، الرجاء النقر على الرابط التالي:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
      `
    });

    // Generate token
    const token = user.generateAuthToken();

    // Cache user in Redis
    await redisClient.setEx(
      `user:${user._id}`,
      3600,
      JSON.stringify(user.toJSON())
    );

    logger.info(`New user registered: ${username}`);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        plan: user.plan
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        error: 'Account disabled',
        message: 'هذا الحساب معطل، تواصل مع الدعم'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      // Log failed attempt
      logger.warn(`Failed login attempt for: ${email} from IP: ${req.ip}`);
      
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    // Update login history
    user.lastLogin = new Date();
    user.loginHistory.push({
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
    
    // Keep only last 10 logins
    if (user.loginHistory.length > 10) {
      user.loginHistory = user.loginHistory.slice(-10);
    }
    
    await user.save();

    // Generate token
    const token = user.generateAuthToken();

    // Cache user in Redis
    await redisClient.setEx(
      `user:${user._id}`,
      3600,
      JSON.stringify(user.toJSON())
    );

    logger.info(`User logged in: ${user.username}`);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        plan: user.plan,
        settings: user.settings
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    // Check Redis cache first
    const cachedUser = await redisClient.get(`user:${req.user.id}`);
    
    if (cachedUser) {
      return res.json({
        success: true,
        user: JSON.parse(cachedUser)
      });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'المستخدم غير موجود'
      });
    }

    // Cache user
    await redisClient.setEx(
      `user:${user._id}`,
      3600,
      JSON.stringify(user.toJSON())
    );

    res.json({
      success: true,
      user
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    // Clear Redis cache
    await redisClient.del(`user:${req.user.id}`);
    
    logger.info(`User logged out: ${req.user.username}`);

    res.json({
      success: true,
      message: 'تم تسجيل الخروج بنجاح'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });
    
    if (!user) {
      return res.status(400).json({
        error: 'Invalid token',
        message: 'رمز التفعيل غير صالح أو منتهي'
      });
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    await user.save();

    logger.info(`Email verified for: ${user.email}`);

    res.json({
      success: true,
      message: 'تم تفعيل البريد الإلكتروني بنجاح'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'لا يوجد مستخدم بهذا البريد الإلكتروني'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    await sendEmail({
      to: email,
      subject: 'إعادة تعيين كلمة المرور - OMNIA AI',
      html: `
        <h1>إعادة تعيين كلمة المرور</h1>
        <p>لقد تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك</p>
        <p>الرجاء النقر على الرابط التالي:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>هذا الرابط صالح لمدة ساعة واحدة</p>
      `
    });

    logger.info(`Password reset requested for: ${email}`);

    res.json({
      success: true,
      message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        error: 'Invalid token',
        message: 'رمز إعادة التعيين غير صالح أو منتهي'
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Clear Redis cache
    await redisClient.del(`user:${user._id}`);

    logger.info(`Password reset for: ${user.email}`);

    res.json({
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح'
    });

  } catch (error) {
    next(error);
  }
};nn
