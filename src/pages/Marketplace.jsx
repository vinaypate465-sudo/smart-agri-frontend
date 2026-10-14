import { useEffect, useState } from 'react';
import api, { errMsg, money } from '../api';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [error, setError] = useState('');
  const [added, setAdded] = useState(null);
  const { user } = useAuth();
  const { add } = useCart();

  useEffect(() => { api.get('/products').then((r) => setProducts(r.data)).catch((e) => setError(errMsg(e))); }, []);

  const cats = [...new Set(products.map((p) => p.category).filter(Boolean))];
  const shown = products.filter((p) =>
    (!cat || p.category === cat) &&
    (p.name + ' ' + (p.farmer?.name || '')).toLowerCase().includes(q.toLowerCase()));

  const addToCart = (p) => { add(p, 1); setAdded(p.id); setTimeout(() => setAdded(null), 1200); };

  return (
    <div className="page">
      <h2>Farmer Marketplace</h2>
      <p className="muted">Buy fresh produce directly from farmers — no middlemen.</p>
      {error && <div className="alert">{error}</div>}
      <div className="filters">
        <input className="search" placeholder="Search products or farmers…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">All categories</option>
          {cats.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="cards">
        {shown.length === 0 && <p className="muted">No products available.</p>}
        {shown.map((p) => (
          <div className="card product" key={p.id}>
            <span className="badge">{p.category || 'Other'}</span>
            <h3>{p.name}</h3>
            <p className="price">{money(p.price)} <small>/ {p.unit}</small></p>
            <p className="muted">{p.description}</p>
            <p className="muted">Sold by <b>{p.farmer?.name}</b> · {p.quantity} {p.unit} available</p>
            {user?.role === 'CUSTOMER' ? (
              <button className="btn" onClick={() => addToCart(p)}>{added === p.id ? 'Added ✓' : 'Add to cart'}</button>
            ) : !user ? <p className="muted">Login as a customer to buy.</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
