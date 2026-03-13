// backend/middleware/auth.js
module.exports = (req, res, next) => {
    // التحقق من وجود جلسة
    if (!req.session || !req.session.userId) {
        // التحقق من التوكن في الهيدر (لـ API)
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            try {
                // التحقق من التوكن (يمكن إضافة JWT هنا)
                // مؤقتاً نقبل أي توكن للتجربة
                req.session = { userId: token };
                return next();
            } catch (error) {
                return res.status(401).json({ error: 'توكن غير صالح' });
            }
        }
        
        return res.status(401).json({ error: 'يجب تسجيل الدخول أولاً' });
    }
    
    next();
};
