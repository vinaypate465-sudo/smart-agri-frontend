import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { errMsg, money } from '../api';
import { useCart } from '../context/CartContext.jsx';

export default function Cart() {
  const { items, setQty, remove, clear, total } = useCart();
  const [address, setAddress] = useState('');
  const [method, setMethod] = useState('COD');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const place = async (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      await api.post('/orders', {
        address, paymentMethod: method,
        items: items.map((i) => ({ productId: i.product.id, quantity: Number(i.qty) })),
      });
      clear();
      nav('/orders');
    } catch (err) { setError(errMsg(err)); } finally { setBusy(false); }
  };

  if (items.length === 0) return <div className="page"><h2>Your cart</h2><p className="muted">Your cart is empty.</p></div>;

  return (
    <div className="page">
      <h2>Your cart</h2>
      {error && <div className="alert">{error}</div>}
      <div className="card table-wrap">
        <table>
          <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr></thead>
          <tbody>
            {items.map(({ product: p, qty }) => (
              <tr key={p.id}>
                <td>{p.name}<br /><small className="muted">by {p.farmer?.name}</small></td>
                <td>{money(p.price)} / {p.unit}</td>
                <td><input type="number" className="qty" min="0.1" max={p.quantity} step="any" value={qty}
                  onChange={(e) => setQty(p.id, Math.min(Number(e.target.value), p.quantity))} /></td>
                <td>{money(p.price * qty)}</td>
                <td><button className="btn small danger" onClick={() => remove(p.id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3 className="total">Total: {money(total)}</h3>
      </div>

      <form className="card" onSubmit={place}>
        <h3>Checkout</h3>
        <label>Delivery address<textarea required rows={3} value={address} onChange={(e) => setAddress(e.target.value)} /></label>
        <label>Payment method
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="COD">Cash on Delivery</option>
            <option value="ONLINE">Online payment (simulated)</option>
          </select>
        </label>
        <button className="btn" disabled={busy}>{busy ? 'Placing…' : `Place order · ${money(total)}`}</button>
      </form>
    </div>
  );
}
