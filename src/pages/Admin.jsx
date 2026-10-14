import { useEffect, useState } from 'react';
import api, { errMsg, money } from '../api';
import CrudPage from '../components/CrudPage.jsx';

const TABS = ['Overview', 'Users', 'Products', 'Orders', 'Content'];
const STATUSES = ['PLACED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function Admin() {
  const [tab, setTab] = useState('Overview');
  const [data, setData] = useState({ stats: null, users: [], products: [], orders: [] });
  const [error, setError] = useState('');

  const load = () =>
    Promise.all([api.get('/admin/stats'), api.get('/admin/users'), api.get('/admin/products'), api.get('/admin/orders')])
      .then(([s, u, p, o]) => setData({ stats: s.data, users: u.data, products: p.data, orders: o.data }))
      .catch((e) => setError(errMsg(e)));
  useEffect(() => { load(); }, []);

  const del = (path) => { if (window.confirm('Delete?')) api.delete(path).then(load).catch((e) => setError(errMsg(e))); };
  const setStatus = (id, status) => api.put(`/orders/${id}/status`, { status }).then(load).catch((e) => setError(errMsg(e)));

  if (tab === 'Content')
    return (
      <>
        <div className="page" style={{ paddingBottom: 0 }}>
          <h2>Admin Panel</h2>
          <div className="tabs">{TABS.map((t) => <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>)}</div>
        </div>
        <CrudPage
          title="Manage advisory content" endpoint="/admin/advisory"
          fields={[
            { key: 'type', label: 'Type', type: 'select', options: ['IRRIGATION', 'FERTILIZER', 'DISEASE', 'PRACTICE'], required: true },
            { key: 'crop', label: 'Crop', required: true },
            { key: 'title', label: 'Title', required: true },
            { key: 'content', label: 'Content', type: 'textarea' },
          ]}
          columns={[{ key: 'type', label: 'Type' }, { key: 'crop', label: 'Crop' }, { key: 'title', label: 'Title' }]}
        />
      </>
    );

  const { stats } = data;
  return (
    <div className="page">
      <h2>Admin Panel</h2>
      {error && <div className="alert">{error}</div>}
      <div className="tabs">{TABS.map((t) => <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>)}</div>

      {tab === 'Overview' && stats && (
        <div className="stats">
          <div className="stat"><span>Farmers</span><strong>{stats.farmers}</strong></div>
          <div className="stat"><span>Customers</span><strong>{stats.customers}</strong></div>
          <div className="stat"><span>Products</span><strong>{stats.products}</strong></div>
          <div className="stat"><span>Orders</span><strong>{stats.orders}</strong></div>
          <div className="stat good"><span>Total sales</span><strong>{money(stats.sales)}</strong></div>
        </div>
      )}

      {tab === 'Users' && (
        <div className="card table-wrap"><table>
          <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th></th></tr></thead>
          <tbody>{data.users.map((u) => (
            <tr key={u.id}><td>{u.id}</td><td>{u.name}</td><td>{u.email}</td><td>{u.phone}</td><td>{u.role}</td>
              <td>{u.role !== 'ADMIN' && <button className="btn small danger" onClick={() => del(`/admin/users/${u.id}`)}>Delete</button>}</td></tr>
          ))}</tbody></table></div>
      )}

      {tab === 'Products' && (
        <div className="card table-wrap"><table>
          <thead><tr><th>ID</th><th>Product</th><th>Farmer</th><th>Price</th><th>Stock</th><th></th></tr></thead>
          <tbody>{data.products.map((p) => (
            <tr key={p.id}><td>{p.id}</td><td>{p.name}</td><td>{p.farmer?.name}</td><td>{money(p.price)}/{p.unit}</td><td>{p.quantity}</td>
              <td><button className="btn small danger" onClick={() => del(`/admin/products/${p.id}`)}>Delete</button></td></tr>
          ))}</tbody></table></div>
      )}

      {tab === 'Orders' && (
        <div className="card table-wrap"><table>
          <thead><tr><th>ID</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead>
          <tbody>{data.orders.map((o) => (
            <tr key={o.id}><td>{o.id}</td><td>{o.customer?.name}</td><td>{money(o.total)}</td>
              <td>{o.paymentMethod} ({o.paymentStatus})</td>
              <td>{o.status === 'CANCELLED' ? 'CANCELLED' : (
                <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>)}</td></tr>
          ))}</tbody></table></div>
      )}
    </div>
  );
}
