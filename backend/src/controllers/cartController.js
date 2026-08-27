const uuidv4 = require('../utils/id');
const db = require('../db/store');

function enrichCartItem(item) {
  const product = db.products.findById(item.productId);
  return { ...item, product };
}

exports.getCart = (req, res) => {
  const items = db.cartItems
    .filter((c) => c.userId === req.user.id)
    .map(enrichCartItem)
    .filter((c) => c.product);
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  res.json({ items, total: Number(total.toFixed(2)) });
};

exports.addToCart = (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) return res.status(400).json({ message: 'productId is required' });

  const product = db.products.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (product.stock < 1) {
    return res.status(400).json({ message: 'Product out of stock' });
  }

  const existing = db.cartItems.findOne(
    (c) => c.userId === req.user.id && c.productId === productId
  );

  if (existing) {
    const qty = existing.quantity + Number(quantity);
    if (qty > product.stock) {
      return res.status(400).json({ message: 'Not enough stock' });
    }
    const updated = db.cartItems.update(existing.id, { quantity: qty });
    return res.json({ item: enrichCartItem(updated) });
  }

  const item = {
    id: uuidv4(),
    userId: req.user.id,
    productId,
    quantity: Number(quantity),
  };
  db.cartItems.insert(item);
  res.status(201).json({ item: enrichCartItem(item) });
};

exports.updateCartItem = (req, res) => {
  const item = db.cartItems.findById(req.params.id);
  if (!item || item.userId !== req.user.id) {
    return res.status(404).json({ message: 'Cart item not found' });
  }
  const quantity = Number(req.body.quantity);
  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: 'Quantity must be at least 1' });
  }
  const product = db.products.findById(item.productId);
  if (product && quantity > product.stock) {
    return res.status(400).json({ message: 'Not enough stock' });
  }
  const updated = db.cartItems.update(item.id, { quantity });
  res.json({ item: enrichCartItem(updated) });
};

exports.removeCartItem = (req, res) => {
  const item = db.cartItems.findById(req.params.id);
  if (!item || item.userId !== req.user.id) {
    return res.status(404).json({ message: 'Cart item not found' });
  }
  db.cartItems.remove(item.id);
  res.json({ message: 'Removed from cart' });
};

exports.clearCart = (req, res) => {
  db.cartItems.removeWhere((c) => c.userId === req.user.id);
  res.json({ message: 'Cart cleared' });
};
