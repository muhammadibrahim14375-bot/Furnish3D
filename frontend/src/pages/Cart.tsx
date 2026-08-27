import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import type { CartItem } from '../types';

export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data } = await api.get('/cart');
    setItems(data.items);
    setTotal(data.total);
    setLoading(false);
  }

  useEffect(() => {
    load().catch(() => {
      setError('Could not load cart');
      setLoading(false);
    });
  }, []);

  async function updateQty(id: string, quantity: number) {
    await api.patch(`/cart/${id}`, { quantity });
    await load();
  }

  async function removeItem(id: string) {
    await api.delete(`/cart/${id}`);
    await load();
  }

  async function checkout(e: FormEvent) {
    e.preventDefault();
    try {
      await api.post('/orders', { shippingAddress: address });
      navigate('/orders');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Checkout failed';
      setError(msg);
    }
  }

  if (loading) {
    return (
      <div className="container section">
        <p className="muted">Loading cart…</p>
      </div>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <h2>Your cart</h2>
            <p>Review items before checkout.</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="empty">
            Cart is empty. <Link to="/shop">Continue shopping</Link>
          </div>
        ) : (
          <>
            <div className="cart-list">
              {items.map((item) => (
                <div key={item.id} className="cart-row">
                  <img
                    src={item.product?.imageUrl}
                    alt={item.product?.name}
                  />
                  <div>
                    <strong>{item.product?.name}</strong>
                    <div className="muted">
                      ${item.product?.price.toFixed(2)} each
                    </div>
                    <div className="qty-controls" style={{ marginTop: '0.5rem' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() =>
                          updateQty(item.id, Math.max(1, item.quantity - 1))
                        }
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="actions">
                    <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>
                      $
                      {((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </div>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <form
              className="panel"
              onSubmit={checkout}
              style={{ marginTop: '2rem', marginLeft: 0 }}
            >
              <h3>Checkout</h3>
              <p>
                Total: <strong>${total.toFixed(2)}</strong>
              </p>
              <label>
                Shipping address
                <textarea
                  className="textarea"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, city, postal code"
                />
              </label>
              {error && <p className="error">{error}</p>}
              <button type="submit" className="btn btn-primary">
                Place order
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
