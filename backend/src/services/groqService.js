// backend/src/services/groqService.js
const axios = require('axios');
const { logger } = require('../middleware/logger');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

exports.callGroq = async (message) => {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'mixtral-8x7b-32768',
        messages: [{ role: 'user', content: message }],
        temperature: 0.7,
        max_tokens: 4096,
        top_p: 0.95
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    return {
      content: response.data.choices[0].message.content,
      tokens: response.data.usage?.total_tokens || 0,
      model: 'mixtral-8x7b'
    };

  } catch (error) {
    logger.error('Groq API Error:', error.response?.data || error.message);
    throw new Error('فشل الاتصال بـ Groq');
  }
};

exports.callGroqStream = async (message, res) => {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'mixtral-8x7b-32768',
        messages: [{ role: 'user', content: message }],
        temperature: 0.7,
        max_tokens: 4096,
        stream: true
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        responseType: 'stream',
        timeout: 60000
      }
    );

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    response.data.on('data', (chunk) => {
      const lines = chunk.toString().split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            res.write('data: [DONE]\n\n');
            res.end();
            return;
          }
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content || '';
            if (content) {
              res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    });

    response.data.on('error', (error) => {
      logger.error('Groq stream error:', error);
      res.end();
    });

  } catch (error) {
    logger.error('Groq stream error:', error);
    throw error;
  }
};
