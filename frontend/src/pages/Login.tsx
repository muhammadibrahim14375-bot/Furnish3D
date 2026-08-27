import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/shop';
  const [email, setEmail] = useState('customer@furnish3d.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
      navigate(from);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Login failed';
      setError(msg);
    }
  }

  return (
    <form className="auth-card form-stack" onSubmit={onSubmit}>
      <h2>Welcome back</h2>
      <p className="muted">Sign in to shop, review, and track orders.</p>
      <label>
        Email
        <input
          className="input"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password
        <input
          className="input"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      {error && <p className="error">{error}</p>}
      <button className="btn btn-primary" type="submit">
        Login
      </button>
      <p className="muted">
        No account? <Link to="/register">Register</Link>
      </p>
      <p className="muted" style={{ fontSize: '0.85rem' }}>
        Demo: customer@furnish3d.com / password123
      </p>
    </form>
  );
}
