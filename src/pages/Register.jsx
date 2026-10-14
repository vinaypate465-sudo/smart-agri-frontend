import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'FARMER' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/register', form);
      login(data);
      nav('/');
    } catch (err) { setError(errMsg(err)); }
  };

  return (
    <div className="auth-wrap">
      <form className="card auth" onSubmit={submit}>
        <h2>Create account</h2>
        {error && <div className="alert">{error}</div>}
        <label>Full name<input required value={form.name} onChange={set('name')} /></label>
        <label>Email<input type="email" required value={form.email} onChange={set('email')} /></label>
        <label>Phone<input value={form.phone} onChange={set('phone')} /></label>
        <label>Password (min 6)<input type="password" required minLength={6} value={form.password} onChange={set('password')} /></label>
        <label>I am a
          <select value={form.role} onChange={set('role')}>
            <option value="FARMER">Farmer</option>
            <option value="CUSTOMER">Customer</option>
          </select>
        </label>
        <button className="btn" type="submit">Register</button>
        <p className="muted">Already registered? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}
