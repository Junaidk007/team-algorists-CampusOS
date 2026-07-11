const dotenv = require('dotenv');
dotenv.config();

const requiredEnv = ['MONGO_URI', 'JWT_SECRET'];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`Warning: Missing environment variable: ${key}`);
  }
});

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/internalHack',
  JWT_SECRET: process.env.JWT_SECRET || 'supersecretjwtsecretkey12345',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
};
