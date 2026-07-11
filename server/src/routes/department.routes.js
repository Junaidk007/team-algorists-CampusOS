const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/department.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const { validateFields } = require('../middleware/validation.middleware');

router.use(authMiddleware);

router.get('/', departmentController.getAll);
router.get('/:id', departmentController.getById);

router.post('/', roleMiddleware(['admin']), validateFields(['name', 'code']), departmentController.create);
router.put('/:id', roleMiddleware(['admin']), departmentController.update);
router.delete('/:id', roleMiddleware(['admin']), departmentController.remove);

module.exports = router;
