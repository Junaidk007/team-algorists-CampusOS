const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/stats', dashboardController.getStats);
router.get('/ai-summary', dashboardController.getAiSummary);

module.exports = router;
