import { Link } from 'react-router-dom';

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
];

function formatPrice(price) {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
  return `₹${price?.toLocaleString()}`;
}

export default function PropertyCard({ property, index = 0 }) {
  const image = property.imageUrl || PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];

  return (
    <Link to={`/properties/${property.id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ cursor: 'pointer' }}>
        {/* Image */}
        <div style={{ position: 'relative', overflow: 'hidden', height: 220 }}>
          <img
            src={image}
            alt={property.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            onMouseOver={e => e.target.style.transform = 'scale(1.04)'}
            onMouseOut={e => e.target.style.transform = 'scale(1)'}
          />
          <div style={{
            position: 'absolute', top: 12, left: 12,
            display: 'flex', gap: 6
          }}>
            {property.featured && <span className="badge badge-gold">★ Featured</span>}
            <span className="badge badge-dark">{property.listingType}</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '20px' }}>
          <div style={{ marginBottom: 4 }}>
            <span className="badge badge-green" style={{ marginBottom: 8, display: 'inline-flex' }}>
              {property.type}
            </span>
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 400, marginBottom: 4, color: 'var(--charcoal)' }}>
            {property.title}
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--mid)', marginBottom: 14 }}>
            📍 {property.city}, {property.state}
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
            {property.bedrooms && (
              <span style={{ fontSize: '0.8125rem', color: 'var(--mid)' }}>
                🛏 {property.bedrooms} Beds
              </span>
            )}
            {property.bathrooms && (
              <span style={{ fontSize: '0.8125rem', color: 'var(--mid)' }}>
                🚿 {property.bathrooms} Baths
              </span>
            )}
            {property.area && (
              <span style={{ fontSize: '0.8125rem', color: 'var(--mid)' }}>
                📐 {property.area} sq.ft
              </span>
            )}
          </div>

          {/* Price */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--charcoal)' }}>
              {formatPrice(property.price)}
            </span>
            <span style={{
              fontSize: '0.8125rem', color: 'var(--gold)', fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 4
            }}>
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
