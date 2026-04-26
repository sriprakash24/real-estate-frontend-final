import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register } from '../services/api';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'BUYER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await register(form);
      const { token, role, name } = res.data;
      loginUser(token, { name, role, email: form.email });
      navigate('/properties');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const ROLES = [
    { value: 'BUYER', label: '🏠 Buyer', desc: 'Looking to buy or rent' },
    { value: 'SELLER', label: '🏷️ Seller', desc: 'Want to list property' },
    { value: 'AGENT', label: '🤝 Agent', desc: 'Real estate professional' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
    }}>
      {/* Left — Decorative */}
      <div style={{
        background: 'linear-gradient(160deg, #2C2C2E 0%, var(--charcoal) 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '64px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(184,149,90,0.15) 0%, transparent 60%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'white', marginBottom: 64 }}>
              Estate<span style={{ color: 'var(--gold)' }}>Hub</span>
            </div>
          </Link>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'white', fontWeight: 300, lineHeight: 1.2, marginBottom: 24 }}>
            Join<br /><em style={{ color: 'var(--gold-light)' }}>EstateHub</em>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', maxWidth: 320, lineHeight: 1.7 }}>
            Create your free account and start your journey toward finding the perfect property.
          </p>
        </div>
      </div>

      {/* Right — Form */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
        background: 'var(--warm-white)',
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', marginBottom: 6 }}>Create Account</h1>
          <p style={{ color: 'var(--mid)', fontSize: '0.9375rem', marginBottom: 32 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
          </p>

          {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
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
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                minLength={8}
              />
            </div>

            {/* Role Selection */}
            <div className="form-group">
              <label className="form-label">I am a</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {ROLES.map(r => (
                  <button
                    type="button"
                    key={r.value}
                    onClick={() => setForm({ ...form, role: r.value })}
                    style={{
                      padding: '12px 8px',
                      border: `2px solid ${form.role === r.value ? 'var(--gold)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-sm)',
                      background: form.role === r.value ? 'var(--gold-pale)' : 'white',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'var(--transition)',
                    }}
                  >
                    <div style={{ fontSize: '1.25rem', marginBottom: 2 }}>{r.label.split(' ')[0]}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: form.role === r.value ? 'var(--gold)' : 'var(--dark)' }}>
                      {r.label.split(' ')[1]}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--mid)', marginTop: 2 }}>{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 4, justifyContent: 'center', padding: '14px' }}>
              {loading ? <span className="spinner" /> : 'Create Account →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
