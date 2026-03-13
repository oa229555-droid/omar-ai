// backend/src/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const chatController = require('../controllers/chatController');
const { auth } = require('../middleware/auth');
const { rateLimiter } = require('../middleware/rateLimiter');

// Validation rules
const messageValidation = [
  body('message')
    .notEmpty()
    .withMessage('الرسالة مطلوبة')
    .isLength({ max: 10000 })
    .withMessage('الرسالة طويلة جداً')
];

// Routes
router.post(
  '/message', 
  auth, 
  rateLimiter.chat, 
  messageValidation, 
  chatController.sendMessage
);

router.get('/conversations', auth, chatController.getConversations);
router.get('/conversation/:id', auth, chatController.getConversation);
router.delete('/conversation/:id', auth, chatController.deleteConversation);
router.patch('/conversation/:id/star', auth, chatController.toggleStar);
router.post('/conversation/:id/share', auth, chatController.shareConversation);

// Get shared conversation (public)
router.get('/shared/:shareId', chatController.getSharedConversation);

module.exports = router;
