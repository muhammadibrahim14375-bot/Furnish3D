const uuidv4 = require('../utils/id');
const db = require('../db/store');

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function withCategory(product) {
  const category = product.categoryId
    ? db.categories.findById(product.categoryId)
    : null;
  return { ...product, category };
}

exports.listCategories = (_req, res) => {
  res.json({ categories: db.categories.all() });
};

exports.createCategory = (req, res) => {
  const { name, description = '' } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });
  const slug = slugify(name);
  if (db.categories.findOne((c) => c.slug === slug)) {
    return res.status(409).json({ message: 'Category already exists' });
  }
  const category = { id: uuidv4(), name, slug, description };
  db.categories.insert(category);
  res.status(201).json({ category });
};

exports.listProducts = (req, res) => {
  const { search, category, featured } = req.query;
  let products = db.products.all();

  if (search) {
    const q = String(search).toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }
  if (category) {
    const cat = db.categories.findOne(
      (c) => c.slug === category || c.id === category
    );
    if (cat) products = products.filter((p) => p.categoryId === cat.id);
  }
  if (featured === 'true') {
    products = products.filter((p) => p.featured);
  }

  products = products
    .map(withCategory)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({ products });
};

exports.getProduct = (req, res) => {
  const product =
    db.products.findById(req.params.id) ||
    db.products.findOne((p) => p.slug === req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const reviews = db.reviews
    .filter((r) => r.productId === product.id && r.status === 'approved')
    .map((r) => {
      const user = db.users.findById(r.userId);
      return {
        ...r,
        user: user ? { id: user.id, name: user.name } : null,
      };
    });

  const avgRating =
    reviews.length === 0
      ? 0
      : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  res.json({
    product: withCategory(product),
    reviews,
    avgRating: Number(avgRating.toFixed(1)),
  });
};

exports.createProduct = (req, res) => {
  const {
    name,
    description = '',
    price,
    imageUrl = '',
    modelUrl = '',
    categoryId,
    stock = 0,
    featured = false,
  } = req.body;

  if (!name || price == null) {
    return res.status(400).json({ message: 'Name and price are required' });
  }

  let slug = slugify(name);
  if (db.products.findOne((p) => p.slug === slug)) {
    slug = `${slug}-${Date.now()}`;
  }

  const product = {
    id: uuidv4(),
    name,
    slug,
    description,
    price: Number(price),
    imageUrl,
    modelUrl,
    categoryId: categoryId || null,
    stock: Number(stock),
    featured: Boolean(featured),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.products.insert(product);
  res.status(201).json({ product: withCategory(product) });
};

exports.updateProduct = (req, res) => {
  const existing = db.products.findById(req.params.id);
  if (!existing) return res.status(404).json({ message: 'Product not found' });

  const allowed = [
    'name',
    'description',
    'price',
    'imageUrl',
    'modelUrl',
    'categoryId',
    'stock',
    'featured',
  ];
  const patch = { updatedAt: new Date().toISOString() };
  for (const key of allowed) {
    if (req.body[key] !== undefined) patch[key] = req.body[key];
  }
  if (patch.price !== undefined) patch.price = Number(patch.price);
  if (patch.stock !== undefined) patch.stock = Number(patch.stock);
  if (patch.featured !== undefined) patch.featured = Boolean(patch.featured);
  if (patch.name) patch.slug = slugify(patch.name);

  const product = db.products.update(req.params.id, patch);
  res.json({ product: withCategory(product) });
};

exports.deleteProduct = (req, res) => {
  const removed = db.products.remove(req.params.id);
  if (!removed) return res.status(404).json({ message: 'Product not found' });
  db.cartItems.removeWhere((c) => c.productId === req.params.id);
  db.reviews.removeWhere((r) => r.productId === req.params.id);
  res.json({ message: 'Product deleted' });
};
