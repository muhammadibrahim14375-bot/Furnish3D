const jwt = require('jsonwebtoken');
const config = require('../config');
const db = require('../db/store');

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const token = header.split(' ')[1];
    const payload = jwt.verify(token, config.jwtSecret);
    const user = db.users.findById(payload.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function optionalAuth(req, _res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next();
  }
  try {
    const token = header.split(' ')[1];
    const payload = jwt.verify(token, config.jwtSecret);
    const user = db.users.findById(payload.id);
    if (user) {
      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
    }
  } catch {
    // ignore invalid optional token
  }
  next();
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
}

module.exports = { authenticate, optionalAuth, authorize };
