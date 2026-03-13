// backend/src/services/geminiService.js
const axios = require('axios');
const { logger } = require('../middleware/logger');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

exports.callGemini = async (message) => {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: message }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
          topP: 0.95,
          topK: 40
        }
      },
      {
        timeout: 30000
      }
    );

    return {
      content: response.data.candidates[0].content.parts[0].text,
      tokens: 0, // Gemini doesn't return token count
      model: 'gemini-pro'
    };

  } catch (error) {
    logger.error('Gemini API Error:', error.response?.data || error.message);
    throw new Error('فشل الاتصال بـ Google Gemini');
  }
};

exports.callGeminiVision = async (imageBase64, prompt) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: imageBase64
              }
            }
          ]
        }]
      },
      {
        timeout: 30000
      }
    );

    return {
      content: response.data.candidates[0].content.parts[0].text,
      model: 'gemini-pro-vision'
    };

  } catch (error) {
    logger.error('Gemini Vision Error:', error.response?.data || error.message);
    throw new Error('فشل تحليل الصورة');
  }
};
