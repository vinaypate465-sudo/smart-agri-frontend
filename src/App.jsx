import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Farms from './pages/Farms.jsx';
import Crops from './pages/Crops.jsx';
import Expenses from './pages/Expenses.jsx';
import Advisory from './pages/Advisory.jsx';
import MyProducts from './pages/MyProducts.jsx';
import Marketplace from './pages/Marketplace.jsx';
import Cart from './pages/Cart.jsx';
import Orders from './pages/Orders.jsx';
import Admin from './pages/Admin.jsx';

const HOME = { FARMER: '/dashboard', CUSTOMER: '/market', ADMIN: '/admin' };

export default function App() {
  const { user } = useAuth();
  const F = ['FARMER'];
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to={user ? HOME[user.role] : '/market'} replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/market" element={<Marketplace />} />
        <Route path="/dashboard" element={<ProtectedRoute roles={F}><Dashboard /></ProtectedRoute>} />
        <Route path="/farms" element={<ProtectedRoute roles={F}><Farms /></ProtectedRoute>} />
        <Route path="/crops" element={<ProtectedRoute roles={F}><Crops /></ProtectedRoute>} />
        <Route path="/expenses" element={<ProtectedRoute roles={F}><Expenses /></ProtectedRoute>} />
        <Route path="/advisory" element={<ProtectedRoute roles={F}><Advisory /></ProtectedRoute>} />
        <Route path="/my-products" element={<ProtectedRoute roles={F}><MyProducts /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute roles={['FARMER', 'CUSTOMER']}><Orders /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute roles={['CUSTOMER']}><Cart /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><Admin /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
