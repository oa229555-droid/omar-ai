// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { rateLimiter } = require('../middleware/rateLimiter');

// Validation rules
const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('اسم المستخدم يجب أن يكون بين 3 و 30 حرف'),
  body('email')
    .isEmail()
    .withMessage('بريد إلكتروني غير صالح'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
];

const loginValidation = [
  body('email').isEmail().withMessage('بريد إلكتروني غير صالح'),
  body('password').notEmpty().withMessage('كلمة المرور مطلوبة')
];

// Routes
router.post('/register', rateLimiter.auth, registerValidation, authController.register);
router.post('/login', rateLimiter.auth, loginValidation, authController.login);
router.get('/me', auth, authController.getMe);
router.post('/logout', auth, authController.logout);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/forgot-password', rateLimiter.auth, authController.forgotPassword);
router.post('/reset-password/:token', rateLimiter.auth, authController.resetPassword);

module.exports = router;
