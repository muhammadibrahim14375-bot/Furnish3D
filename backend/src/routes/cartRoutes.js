const express = require('express');
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.delete('/clear', cartController.clearCart);
router.patch('/:id', cartController.updateCartItem);
router.delete('/:id', cartController.removeCartItem);

module.exports = router;
