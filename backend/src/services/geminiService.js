const axios = require('axios')
const { logger } = require('../middleware/logger')

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

exports.callGemini = async (message) => {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: message }]
        }]
      },
      { timeout: 30000 }
    )

    return {
      content: response.data.candidates[0].content.parts[0].text,
      tokens: 0,
      model: 'gemini-pro'
    }
  } catch (error) {
    logger.error('Gemini API Error:', error.response?.data || error.message)
    throw new Error('فشل الاتصال بـ Google Gemini')
  }
}
