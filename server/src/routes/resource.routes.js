const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resource.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const { validateFields } = require('../middleware/validation.middleware');

router.use(authMiddleware);

router.post('/', roleMiddleware(['admin']), validateFields(['name', 'type', 'department']), resourceController.create);
router.get('/', resourceController.getAll);
router.get('/:id', resourceController.getById);
router.put('/:id', roleMiddleware(['admin']), resourceController.update);
router.delete('/:id', roleMiddleware(['admin']), resourceController.remove);

module.exports = router;
