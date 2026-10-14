import { useEffect, useState } from 'react';
import api, { errMsg, money } from '../api';
import { useAuth } from '../context/AuthContext.jsx';

const STATUSES = ['PLACED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function Orders() {
  const { user } = useAuth();
  const isFarmer = user.role === 'FARMER';
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  const load = () =>
    api.get(isFarmer ? '/orders/farmer' : '/orders/my').then((r) => setOrders(r.data)).catch((e) => setError(errMsg(e)));
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const setStatus = (id, status) =>
    api.put(`/orders/${id}/status`, { status }).then(load).catch((e) => setError(errMsg(e)));
  const cancel = (id) => api.put(`/orders/${id}/cancel`).then(load).catch((e) => setError(errMsg(e)));

  return (
    <div className="page">
      <h2>{isFarmer ? 'Orders for my products' : 'My orders'}</h2>
      {error && <div className="alert">{error}</div>}
      {orders.length === 0 && <p className="muted">No orders yet.</p>}
      {orders.map((o) => (
        <div className="card" key={o.id}>
          <div className="order-head">
            <b>Order #{o.id}</b>
            <span className={`pill ${o.status.toLowerCase()}`}>{o.status}</span>
            <span className="muted">{new Date(o.createdAt).toLocaleString()}</span>
          </div>
          <ul>
            {o.items.map((i) => (
              <li key={i.id}>
                {i.product.name} — {i.quantity} {i.product.unit} × {money(i.price)}
                {isFarmer && <small className="muted"> (seller: {i.product.farmer?.name})</small>}
              </li>
            ))}
          </ul>
          <p>Total: <b>{money(o.total)}</b> · Payment: {o.paymentMethod} ({o.paymentStatus})</p>
          <p className="muted">
            Deliver to: {o.address}
            {isFarmer && <> · Customer: {o.customer?.name} {o.customer?.phone && `(${o.customer.phone})`}</>}
          </p>
          {isFarmer && o.status !== 'CANCELLED' && (
            <label className="inline">Update status:{' '}
              <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value)}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
          )}
          {!isFarmer && o.status === 'PLACED' && <button className="btn small danger" onClick={() => cancel(o.id)}>Cancel order</button>}
        </div>
      ))}
    </div>
  );
}
