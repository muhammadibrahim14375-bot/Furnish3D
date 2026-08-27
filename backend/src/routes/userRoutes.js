const express = require('express');
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate, authorize('admin'));

router.get('/', userController.listUsers);
router.post('/', userController.createUser);
router.patch('/:id/role', userController.updateRole);
router.delete('/:id', userController.deleteUser);

module.exports = router;
