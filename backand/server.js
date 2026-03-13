// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const dotenv = require('dotenv');
const path = require('path');

// تحميل متغيرات البيئة
dotenv.config();

// استيراد المسارات
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const modelRoutes = require('./routes/models');
const fileRoutes = require('./routes/files');

// تهيئة التطبيق
const app = express();
const PORT = process.env.PORT || 3000;

// ==================== الإعدادات الأمنية ====================
app.use(helmet({
    contentSecurityPolicy: false,
}));

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// تحديد معدل الطلبات
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 دقيقة
    max: 100, // حد أقصى 100 طلب
    message: 'لقد تجاوزت الحد المسموح من الطلبات، حاول بعد 15 دقيقة'
});
app.use('/api/', limiter);

// معالجة JSON
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ==================== قاعدة البيانات ====================
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/titan-omega', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ متصل بقاعدة البيانات');
}).catch(err => {
    console.error('❌ فشل الاتصال بقاعدة البيانات:', err);
});

// مخزن الجلسات
const sessionStore = new MongoDBStore({
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/titan-omega',
    collection: 'sessions'
});

// إعداد الجلسات
app.use(session({
    secret: process.env.SESSION_SECRET || 'titan-omega-secret-key',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // يوم واحد
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    }
}));

// ==================== المسارات ====================
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/models', modelRoutes);
app.use('/api/files', fileRoutes);

// ==================== الملفات الثابتة ====================
app.use(express.static(path.join(__dirname, '../frontend')));

// ==================== معالجة الأخطاء ====================
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'حدث خطأ في الخادم',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ==================== تشغيل الخادم ====================
app.listen(PORT, () => {
    console.log(`🚀 TITAN-OMEGA يعمل على المنفذ ${PORT}`);
    console.log(`📱 المطور: Omar Abdo - 01289411976`);
});

// ==================== نماذج الذكاء الاصطناعي ====================
const AI_MODELS = {
    gpt4: {
        name: 'GPT-4 Turbo',
        provider: 'OpenAI',
        apiKey: process.env.OPENAI_API_KEY,
        endpoint: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-4-turbo-preview',
        maxTokens: 128000,
        cost: 0.01
    },
    claude: {
        name: 'Claude 3',
        provider: 'Anthropic',
        apiKey: process.env.ANTHROPIC_API_KEY,
        endpoint: 'https://api.anthropic.com/v1/messages',
        model: 'claude-3-opus-20240229',
        maxTokens: 200000,
        cost: 0.015
    },
    gemini: {
        name: 'Gemini Pro',
        provider: 'Google',
        apiKey: process.env.GOOGLE_API_KEY,
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        maxTokens: 32768,
        cost: 0
    },
    mixtral: {
        name: 'Mixtral 8x7B',
        provider: 'Groq',
        apiKey: process.env.GROQ_API_KEY,
        endpoint: 'https://api.groq.com/openai/v1/chat/completions',
        model: 'mixtral-8x7b-32768',
        maxTokens: 32768,
        cost: 0
    }
};

module.exports = { app, AI_MODELS };
