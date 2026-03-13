// backend/src/controllers/chatController.js
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const { logger } = require('../middleware/logger');
const { redisClient } = require('../server');
const { callOpenAI } = require('../services/openaiService');
const { callGroq } = require('../services/groqService');
const { callGemini } = require('../services/geminiService');
const { callClaude } = require('../services/claudeService');

// @desc    Send message to AI
// @route   POST /api/chat/message
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { message, conversationId, model = 'gpt4' } = req.body;
    const userId = req.user.id;

    // Validation
    if (!message) {
      return res.status(400).json({
        error: 'Message required',
        message: 'الرجاء كتابة رسالة'
      });
    }

    // Check user usage limits
    const user = await User.findById(userId);
    
    if (user.plan === 'free' && user.usage.totalMessages >= 1000) {
      return res.status(403).json({
        error: 'Limit reached',
        message: 'لقد استهلكت حدك اليومي، قم بالترقية للاستمرار'
      });
    }

    // Find or create conversation
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        userId
      });
    }

    if (!conversation) {
      conversation = new Conversation({
        userId,
        title: message.substring(0, 50),
        model
      });
    }

    // Add user message
    conversation.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Call appropriate AI model
    let aiResponse;
    let tokens = 0;

    switch (model) {
      case 'gpt4':
        aiResponse = await callOpenAI(message);
        tokens = aiResponse.tokens;
        break;
      case 'claude':
        aiResponse = await callClaude(message);
        tokens = aiResponse.tokens;
        break;
      case 'gemini':
        aiResponse = await callGemini(message);
        tokens = aiResponse.tokens;
        break;
      case 'mixtral':
        aiResponse = await callGroq(message);
        tokens = aiResponse.tokens;
        break;
      default:
        aiResponse = await callOpenAI(message);
    }

    // Add AI response
    conversation.messages.push({
      role: 'assistant',
      content: aiResponse.content,
      timestamp: new Date(),
      tokens,
      model
    });

    conversation.tokenCount += tokens;
    await conversation.save();

    // Update user usage
    await User.findByIdAndUpdate(userId, {
      $inc: {
        'usage.totalMessages': 1,
        'usage.totalTokens': tokens
      },
      'usage.lastActive': new Date()
    });

    // Cache conversation in Redis
    await redisClient.setEx(
      `conv:${conversation._id}`,
      3600,
      JSON.stringify(conversation)
    );

    logger.info(`Message sent - User: ${userId}, Model: ${model}, Tokens: ${tokens}`);

    res.json({
      success: true,
      message: aiResponse.content,
      conversationId: conversation._id,
      tokens,
      model
    });

  } catch (error) {
    logger.error('Chat error:', error);
    next(error);
  }
};

// @desc    Get user conversations
// @route   GET /api/chat/conversations
// @access  Private
exports.getConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const conversations = await Conversation.find({ userId })
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('title model messages tokenCount createdAt updatedAt isStarred')
      .lean();

    const total = await Conversation.countDocuments({ userId });

    res.json({
      success: true,
      conversations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get single conversation
// @route   GET /api/chat/conversation/:id
// @access  Private
exports.getConversation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check Redis cache
    const cached = await redisClient.get(`conv:${id}`);
    if (cached) {
      return res.json({
        success: true,
        conversation: JSON.parse(cached)
      });
    }

    const conversation = await Conversation.findOne({
      _id: id,
      userId
    });

    if (!conversation) {
      return res.status(404).json({
        error: 'Not found',
        message: 'المحادثة غير موجودة'
      });
    }

    // Cache conversation
    await redisClient.setEx(
      `conv:${conversation._id}`,
      3600,
      JSON.stringify(conversation)
    );

    res.json({
      success: true,
      conversation
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Delete conversation
// @route   DELETE /api/chat/conversation/:id
// @access  Private
exports.deleteConversation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await Conversation.deleteOne({
      _id: id,
      userId
    });

    // Clear cache
    await redisClient.del(`conv:${id}`);

    logger.info(`Conversation deleted: ${id} by user: ${userId}`);

    res.json({
      success: true,
      message: 'تم حذف المحادثة بنجاح'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Star/unstar conversation
// @route   PATCH /api/chat/conversation/:id/star
// @access  Private
exports.toggleStar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findOne({
      _id: id,
      userId
    });

    if (!conversation) {
      return res.status(404).json({
        error: 'Not found',
        message: 'المحادثة غير موجودة'
      });
    }

    conversation.isStarred = !conversation.isStarred;
    await conversation.save();

    // Clear cache
    await redisClient.del(`conv:${id}`);

    res.json({
      success: true,
      isStarred: conversation.isStarred
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Share conversation
// @route   POST /api/chat/conversation/:id/share
// @access  Private
exports.shareConversation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findOne({
      _id: id,
      userId
    });

    if (!conversation) {
      return res.status(404).json({
        error: 'Not found',
        message: 'المحادثة غير موجودة'
      });
    }

    conversation.generateShareId();
    await conversation.save();

    const shareUrl = `${process.env.FRONTEND_URL}/shared/${conversation.shared.shareId}`;

    res.json({
      success: true,
      shareId: conversation.shared.shareId,
      shareUrl
    });

  } catch (error) {
    next(error);
  }
};
