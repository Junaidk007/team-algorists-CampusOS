const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;

if (apiKey && apiKey !== 'your_gemini_api_key_here') {
  genAI = new GoogleGenerativeAI(apiKey);
  console.log('Gemini AI client initialized successfully.');
} else {
  console.warn('Warning: GEMINI_API_KEY is not set or is a placeholder.');
}

module.exports = genAI;
