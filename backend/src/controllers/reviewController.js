const uuidv4 = require('../utils/id');
const db = require('../db/store');

function enrichReview(review) {
  const user = db.users.findById(review.userId);
  const product = db.products.findById(review.productId);
  return {
    ...review,
    user: user ? { id: user.id, name: user.name } : null,
    product: product
      ? { id: product.id, name: product.name, slug: product.slug }
      : null,
  };
}

exports.createReview = (req, res) => {
  const { productId, rating, comment = '' } = req.body;
  if (!productId || !rating) {
    return res.status(400).json({ message: 'productId and rating are required' });
  }
  const ratingNum = Number(rating);
  if (ratingNum < 1 || ratingNum > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }
  const product = db.products.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const existing = db.reviews.findOne(
    (r) => r.userId === req.user.id && r.productId === productId
  );
  if (existing) {
    return res.status(409).json({ message: 'You already reviewed this product' });
  }

  const review = {
    id: uuidv4(),
    userId: req.user.id,
    productId,
    rating: ratingNum,
    comment: String(comment).trim(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  db.reviews.insert(review);
  res.status(201).json({ review: enrichReview(review) });
};

exports.listReviews = (req, res) => {
  const { status, productId } = req.query;
  let reviews = db.reviews.all();
  if (status) reviews = reviews.filter((r) => r.status === status);
  if (productId) reviews = reviews.filter((r) => r.productId === productId);
  reviews = reviews
    .map(enrichReview)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ reviews });
};

exports.moderateReview = (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  const review = db.reviews.update(req.params.id, { status });
  if (!review) return res.status(404).json({ message: 'Review not found' });
  res.json({ review: enrichReview(review) });
};

exports.deleteReview = (req, res) => {
  const review = db.reviews.findById(req.params.id);
  if (!review) return res.status(404).json({ message: 'Review not found' });

  const isOwner = review.userId === req.user.id;
  const isStaff = ['admin', 'moderator'].includes(req.user.role);
  if (!isOwner && !isStaff) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  db.reviews.remove(req.params.id);
  res.json({ message: 'Review deleted' });
};
