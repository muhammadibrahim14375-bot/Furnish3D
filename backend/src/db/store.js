const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../data/db.json');

const defaultData = () => ({
  users: [],
  categories: [],
  products: [],
  cartItems: [],
  orders: [],
  orderItems: [],
  reviews: [],
});

function ensureFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData(), null, 2));
  }
}

function read() {
  ensureFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function write(data) {
  ensureFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function collection(name) {
  return {
    all() {
      return read()[name] || [];
    },
    findById(id) {
      return this.all().find((item) => item.id === id) || null;
    },
    findOne(predicate) {
      return this.all().find(predicate) || null;
    },
    filter(predicate) {
      return this.all().filter(predicate);
    },
    insert(item) {
      const data = read();
      data[name].push(item);
      write(data);
      return item;
    },
    update(id, patch) {
      const data = read();
      const idx = data[name].findIndex((item) => item.id === id);
      if (idx === -1) return null;
      data[name][idx] = { ...data[name][idx], ...patch };
      write(data);
      return data[name][idx];
    },
    remove(id) {
      const data = read();
      const before = data[name].length;
      data[name] = data[name].filter((item) => item.id !== id);
      write(data);
      return data[name].length < before;
    },
    removeWhere(predicate) {
      const data = read();
      data[name] = data[name].filter((item) => !predicate(item));
      write(data);
    },
    replaceAll(items) {
      const data = read();
      data[name] = items;
      write(data);
    },
  };
}

module.exports = {
  read,
  write,
  reset: () => write(defaultData()),
  users: collection('users'),
  categories: collection('categories'),
  products: collection('products'),
  cartItems: collection('cartItems'),
  orders: collection('orders'),
  orderItems: collection('orderItems'),
  reviews: collection('reviews'),
};
