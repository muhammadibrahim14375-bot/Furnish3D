const uuidv4 = require('../utils/id');
const db = require('../db/store');

function enrichOrder(order) {
  const items = db.orderItems.filter((i) => i.orderId === order.id);
  const user = db.users.findById(order.userId);
  return {
    ...order,
    items,
    user: user ? { id: user.id, name: user.name, email: user.email } : null,
  };
}

exports.createOrder = (req, res) => {
  const { shippingAddress } = req.body;
  if (!shippingAddress || !shippingAddress.trim()) {
    return res.status(400).json({ message: 'Shipping address is required' });
  }

  const cartItems = db.cartItems.filter((c) => c.userId === req.user.id);
  if (cartItems.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  const lineItems = [];
  let total = 0;

  for (const cartItem of cartItems) {
    const product = db.products.findById(cartItem.productId);
    if (!product) {
      return res.status(400).json({ message: 'A product in your cart no longer exists' });
    }
    if (product.stock < cartItem.quantity) {
      return res
        .status(400)
        .json({ message: `Not enough stock for ${product.name}` });
    }
    const lineTotal = product.price * cartItem.quantity;
    total += lineTotal;
    lineItems.push({ product, quantity: cartItem.quantity });
  }

  const order = {
    id: uuidv4(),
    userId: req.user.id,
    total: Number(total.toFixed(2)),
    status: 'pending',
    shippingAddress: shippingAddress.trim(),
    createdAt: new Date().toISOString(),
  };
  db.orders.insert(order);

  for (const line of lineItems) {
    db.orderItems.insert({
      id: uuidv4(),
      orderId: order.id,
      productId: line.product.id,
      productName: line.product.name,
      price: line.product.price,
      quantity: line.quantity,
    });
    db.products.update(line.product.id, {
      stock: line.product.stock - line.quantity,
      updatedAt: new Date().toISOString(),
    });
  }

  db.cartItems.removeWhere((c) => c.userId === req.user.id);
  res.status(201).json({ order: enrichOrder(order) });
};

exports.myOrders = (req, res) => {
  const orders = db.orders
    .filter((o) => o.userId === req.user.id)
    .map(enrichOrder)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ orders });
};

exports.getOrder = (req, res) => {
  const order = db.orders.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (
    order.userId !== req.user.id &&
    !['admin', 'moderator'].includes(req.user.role)
  ) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  res.json({ order: enrichOrder(order) });
};

exports.listOrders = (_req, res) => {
  const orders = db.orders
    .all()
    .map(enrichOrder)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ orders });
};

exports.updateOrderStatus = (req, res) => {
  const { status } = req.body;
  const allowed = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  const order = db.orders.update(req.params.id, { status });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json({ order: enrichOrder(order) });
};
