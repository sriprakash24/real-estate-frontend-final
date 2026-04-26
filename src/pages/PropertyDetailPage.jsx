import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getPropertyById, submitInquiry } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80',
];

function formatPrice(price) {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Crore`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)} Lakh`;
  return `₹${price?.toLocaleString()}`;
}

export default function PropertyDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Inquiry form
  const [message, setMessage] = useState('');
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState('');
  const [inquiryError, setInquiryError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getPropertyById(id);
        setProperty(res.data);
        setMessage(`Hi, I am interested in "${res.data.title}". Please share more details.`);
      } catch {
        setError('Property not found.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleInquiry = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setInquiryLoading(true);
    setInquiryError('');
    setInquirySuccess('');
    try {
      await submitInquiry({ propertyId: property.id, message });
      setInquirySuccess('Your inquiry has been sent! The seller will contact you soon.');
    } catch (err) {
      setInquiryError(err.response?.data?.message || 'Failed to send inquiry. Please try again.');
    } finally {
      setInquiryLoading(false);
    }
  };

  if (loading) return (
    <div>
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: 12, color: 'var(--mid)' }}>
        <span className="spinner spinner-dark" /> Loading property...
      </div>
    </div>
  );

  if (error) return (
    <div>
      <Navbar />
      <div className="empty-state" style={{ paddingTop: 120 }}>
        <div style={{ fontSize: '3rem' }}>😕</div>
        <h3>{error}</h3>
        <Link to="/properties" className="btn btn-primary" style={{ marginTop: 24 }}>Back to Properties</Link>
      </div>
    </div>
  );

  const image = property.imageUrl || PLACEHOLDER_IMAGES[property.id % PLACEHOLDER_IMAGES.length];

  return (
    <div className="page">
      <Navbar />

      {/* Hero Image */}
      <div style={{ height: 480, overflow: 'hidden', position: 'relative' }}>
        <img src={image} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px 48px' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {property.featured && <span className="badge badge-gold">★ Featured</span>}
            <span className="badge badge-dark">{property.type}</span>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>{property.listingType}</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'white', fontWeight: 300 }}>
            {property.title}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: 6 }}>📍 {property.location}, {property.city}, {property.state}</p>
        </div>
        {/* Back link */}
        <Link to="/properties" style={{
          position: 'absolute', top: 24, left: 48,
          background: 'rgba(0,0,0,0.4)', color: 'white',
          padding: '8px 16px', borderRadius: 100,
          textDecoration: 'none', fontSize: '0.875rem',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          ← Back
        </Link>
      </div>

      {/* Content */}
      <div className="container" style={{ padding: '48px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 48, alignItems: 'start' }}>

          {/* Left */}
          <div>
            {/* Price + Stats */}
            <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: '28px', border: '1px solid var(--border)', marginBottom: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--mid)', marginBottom: 4 }}>ASKING PRICE</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 600, color: 'var(--charcoal)' }}>
                    {formatPrice(property.price)}
                  </div>
                </div>
                {property.area && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--mid)', marginBottom: 4 }}>PRICE / SQ.FT</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--charcoal)' }}>
                      ₹{Math.round(property.price / property.area).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {[
                  { icon: '🛏', label: 'Bedrooms', value: property.bedrooms || '—' },
                  { icon: '🚿', label: 'Bathrooms', value: property.bathrooms || '—' },
                  { icon: '📐', label: 'Area (sq.ft)', value: property.area || '—' },
                  { icon: '🏠', label: 'Type', value: property.type },
                ].map(stat => (
                  <div key={stat.label} style={{ textAlign: 'center', padding: '16px 8px', background: 'var(--cream)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{stat.icon}</div>
                    <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--charcoal)' }}>{stat.value}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--mid)', marginTop: 2 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: 16 }}>About This Property</h2>
                <p style={{ color: 'var(--mid)', lineHeight: 1.8, fontSize: '0.9375rem' }}>{property.description}</p>
              </div>
            )}

            {/* Location */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: 16 }}>Location Details</h2>
              <div style={{ background: 'var(--cream)', padding: '20px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--mid)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Address</span>
                    <p style={{ marginTop: 4, color: 'var(--charcoal)', fontWeight: 500 }}>{property.location || '—'}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--mid)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>City</span>
                    <p style={{ marginTop: 4, color: 'var(--charcoal)', fontWeight: 500 }}>{property.city}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--mid)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>State</span>
                    <p style={{ marginTop: 4, color: 'var(--charcoal)', fontWeight: 500 }}>{property.state}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Inquiry Panel */}
          <div style={{ position: 'sticky', top: 88 }}>
            <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: '28px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 6 }}>
                Interested in this property?
              </h3>
              <p style={{ color: 'var(--mid)', fontSize: '0.875rem', marginBottom: 24 }}>
                Send a message to the seller and they'll get back to you.
              </p>

              {inquirySuccess ? (
                <div className="alert alert-success">
                  ✅ {inquirySuccess}
                  <div style={{ marginTop: 16 }}>
                    <Link to="/my-inquiries" style={{ color: 'var(--green)', fontWeight: 500, textDecoration: 'none', fontSize: '0.875rem' }}>
                      View My Inquiries →
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleInquiry} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {inquiryError && <div className="alert alert-error">{inquiryError}</div>}

                  {user ? (
                    <>
                      <div style={{ background: 'var(--cream)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', display: 'flex', gap: 10, alignItems: 'center' }}>
                        <div className="nav-avatar" style={{ width: 36, height: 36, fontSize: '0.9rem' }}>
                          {user.name?.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--mid)' }}>{user.email}</div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Your Message</label>
                        <textarea
                          className="form-input"
                          rows={5}
                          value={message}
                          onChange={e => setMessage(e.target.value)}
                          style={{ resize: 'vertical', lineHeight: 1.6 }}
                          required
                        />
                      </div>

                      <button type="submit" className="btn btn-gold" disabled={inquiryLoading} style={{ justifyContent: 'center', padding: '14px' }}>
                        {inquiryLoading ? <span className="spinner" /> : '📩 Send Inquiry'}
                      </button>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '16px 0' }}>
                      <p style={{ color: 'var(--mid)', marginBottom: 16, fontSize: '0.875rem' }}>
                        Sign in to send an inquiry to the seller.
                      </p>
                      <Link to="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                        Sign In to Inquire
                      </Link>
                      <p style={{ marginTop: 12, fontSize: '0.8125rem', color: 'var(--light)' }}>
                        No account?{' '}
                        <Link to="/register" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Register free</Link>
                      </p>
                    </div>
                  )}
                </form>
              )}

              {/* Seller info */}
              {property.owner && (
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--mid)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Listed by</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="nav-avatar">
                      {property.owner.name?.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{property.owner.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--mid)' }}>{property.owner.role}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
