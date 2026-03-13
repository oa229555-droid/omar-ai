// backend/src/models/Conversation.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  tokens: Number,
  model: String,
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
});

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    default: 'محادثة جديدة',
    maxlength: 200
  },
  messages: [messageSchema],
  model: {
    type: String,
    enum: ['gpt4', 'claude', 'gemini', 'mixtral'],
    default: 'gpt4'
  },
  tokenCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  isArchived: {
    type: Boolean,
    default: false
  },
  isStarred: {
    type: Boolean,
    default: false
  },
  shared: {
    isShared: { type: Boolean, default: false },
    shareId: { type: String, unique: true, sparse: true },
    sharedAt: Date,
    views: { type: Number, default: 0 }
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    location: String,
    browser: String,
    os: String
  }
}, {
  timestamps: true
});

// Indexes for performance
conversationSchema.index({ userId: 1, updatedAt: -1 });
conversationSchema.index({ userId: 1, isStarred: -1 });
conversationSchema.index({ 'shared.shareId': 1 }, { unique: true, sparse: true });

// Update token count before save
conversationSchema.pre('save', function(next) {
  if (this.isModified('messages')) {
    this.tokenCount = this.messages.reduce((sum, msg) => sum + (msg.tokens || 0), 0);
  }
  next();
});

// Generate share ID
conversationSchema.methods.generateShareId = function() {
  const crypto = require('crypto');
  this.shared.shareId = crypto.randomBytes(16).toString('hex');
  this.shared.isShared = true;
  this.shared.sharedAt = new Date();
};

// Get conversation summary
conversationSchema.methods.getSummary = function() {
  return {
    id: this._id,
    title: this.title,
    model: this.model,
    messageCount: this.messages.length,
    tokenCount: this.tokenCount,
    lastMessage: this.messages[this.messages.length - 1],
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    isStarred: this.isStarred
  };
};

module.exports = mongoose.model('Conversation', conversationSchema);
