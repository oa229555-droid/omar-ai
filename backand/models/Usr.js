// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    fullName: {
        type: String,
        trim: true
    },
    avatar: {
        type: String,
        default: 'default-avatar.png'
    },
    plan: {
        type: String,
        enum: ['free', 'pro', 'enterprise'],
        default: 'free'
    },
    apiKeys: {
        openai: String,
        anthropic: String,
        google: String,
        groq: String
    },
    settings: {
        defaultModel: { type: String, default: 'gpt4' },
        theme: { type: String, default: 'dark' },
        language: { type: String, default: 'ar' },
        saveHistory: { type: Boolean, default: true }
    },
    usage: {
        totalMessages: { type: Number, default: 0 },
        totalTokens: { type: Number, default: 0 },
        lastActive: { type: Date, default: Date.now }
    },
    emailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    role: { type: String, default: 'user' }
}, {
    timestamps: true
});

// تشفير كلمة المرور قبل الحفظ
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// مقارنة كلمة المرور
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// تجاهل الحقول الحساسة عند التحويل لـ JSON
userSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret.password;
        delete ret.apiKeys;
        return ret;
    }
});

module.exports = mongoose.model('User', userSchema);
