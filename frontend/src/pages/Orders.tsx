import { useEffect, useState } from 'react';
import api from '../api/client';
import type { Order } from '../types';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/orders/mine')
      .then((res) => setOrders(res.data.orders))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <h2>Order history</h2>
            <p>Track your Furnish3D purchases.</p>
          </div>
        </div>

        {loading ? (
          <p className="muted">Loading orders…</p>
        ) : orders.length === 0 ? (
          <div className="empty">No orders yet.</div>
        ) : (
          <div className="cart-list">
            {orders.map((order) => (
              <div key={order.id} className="panel" style={{ width: '100%', margin: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <div>
                    <strong>Order {order.id.slice(0, 8)}</strong>
                    <div className="muted">
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="badge">{order.status}</span>
                    <div style={{ fontWeight: 700, marginTop: '0.35rem' }}>
                      ${order.total.toFixed(2)}
                    </div>
                  </div>
                </div>
                <p className="muted">{order.shippingAddress}</p>
                <ul>
                  {order.items?.map((item) => (
                    <li key={item.id}>
                      {item.productName} × {item.quantity} — $
                      {(item.price * item.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
