import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { addProperty } from '../services/api';

const INITIAL = {
  title: '', description: '', price: '',
  location: '', city: '', state: '',
  area: '', bedrooms: '', bathrooms: '',
  type: 'APARTMENT', listingType: 'SELL',
  imageUrl: '', featured: false,
};

const CITIES = ['Mumbai', 'Bangalore', 'Delhi', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Surat'];
const STATES = ['Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu', 'Telangana', 'Gujarat', 'West Bengal', 'Rajasthan'];

function StepIndicator({ step, currentStep, label }) {
  const done = currentStep > step;
  const active = currentStep === step;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
        background: done ? 'var(--green)' : active ? 'var(--gold)' : 'var(--border)',
        color: done || active ? 'white' : 'var(--mid)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.8125rem', fontWeight: 600,
        transition: 'var(--transition)',
      }}>
        {done ? '✓' : step}
      </div>
      <span style={{
        fontSize: '0.875rem',
        color: active ? 'var(--charcoal)' : done ? 'var(--green)' : 'var(--light)',
        fontWeight: active ? 500 : 400,
      }}>
        {label}
      </span>
    </div>
  );
}

export default function AddPropertyPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        area: form.area ? parseFloat(form.area) : null,
        bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
        bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null,
      };
      await addProperty(payload);
      navigate('/seller-dashboard', { state: { success: 'Property listed successfully!' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add property. Please try again.');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const STEPS = ['Basic Info', 'Details', 'Pricing & Media'];

  return (
    <div className="page">
      <Navbar />

      <div style={{ background: 'var(--charcoal)', padding: '40px 0 32px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <Link to="/seller-dashboard" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.875rem' }}>
              ← Dashboard
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>Add Property</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', color: 'white', fontWeight: 300 }}>
            List a New Property
          </h1>

          {/* Step indicators */}
          <div style={{ display: 'flex', gap: 32, marginTop: 24, alignItems: 'center' }}>
            {STEPS.map((label, i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                <StepIndicator step={i + 1} currentStep={step} label={label} />
                {i < STEPS.length - 1 && (
                  <div style={{ width: 40, height: 1, background: step > i + 1 ? 'var(--green)' : 'rgba(255,255,255,0.15)', margin: '0 8px' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '48px 48px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {error && <div className="alert alert-error" style={{ marginBottom: 24 }}>{error}</div>}

          {/* ── STEP 1: Basic Info ── */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '32px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 24 }}>Basic Information</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                  <div className="form-group">
                    <label className="form-label">Property Title *</label>
                    <input className="form-input" placeholder="e.g. Spacious 3BHK in Koramangala" value={form.title} onChange={e => set('title', e.target.value)} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="form-input" rows={4} placeholder="Describe the property — highlights, nearby amenities, special features..." value={form.description} onChange={e => set('description', e.target.value)} style={{ resize: 'vertical', lineHeight: 1.6 }} />
                  </div>

                  {/* Type + Listing Type */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">Property Type *</label>
                      <select className="form-input form-select" value={form.type} onChange={e => set('type', e.target.value)}>
                        <option value="APARTMENT">Apartment</option>
                        <option value="VILLA">Villa</option>
                        <option value="PLOT">Plot</option>
                        <option value="COMMERCIAL">Commercial</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Listing For *</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                        {['BUY', 'SELL', 'RENT'].map(lt => (
                          <button type="button" key={lt} onClick={() => set('listingType', lt)} style={{
                            padding: '11px 8px', border: `2px solid ${form.listingType === lt ? 'var(--gold)' : 'var(--border)'}`,
                            borderRadius: 'var(--radius-sm)', background: form.listingType === lt ? 'var(--gold-pale)' : 'white',
                            cursor: 'pointer', fontSize: '0.875rem', fontWeight: form.listingType === lt ? 600 : 400,
                            color: form.listingType === lt ? 'var(--gold)' : 'var(--mid)', transition: 'var(--transition)',
                            fontFamily: 'var(--font-body)',
                          }}>
                            {lt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" disabled={!form.title} onClick={() => setStep(2)}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Details ── */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '32px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 24 }}>Property Details</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                  <div className="form-group">
                    <label className="form-label">Address / Locality *</label>
                    <input className="form-input" placeholder="e.g. 42 MG Road, Koramangala" value={form.location} onChange={e => set('location', e.target.value)} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">City *</label>
                      <select className="form-input form-select" value={form.city} onChange={e => set('city', e.target.value)}>
                        <option value="">Select City</option>
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">State *</label>
                      <select className="form-input form-select" value={form.state} onChange={e => set('state', e.target.value)}>
                        <option value="">Select State</option>
                        {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">Area (sq. ft)</label>
                      <input type="number" className="form-input" placeholder="e.g. 1200" value={form.area} onChange={e => set('area', e.target.value)} min="0" />
                    </div>
                    {form.type !== 'PLOT' && form.type !== 'COMMERCIAL' && (
                      <>
                        <div className="form-group">
                          <label className="form-label">Bedrooms</label>
                          <input type="number" className="form-input" placeholder="e.g. 3" value={form.bedrooms} onChange={e => set('bedrooms', e.target.value)} min="0" max="20" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Bathrooms</label>
                          <input type="number" className="form-input" placeholder="e.g. 2" value={form.bathrooms} onChange={e => set('bathrooms', e.target.value)} min="0" max="20" />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-primary" disabled={!form.city} onClick={() => setStep(3)}>Continue →</button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Price + Media ── */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '32px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 24 }}>Pricing & Media</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                  <div className="form-group">
                    <label className="form-label">Asking Price (₹) *</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--mid)', fontWeight: 500 }}>₹</span>
                      <input type="number" className="form-input" style={{ paddingLeft: 32 }} placeholder="e.g. 7500000" value={form.price} onChange={e => set('price', e.target.value)} min="0" required />
                    </div>
                    {form.price && (
                      <p style={{ fontSize: '0.8125rem', color: 'var(--gold)', marginTop: 4 }}>
                        = {form.price >= 10000000
                          ? `₹${(form.price / 10000000).toFixed(2)} Crore`
                          : form.price >= 100000
                          ? `₹${(form.price / 100000).toFixed(1)} Lakh`
                          : `₹${parseInt(form.price).toLocaleString()}`}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Property Image URL</label>
                    <input className="form-input" placeholder="https://example.com/image.jpg" value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} />
                    {form.imageUrl && (
                      <div style={{ marginTop: 8, borderRadius: 'var(--radius-sm)', overflow: 'hidden', height: 160 }}>
                        <img src={form.imageUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={e => { e.target.style.display = 'none'; }} />
                      </div>
                    )}
                  </div>

                  {/* Featured toggle */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: form.featured ? 'var(--gold-pale)' : 'var(--cream)',
                    border: `1.5px solid ${form.featured ? 'var(--gold)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-sm)', padding: '16px 20px',
                    transition: 'var(--transition)',
                  }}>
                    <div>
                      <div style={{ fontWeight: 500, marginBottom: 2 }}>★ Featured Listing</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--mid)' }}>Appear at the top of search results</div>
                    </div>
                    <button type="button" onClick={() => set('featured', !form.featured)} style={{
                      width: 48, height: 28, borderRadius: 100, border: 'none', cursor: 'pointer',
                      background: form.featured ? 'var(--gold)' : 'var(--border)',
                      position: 'relative', transition: 'var(--transition)',
                    }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%', background: 'white',
                        position: 'absolute', top: 4, left: form.featured ? 24 : 4,
                        transition: 'var(--transition)', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Summary preview */}
              <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 24px' }}>
                <h3 style={{ fontSize: '0.875rem', color: 'var(--mid)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Listing Summary</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  {[
                    { label: 'Title', val: form.title },
                    { label: 'City', val: form.city },
                    { label: 'Type', val: `${form.type} · ${form.listingType}` },
                    { label: 'Price', val: form.price ? `₹${parseInt(form.price).toLocaleString()}` : '—' },
                    { label: 'Area', val: form.area ? `${form.area} sq.ft` : '—' },
                    { label: 'Bedrooms', val: form.bedrooms || '—' },
                  ].map(item => (
                    <div key={item.label}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--light)', marginBottom: 2 }}>{item.label}</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
                <button
                  className="btn btn-gold"
                  disabled={!form.price || loading}
                  onClick={handleSubmit}
                  style={{ minWidth: 160, justifyContent: 'center' }}
                >
                  {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Publishing...</> : '🏠 Publish Listing'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
