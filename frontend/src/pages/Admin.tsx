import { useEffect, useState, type FormEvent } from 'react';
import api from '../api/client';
import type { Category, Order, Product, User } from '../types';

type Tab = 'products' | 'users' | 'orders';

export default function Admin() {
  const [tab, setTab] = useState<Tab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    categoryId: '',
    stock: '10',
    featured: false,
  });

  async function refresh() {
    const [p, c, u, o] = await Promise.all([
      api.get('/products'),
      api.get('/products/categories'),
      api.get('/users'),
      api.get('/orders'),
    ]);
    setProducts(p.data.products);
    setCategories(c.data.categories);
    setUsers(u.data.users);
    setOrders(o.data.orders);
  }

  useEffect(() => {
    refresh().catch(() => setMessage('Failed to load admin data'));
  }, []);

  async function createProduct(e: FormEvent) {
    e.preventDefault();
    await api.post('/products', {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: form.categoryId || null,
    });
    setForm({
      name: '',
      description: '',
      price: '',
      imageUrl: '',
      categoryId: '',
      stock: '10',
      featured: false,
    });
    setMessage('Product created');
    await refresh();
  }

  async function deleteProduct(id: string) {
    await api.delete(`/products/${id}`);
    setMessage('Product deleted');
    await refresh();
  }

  async function updateRole(id: string, role: string) {
    await api.patch(`/users/${id}/role`, { role });
    setMessage('Role updated');
    await refresh();
  }

  async function deleteUser(id: string) {
    await api.delete(`/users/${id}`);
    setMessage('User deleted');
    await refresh();
  }

  async function updateOrderStatus(id: string, status: string) {
    await api.patch(`/orders/${id}/status`, { status });
    setMessage('Order status updated');
    await refresh();
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <h2>Admin</h2>
            <p>Manage products, users, and orders.</p>
          </div>
        </div>

        <div className="tabs">
          {(['products', 'users', 'orders'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              className={tab === t ? 'active' : ''}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {message && <p className="success">{message}</p>}

        {tab === 'products' && (
          <>
            <form className="panel wide form-stack" onSubmit={createProduct}>
              <h3>Add product</h3>
              <label>
                Name
                <input
                  className="input"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
              <label>
                Description
                <textarea
                  className="textarea"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </label>
              <label>
                Price
                <input
                  className="input"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </label>
              <label>
                Image URL
                <input
                  className="input"
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm({ ...form, imageUrl: e.target.value })
                  }
                />
              </label>
              <label>
                Category
                <select
                  className="select"
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm({ ...form, categoryId: e.target.value })
                  }
                >
                  <option value="">Select…</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Stock
                <input
                  className="input"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm({ ...form, featured: e.target.checked })
                  }
                />
                Featured
              </label>
              <button className="btn btn-primary" type="submit">
                Create product
              </button>
            </form>

            <div className="table-wrap panel wide" style={{ marginTop: '1rem' }}>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>${p.price.toFixed(2)}</td>
                      <td>{p.stock}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteProduct(p.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'users' && (
          <div className="table-wrap panel wide">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <select
                        className="select"
                        value={u.role}
                        onChange={(e) => updateRole(u.id, e.target.value)}
                      >
                        <option value="customer">customer</option>
                        <option value="moderator">moderator</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteUser(u.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'orders' && (
          <div className="table-wrap panel wide">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.user?.name || o.userId.slice(0, 8)}</td>
                    <td>${o.total.toFixed(2)}</td>
                    <td>
                      <select
                        className="select"
                        value={o.status}
                        onChange={(e) =>
                          updateOrderStatus(o.id, e.target.value)
                        }
                      >
                        {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(
                          (s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          )
                        )}
                      </select>
                    </td>
                    <td>{o.shippingAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
