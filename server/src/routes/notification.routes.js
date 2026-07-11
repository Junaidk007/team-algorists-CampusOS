const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/', notificationController.getUserNotifications);
router.put('/:id/read', notificationController.markRead);

module.exports = router;
