import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate('/shop');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Registration failed';
      setError(msg);
    }
  }

  return (
    <form className="auth-card form-stack" onSubmit={onSubmit}>
      <h2>Create account</h2>
      <p className="muted">Join Furnish3D as a customer.</p>
      <label>
        Name
        <input
          className="input"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
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
          minLength={6}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      {error && <p className="error">{error}</p>}
      <button className="btn btn-primary" type="submit">
        Register
      </button>
      <p className="muted">
        Already registered? <Link to="/login">Login</Link>
      </p>
    </form>
  );
}
