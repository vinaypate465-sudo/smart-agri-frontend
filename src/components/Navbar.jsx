import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const LINKS = {
  FARMER: [
    ['/dashboard', 'Dashboard'], ['/farms', 'Farms'], ['/crops', 'Crops'], ['/expenses', 'Expenses'],
    ['/advisory', 'Advisory'], ['/my-products', 'My Products'], ['/orders', 'Orders'], ['/market', 'Marketplace'],
  ],
  CUSTOMER: [['/market', 'Marketplace'], ['/orders', 'My Orders']],
  ADMIN: [['/admin', 'Admin Panel'], ['/market', 'Marketplace']],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const nav = useNavigate();

  return (
    <header className="navbar">
      <Link to="/" className="brand">🌱 SmartAgri</Link>
      <nav>
        {user ? (
          <>
            {LINKS[user.role].map(([to, label]) => (
              <NavLink key={to} to={to}>{label}</NavLink>
            ))}
            {user.role === 'CUSTOMER' && <NavLink to="/cart">Cart ({items.length})</NavLink>}
            <span className="who">{user.name} · {user.role}</span>
            <button className="btn small" onClick={() => { logout(); nav('/login'); }}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/market">Marketplace</NavLink>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
