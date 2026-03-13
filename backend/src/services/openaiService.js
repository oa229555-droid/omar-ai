// backend/src/services/openaiService.js
const axios = require('axios');
const { logger } = require('../middleware/logger');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

exports.callOpenAI = async (message) => {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: message }],
        temperature: 0.7,
        max_tokens: 4000,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    return {
      content: response.data.choices[0].message.content,
      tokens: response.data.usage.total_tokens,
      model: 'gpt-4'
    };

  } catch (error) {
    logger.error('OpenAI API Error:', error.response?.data || error.message);
    throw new Error('فشل الاتصال بـ OpenAI');
  }
};

exports.callDALL
