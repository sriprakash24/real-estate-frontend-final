import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import { searchProperties, getAllProperties } from '../services/api';

const CITIES = ['Mumbai', 'Bangalore', 'Delhi', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];

export default function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [listingType, setListingType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchProperties = async (params = {}) => {
    setLoading(true);
    setError('');
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined)
      );
      let res;
      if (Object.keys(cleanParams).length > 0) {
        res = await searchProperties(cleanParams);
      } else {
        res = await getAllProperties();
      }
      setProperties(res.data);
    } catch {
      setError('Failed to load properties. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties({ city, type, minPrice: minPrice || undefined, maxPrice: maxPrice || undefined });
  }, []);

  const handleSearch = (e) => {
    e?.preventDefault();
    const params = { city, type, minPrice: minPrice || undefined, maxPrice: maxPrice || undefined };
    setSearchParams(Object.fromEntries(Object.entries(params).filter(([, v]) => v)));
    fetchProperties(params);
  };

  const handleReset = () => {
    setCity(''); setType(''); setListingType(''); setMinPrice(''); setMaxPrice('');
    setSearchParams({});
    fetchProperties({});
  };

  return (
    <div className="page">
      <Navbar />

      {/* Page Header */}
      <div style={{ background: 'var(--charcoal)', padding: '48px 0 0' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.75rem', color: 'white', fontWeight: 300, marginBottom: 8 }}>
            Find Your Property
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 32 }}>
            {loading ? 'Loading...' : `${properties.length} properties available`}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch}>
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 'var(--radius)',
              padding: '20px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
              gap: 12,
              alignItems: 'end',
            }}>
              <div className="form-group">
                <label className="form-label" style={{ color: 'rgba(255,255,255,0.5)' }}>City</label>
                <select className="form-input form-select" value={city} onChange={e => setCity(e.target.value)}>
                  <option value="">All Cities</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: 'rgba(255,255,255,0.5)' }}>Type</label>
                <select className="form-input form-select" value={type} onChange={e => setType(e.target.value)}>
                  <option value="">All Types</option>
                  <option value="APARTMENT">Apartment</option>
                  <option value="VILLA">Villa</option>
                  <option value="PLOT">Plot</option>
                  <option value="COMMERCIAL">Commercial</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: 'rgba(255,255,255,0.5)' }}>Min Price (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 500000"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: 'rgba(255,255,255,0.5)' }}>Max Price (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 10000000"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit" className="btn btn-gold">Search</button>
                <button type="button" className="btn btn-ghost" style={{ color: 'rgba(255,255,255,0.5)' }} onClick={handleReset}>
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Tabs for listing type */}
        <div className="container" style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            {['', 'BUY', 'SELL', 'RENT'].map(lt => (
              <button
                key={lt}
                onClick={() => setListingType(lt)}
                style={{
                  padding: '12px 24px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-body)',
                  color: listingType === lt ? 'var(--gold)' : 'rgba(255,255,255,0.4)',
                  borderBottom: `2px solid ${listingType === lt ? 'var(--gold)' : 'transparent'}`,
                  transition: 'var(--transition)',
                  fontWeight: listingType === lt ? 500 : 400,
                }}
              >
                {lt === '' ? 'All' : lt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container" style={{ padding: '48px 48px' }}>
        {error && <div className="alert alert-error" style={{ marginBottom: 24 }}>{error}</div>}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px', gap: 12, color: 'var(--mid)' }}>
            <span className="spinner spinner-dark" />
            Loading properties...
          </div>
        ) : properties.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🏠</div>
            <h3>No Properties Found</h3>
            <p>Try adjusting your filters or reset to see all properties.</p>
            <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={handleReset}>
              View All Properties
            </button>
          </div>
        ) : (
          <>
            <div className="property-grid">
              {properties
                .filter(p => !listingType || p.listingType === listingType)
                .map((p, i) => (
                  <PropertyCard key={p.id} property={p} index={i} />
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
