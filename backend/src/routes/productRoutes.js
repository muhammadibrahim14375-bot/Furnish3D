const express = require('express');
const productController = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/categories', productController.listCategories);
router.post(
  '/categories',
  authenticate,
  authorize('admin'),
  productController.createCategory
);

router.get('/', productController.listProducts);
router.get('/:id', productController.getProduct);
router.post('/', authenticate, authorize('admin'), productController.createProduct);
router.put(
  '/:id',
  authenticate,
  authorize('admin', 'moderator'),
  productController.updateProduct
);
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  productController.deleteProduct
);

module.exports = router;
