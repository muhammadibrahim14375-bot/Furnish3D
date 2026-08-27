require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

const allowedOrigins = [
  config.clientUrl,
  ...(process.env.EXTRA_ORIGINS
    ? process.env.EXTRA_ORIGINS.split(',').map((s) => s.trim())
    : []),
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(null, true); // allow all for demo deploys; tighten via CLIENT_URL in prod
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));
app.use('/models', express.static(path.join(__dirname, '../public/models')));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'Furnish3D API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

const dataFile = path.join(__dirname, '../data/db.json');
if (!fs.existsSync(dataFile)) {
  console.log('No database found — run: npm run seed');
}

app.listen(config.port, () => {
  console.log(`Furnish3D API running on http://localhost:${config.port}`);
});
