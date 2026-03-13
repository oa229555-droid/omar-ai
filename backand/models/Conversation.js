// backend/models/Conversation.js
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
    model: String
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
        default: 'محادثة جديدة'
    },
    messages: [messageSchema],
    model: {
        type: String,
        default: 'gpt4'
    },
    tokenCount: {
        type: Number,
        default: 0
    },
    tags: [String],
    isArchived: {
        type: Boolean,
        default: false
    },
    shared: {
        isShared: { type: Boolean, default: false },
        shareId: { type: String, unique: true, sparse: true }
    },
    metadata: {
        userAgent: String,
        ipAddress: String,
        location: String
    }
}, {
    timestamps: true
});

// فهرسة للبحث السريع
conversationSchema.index({ userId: 1, updatedAt: -1 });
conversationSchema.index({ userId: 1, tags: 1 });

// تحديث تاريخ التعديل تلقائياً
conversationSchema.pre('save', function(next) {
    if (this.isModified('messages')) {
        this.updatedAt = new Date();
    }
    next();
});

// توليد معرف مشاركة فريد
conversationSchema.methods.generateShareId = function() {
    this.shared.shareId = Math.random().toString(36).substring(2, 15);
    this.shared.isShared = true;
};

module.exports = mongoose.model('Conversation', conversationSchema);
