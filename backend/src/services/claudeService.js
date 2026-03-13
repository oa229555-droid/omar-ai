// backend/src/services/claudeService.js
const axios = require('axios');
const { logger } = require('../middleware/logger');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

exports.callClaude = async (message) => {
  try {
    const response = await axios.post(
      ANTHROPIC_API_URL,
      {
        model: 'claude-3-opus-20240229',
        max_tokens: 4096,
        messages: [{ role: 'user', content: message }],
        temperature: 0.7
      },
      {
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    return {
      content: response.data.content[0].text,
      tokens: response.data.usage?.input_tokens + response.data.usage?.output_tokens,
      model: 'claude-3-opus'
    };

  } catch (error) {
    logger.error('Claude API Error:', error.response?.data || error.message);
    throw new Error('فشل الاتصال بـ Claude');
  }
};
