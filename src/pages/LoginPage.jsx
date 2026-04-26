import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/api';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(form);
      const { token, role, name } = res.data;
      loginUser(token, { name, role, email: form.email });
      // Redirect based on role
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'SELLER' || role === 'AGENT') navigate('/seller-dashboard');
      else navigate('/properties');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
    }}>
      {/* Left — Decorative */}
      <div style={{
        background: 'linear-gradient(160deg, var(--charcoal) 0%, #3A3A3C 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '64px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 30% 70%, rgba(184,149,90,0.2) 0%, transparent 60%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'white', marginBottom: 64 }}>
              Estate<span style={{ color: 'var(--gold)' }}>Hub</span>
            </div>
          </Link>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'white', fontWeight: 300, lineHeight: 1.2, marginBottom: 24 }}>
            Welcome<br /><em style={{ color: 'var(--gold-light)' }}>Back</em>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', maxWidth: 320, lineHeight: 1.7 }}>
            Sign in to browse properties, save your favourites, and connect with agents.
          </p>
          <div style={{ marginTop: 64, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {['Browse 12,000+ Properties', 'Send Inquiry in One Click', 'Track Your Inquiries'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(184,149,90,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-light)', fontSize: '0.75rem', flexShrink: 0 }}>✓</div>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9375rem' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
        background: 'var(--warm-white)',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', marginBottom: 6 }}>Sign In</h1>
          <p style={{ color: 'var(--mid)', fontSize: '0.9375rem', marginBottom: 32 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 500 }}>Register free</Link>
          </p>

          {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 4, justifyContent: 'center', padding: '14px' }}>
              {loading ? <span className="spinner" /> : 'Sign In →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
