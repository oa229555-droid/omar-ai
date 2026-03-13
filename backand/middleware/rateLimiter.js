// backend/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

// مخزن مؤقت في الذاكرة
const store = new Map();

// محدد معدل للدردشة
const chatLimiter = rateLimit({
    windowMs: 60 * 1000, // دقيقة واحدة
    max: 30, // 30 رسالة في الدقيقة
    message: { error: 'لقد تجاوزت الحد المسموح من الرسائل، حاول بعد دقيقة' },
    keyGenerator: (req) => req.session?.userId || req.ip,
    skip: (req) => req.user?.plan === 'enterprise' // المستخدمين المميزين غير مشمولين
});

// محدد معدل للمستخدمين العاديين
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 دقيقة
    max: 5, // 5 محاولات
    message: { error: 'محاولات كثيرة، حاول بعد 15 دقيقة' }
});

// محدد معدل API
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    message: { error: 'تجاوزت الحد المسموح من طلبات API' }
});

// محدد مخصص حسب خطة المستخدم
const planBasedLimiter = async (req, res, next) => {
    const user = req.user;
    if (!user) return next();
    
    const limits = {
        free: 10, // 10 رسائل في الدقيقة
        pro: 60,  // 60 رسالة في الدقيقة
        enterprise: 200 // 200 رسالة في الدقيقة
    };
    
    const limit = limits[user.plan] || 10;
    const key = `rate:${user._id}`;
    const now = Date.now();
    const windowMs = 60 * 1000; // دقيقة
    
    // الحصول على سجل المستخدم
    let record = store.get(key);
    if (!record) {
        record = { count: 1, resetTime: now + windowMs };
        store.set(key, record);
        return next();
    }
    
    // إعادة تعيين إذا انتهت النافذة
    if (now > record.resetTime) {
        record.count = 1;
        record.resetTime = now + windowMs;
        return next();
    }
    
    // التحقق من الحد
    if (record.count >= limit) {
        return res.status(429).json({ 
            error: 'لقد استهلكت حدك اليومي، جرب بعد دقيقة',
            limit,
            remaining: 0,
            resetIn: Math.ceil((record.resetTime - now) / 1000)
        });
    }
    
    record.count++;
    next();
};

module.exports = {
    chat: chatLimiter,
    auth: authLimiter,
    api: apiLimiter,
    planBased: planBasedLimiter
};
