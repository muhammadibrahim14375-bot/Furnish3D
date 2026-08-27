require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5001,
  jwtSecret: process.env.JWT_SECRET || 'furnish3d_dev_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173',
};
