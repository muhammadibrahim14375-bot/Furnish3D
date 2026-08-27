const express = require('express');
const reviewController = require('../controllers/reviewController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticate, reviewController.createReview);
router.get(
  '/',
  authenticate,
  authorize('admin', 'moderator'),
  reviewController.listReviews
);
router.patch(
  '/:id',
  authenticate,
  authorize('admin', 'moderator'),
  reviewController.moderateReview
);
router.delete('/:id', authenticate, reviewController.deleteReview);

module.exports = router;
