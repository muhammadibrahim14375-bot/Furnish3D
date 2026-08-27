const express = require('express');
const orderController = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.post('/', orderController.createOrder);
router.get('/mine', orderController.myOrders);
router.get(
  '/',
  authorize('admin', 'moderator'),
  orderController.listOrders
);
router.get('/:id', orderController.getOrder);
router.patch(
  '/:id/status',
  authorize('admin', 'moderator'),
  orderController.updateOrderStatus
);

module.exports = router;
