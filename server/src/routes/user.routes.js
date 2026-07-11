const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const { validateFields } = require('../middleware/validation.middleware');

router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.get('/', userController.getAllUsers);
router.post('/', validateFields(['name', 'email', 'password', 'role']), userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
