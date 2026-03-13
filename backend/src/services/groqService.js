const axios = require('axios')
const { logger } = require('../middleware/logger')

const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

exports.callGroq = async (message) => {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'mixtral-8x7b-32768',
        messages: [{ role: 'user', content: message }],
        temperature: 0.7,
        max_tokens: 4096
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    )

    return {
      content: response.data.choices[0].message.content,
      tokens: response.data.usage?.total_tokens || 0,
      model: 'mixtral-8x7b'
    }
  } catch (error) {
    logger.error('Groq API Error:', error.response?.data || error.message)
    throw new Error('فشل الاتصال بـ Groq')
  }
}
