// backend/src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'اسم المستخدم مطلوب'],
    unique: true,
    trim: true,
    minlength: [3, 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل'],
    maxlength: [30, 'اسم المستخدم يجب أن يكون أقل من 30 حرف']
  },
  email: {
    type: String,
    required: [true, 'البريد الإلكتروني مطلوب'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'بريد إلكتروني غير صالح']
  },
  password: {
    type: String,
    required: [true, 'كلمة المرور مطلوبة'],
    minlength: [6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'],
    select: false
  },
  fullName: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  plan: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free'
  },
  apiKeys: {
    openai: { type: String, select: false },
    anthropic: { type: String, select: false },
    google: { type: String, select: false },
    groq: { type: String, select: false }
  },
  settings: {
    defaultModel: { type: String, default: 'gpt4' },
    theme: { type: String, default: 'dark' },
    language: { type: String, default: 'ar' },
    saveHistory: { type: Boolean, default: true },
    autoTranslate: { type: Boolean, default: false }
  },
  usage: {
    totalMessages: { type: Number, default: 0 },
    totalTokens: { type: Number, default: 0 },
    totalImages: { type: Number, default: 0 },
    totalAudio: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now }
  },
  subscription: {
    plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
    startDate: Date,
    endDate: Date,
    autoRenew: { type: Boolean, default: true },
    stripeCustomerId: String,
    stripeSubscriptionId: String
  },
  emailVerified: { type: Boolean, default: false },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  loginHistory: [{
    ip: String,
    userAgent: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for conversations
userSchema.virtual('conversations', {
  ref: 'Conversation',
  localField: '_id',
  foreignField: 'userId'
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function() {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { 
      id: this._id,
      username: this.username,
      role: this.role,
      plan: this.plan
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// Check subscription status
userSchema.methods.hasActiveSubscription = function() {
  if (this.plan === 'free') return true;
  if (!this.subscription.endDate) return false;
  return new Date() < this.subscription.endDate;
};

// Update usage stats
userSchema.methods.updateUsage = async function(type, amount = 1) {
  this.usage[`total${type}`] += amount;
  this.usage.lastActive = new Date();
  await this.save();
};

module.exports = mongoose.model('User', userSchema);
