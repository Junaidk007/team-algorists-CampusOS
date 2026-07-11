const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validateFields } = require('../middleware/validation.middleware');

router.use(authMiddleware);

router.post('/', validateFields(['title', 'type', 'department', 'startDate', 'endDate']), eventController.create);
router.get('/', eventController.getAll);
router.get('/:id', eventController.getById);
router.put('/:id', eventController.update);
router.delete('/:id', eventController.remove);

module.exports = router;
