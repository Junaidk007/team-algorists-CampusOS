const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validateFields } = require('../middleware/validation.middleware');

router.post('/register', validateFields(['name', 'email', 'password']), authController.register);
router.post('/login', validateFields(['email', 'password']), authController.login);
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
