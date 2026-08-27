const bcrypt = require('bcryptjs');
const uuidv4 = require('../utils/id');
const db = require('../db/store');

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

exports.listUsers = (_req, res) => {
  res.json({ users: db.users.all().map(publicUser) });
};

exports.updateRole = (req, res) => {
  const { role } = req.body;
  if (!['customer', 'moderator', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }
  if (req.params.id === req.user.id) {
    return res.status(400).json({ message: 'Cannot change your own role' });
  }
  const user = db.users.update(req.params.id, { role });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user: publicUser(user) });
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role = 'customer' } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    if (!['customer', 'moderator', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    if (db.users.findOne((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    const user = {
      id: uuidv4(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: await bcrypt.hash(password, 10),
      role,
      createdAt: new Date().toISOString(),
    };
    db.users.insert(user);
    res.status(201).json({ user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = (req, res) => {
  if (req.params.id === req.user.id) {
    return res.status(400).json({ message: 'Cannot delete your own account' });
  }
  const removed = db.users.remove(req.params.id);
  if (!removed) return res.status(404).json({ message: 'User not found' });
  db.cartItems.removeWhere((c) => c.userId === req.params.id);
  res.json({ message: 'User deleted' });
};
