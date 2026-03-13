// backend/src/routes/toolsRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const toolsController = require('../controllers/toolsController');
const { auth } = require('../middleware/auth');
const { rateLimiter } = require('../middleware/rateLimiter');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// AI Tools Routes
router.post('/article', auth, rateLimiter.tools, toolsController.generateArticle);
router.post('/code', auth, rateLimiter.tools, toolsController.generateCode);
router.post('/translate', auth, rateLimiter.tools, toolsController.translate);
router.post('/summarize', auth, rateLimiter.tools, toolsController.summarize);
router.post('/analyze', auth, rateLimiter.tools, toolsController.analyzeData);
router.post('/ideas', auth, rateLimiter.tools, toolsController.generateIdeas);
router.post('/image', auth, rateLimiter.tools, toolsController.generateImage);

// File upload routes
router.post(
  '/analyze-file',
  auth,
  upload.single('file'),
  toolsController.analyzeFile
);

router.post(
  '/tts',
  auth,
  toolsController.textToSpeech
);

router.post(
  '/stt',
  auth,
  upload.single('audio'),
  toolsController.speechToText
);

module.exports = router;
