const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const { validateFields } = require('../middleware/validation.middleware');

router.use(authMiddleware);

router.post('/', validateFields(['resource', 'event', 'startTime', 'endTime']), bookingController.create);
router.post('/check-conflict', validateFields(['resource', 'startTime', 'endTime']), bookingController.checkConflict);
router.get('/', bookingController.getAll);
router.put('/:id/status', roleMiddleware(['admin', 'faculty', 'dean']), validateFields(['status']), bookingController.updateStatus);

module.exports = router;
