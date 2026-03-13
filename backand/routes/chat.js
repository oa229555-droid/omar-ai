// backend/routes/chat.js
const express = require('express');
const router = express.Router();
const { AI_MODELS } = require('../server');
const auth = require('../middleware/auth');
const Conversation = require('../models/Conversation');
const rateLimiter = require('../middleware/rateLimiter');
const axios = require('axios');

// إرسال رسالة إلى الذكاء الاصطناعي
router.post('/message', auth, rateLimiter.chat, async (req, res) => {
    try {
        const { message, model = 'gpt4', conversationId } = req.body;
        const userId = req.session.userId;
        
        // التحقق من وجود النموذج
        if (!AI_MODELS[model]) {
            return res.status(400).json({ error: 'نموذج غير مدعوم' });
        }
        
        // البحث أو إنشاء محادثة
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
        
        // حفظ رسالة المستخدم
        conversation.messages.push({
            role: 'user',
            content: message,
            timestamp: new Date()
        });
        
        // استدعاء API المناسب
        let aiResponse;
        const modelConfig = AI_MODELS[model];
        
        switch(model) {
            case 'gpt4':
                aiResponse = await callOpenAI(message, modelConfig);
                break;
            case 'claude':
                aiResponse = await callAnthropic(message, modelConfig);
                break;
            case 'gemini':
                aiResponse = await callGoogle(message, modelConfig);
                break;
            case 'mixtral':
                aiResponse = await callGroq(message, modelConfig);
                break;
            default:
                aiResponse = { content: 'نموذج غير مدعوم' };
        }
        
        // حفظ رد AI
        conversation.messages.push({
            role: 'assistant',
            content: aiResponse.content,
            timestamp: new Date()
        });
        
        // تحديث إحصائيات الاستخدام
        conversation.tokenCount += aiResponse.tokens || 0;
        await conversation.save();
        
        res.json({
            message: aiResponse.content,
            conversationId: conversation._id,
            model: modelConfig.name,
            tokens: aiResponse.tokens
        });
        
    } catch (error) {
        console.error('خطأ في معالجة الرسالة:', error);
        res.status(500).json({ error: 'حدث خطأ في معالجة طلبك' });
    }
});

// استدعاء OpenAI
async function callOpenAI(message, config) {
    try {
        const response = await axios.post(config.endpoint, {
            model: config.model,
            messages: [{ role: 'user', content: message }],
            max_tokens: 4000,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${config.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        
        return {
            content: response.data.choices[0].message.content,
            tokens: response.data.usage.total_tokens
        };
    } catch (error) {
        console.error('OpenAI API Error:', error.response?.data || error.message);
        throw new Error('فشل الاتصال بـ OpenAI');
    }
}

// استدعاء Anthropic Claude
async function callAnthropic(message, config) {
    try {
        const response = await axios.post(config.endpoint, {
            model: config.model,
            messages: [{ role: 'user', content: message }],
            max_tokens: 4000
        }, {
            headers: {
                'x-api-key': config.apiKey,
                'anthropic-version': '2023-06-01',
                'Content-Type': 'application/json'
            }
        });
        
        return {
            content: response.data.content[0].text,
            tokens: response.data.usage?.input_tokens + response.data.usage?.output_tokens
        };
    } catch (error) {
        console.error('Anthropic API Error:', error.response?.data || error.message);
        throw new Error('فشل الاتصال بـ Claude');
    }
}

// استدعاء Google Gemini
async function callGoogle(message, config) {
    try {
        const response = await axios.post(`${config.endpoint}?key=${config.apiKey}`, {
            contents: [{
                parts: [{ text: message }]
            }]
        });
        
        return {
            content: response.data.candidates[0].content.parts[0].text,
            tokens: 0 // Gemini لا يعيد عدد التوكنات في الرد
        };
    } catch (error) {
        console.error('Google API Error:', error.response?.data || error.message);
        throw new Error('فشل الاتصال بـ Gemini');
    }
}

// استدعاء Groq Mixtral
async function callGroq(message, config) {
    try {
        const response = await axios.post(config.endpoint, {
            model: config.model,
            messages: [{ role: 'user', content: message }],
            temperature: 0.7,
            max_tokens: 4096
        }, {
            headers: {
                'Authorization': `Bearer ${config.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        
        return {
            content: response.data.choices[0].message.content,
            tokens: response.data.usage?.total_tokens || 0
        };
    } catch (error) {
        console.error('Groq API Error:', error.response?.data || error.message);
        throw new Error('فشل الاتصال بـ Groq');
    }
}

// الحصول على محادثات المستخدم
router.get('/conversations', auth, async (req, res) => {
    try {
        const conversations = await Conversation.find({ 
            userId: req.session.userId 
        })
        .sort({ updatedAt: -1 })
        .limit(50)
        .select('title model createdAt updatedAt');
        
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ error: 'فشل في جلب المحادثات' });
    }
});

// الحصول على محادثة محددة
router.get('/conversation/:id', auth, async (req, res) => {
    try {
        const conversation = await Conversation.findOne({
            _id: req.params.id,
            userId: req.session.userId
        });
        
        if (!conversation) {
            return res.status(404).json({ error: 'المحادثة غير موجودة' });
        }
        
        res.json(conversation);
    } catch (error) {
        res.status(500).json({ error: 'فشل في جلب المحادثة' });
    }
});

// حذف محادثة
router.delete('/conversation/:id', auth, async (req, res) => {
    try {
        await Conversation.deleteOne({
            _id: req.params.id,
            userId: req.session.userId
        });
        
        res.json({ message: 'تم حذف المحادثة بنجاح' });
    } catch (error) {
        res.status(500).json({ error: 'فشل في حذف المحادثة' });
    }
});

module.exports = router;
