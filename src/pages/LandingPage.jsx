import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const STATS = [
  { number: '12,000+', label: 'Properties Listed' },
  { number: '8,500+', label: 'Happy Buyers' },
  { number: '120+', label: 'Cities Covered' },
  { number: '₹4,200 Cr+', label: 'Worth Transacted' },
];

const CITIES = ['Mumbai', 'Bangalore', 'Delhi', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];

export default function LandingPage() {
  const [searchCity, setSearchCity] = useState('');
  const [searchType, setSearchType] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCity) params.set('city', searchCity);
    if (searchType) params.set('type', searchType);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section style={{
        minHeight: '90vh',
        background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 50%, #3A3A3C 100%)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(184,149,90,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(184,149,90,0.08) 0%, transparent 50%)',
        }} />
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 720 }}>
            <div style={{ marginBottom: 20 }} className="fade-up">
              <span className="badge badge-gold" style={{ fontSize: '0.8125rem' }}>
                🏡 India's Premium Property Platform
              </span>
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 7vw, 5.5rem)',
              fontWeight: 300,
              color: 'white',
              lineHeight: 1.1,
              marginBottom: 24,
            }} className="fade-up-1">
              Find Your<br />
              <em style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>Dream Home</em>
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.6)', marginBottom: 48, maxWidth: 520, fontWeight: 300 }} className="fade-up-2">
              Discover curated properties across India. From luxury villas to cozy apartments — your perfect space awaits.
            </p>

            {/* Search Card */}
            <div style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
              maxWidth: 680,
            }} className="fade-up-3">
              <form onSubmit={handleSearch}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'end' }}>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <select
                      className="form-input form-select"
                      value={searchCity}
                      onChange={e => setSearchCity(e.target.value)}
                    >
                      <option value="">All Cities</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Property Type</label>
                    <select
                      className="form-input form-select"
                      value={searchType}
                      onChange={e => setSearchType(e.target.value)}
                    >
                      <option value="">All Types</option>
                      <option value="APARTMENT">Apartment</option>
                      <option value="VILLA">Villa</option>
                      <option value="PLOT">Plot</option>
                      <option value="COMMERCIAL">Commercial</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-gold" style={{ height: 48 }}>
                    Search →
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'var(--gold)', padding: '32px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {STATS.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 600, color: 'white' }}>
                  {s.number}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by City */}
      <section style={{ padding: '80px 0', background: 'var(--cream)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: 8 }}>Browse by City</h2>
            <p style={{ color: 'var(--mid)' }}>Find properties in your preferred location</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            {CITIES.map(city => (
              <button
                key={city}
                className="btn btn-outline"
                onClick={() => navigate(`/properties?city=${city}`)}
              >
                📍 {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0', background: 'var(--charcoal)', textAlign: 'center' }}>
        <div className="container-sm">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.75rem', color: 'white', marginBottom: 16, fontWeight: 300 }}>
            Ready to Find<br /><em style={{ color: 'var(--gold-light)' }}>Your Space?</em>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 32 }}>
            Join thousands of happy homeowners who found their perfect property on EstateHub.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-gold">Create Free Account</Link>
            <Link to="/properties" className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
              Browse Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
