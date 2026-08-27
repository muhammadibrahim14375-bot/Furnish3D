import { useEffect, useState } from 'react';
import api from '../api/client';
import type { Product, Review } from '../types';

export default function Moderator() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
  });

  async function refresh() {
    const [r, p] = await Promise.all([
      api.get('/reviews', { params: { status: 'pending' } }),
      api.get('/products'),
    ]);
    setReviews(r.data.reviews);
    setProducts(p.data.products);
  }

  useEffect(() => {
    refresh().catch(() => setMessage('Failed to load moderation data'));
  }, []);

  async function setReviewStatus(id: string, status: string) {
    await api.patch(`/reviews/${id}`, { status });
    setMessage(`Review ${status}`);
    await refresh();
  }

  function startEdit(product: Product) {
    setEditId(product.id);
    setEditForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
    });
  }

  async function saveProduct() {
    if (!editId) return;
    await api.put(`/products/${editId}`, {
      name: editForm.name,
      description: editForm.description,
      price: Number(editForm.price),
      stock: Number(editForm.stock),
    });
    setEditId(null);
    setMessage('Product updated');
    await refresh();
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <h2>Moderator</h2>
            <p>Approve reviews and edit product listings.</p>
          </div>
        </div>

        {message && <p className="success">{message}</p>}

        <div className="panel wide">
          <h3>Pending reviews</h3>
          {reviews.length === 0 ? (
            <p className="muted">No pending reviews.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>User</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((r) => (
                    <tr key={r.id}>
                      <td>{r.product?.name}</td>
                      <td>{r.user?.name}</td>
                      <td>{r.rating}★</td>
                      <td>{r.comment}</td>
                      <td style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => setReviewStatus(r.id, 'approved')}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => setReviewStatus(r.id, 'rejected')}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="panel wide" style={{ marginTop: '1rem' }}>
          <h3>Edit products</h3>
          <div className="table-wrap">
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
                    <td>
                      {editId === p.id ? (
                        <input
                          className="input"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                        />
                      ) : (
                        p.name
                      )}
                    </td>
                    <td>
                      {editId === p.id ? (
                        <input
                          className="input"
                          type="number"
                          value={editForm.price}
                          onChange={(e) =>
                            setEditForm({ ...editForm, price: e.target.value })
                          }
                        />
                      ) : (
                        `$${p.price.toFixed(2)}`
                      )}
                    </td>
                    <td>
                      {editId === p.id ? (
                        <input
                          className="input"
                          type="number"
                          value={editForm.stock}
                          onChange={(e) =>
                            setEditForm({ ...editForm, stock: e.target.value })
                          }
                        />
                      ) : (
                        p.stock
                      )}
                    </td>
                    <td>
                      {editId === p.id ? (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={saveProduct}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => startEdit(p)}
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {editId && (
            <label style={{ display: 'block', marginTop: '1rem' }}>
              Description
              <textarea
                className="textarea"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
              />
            </label>
          )}
        </div>
      </div>
    </section>
  );
}
