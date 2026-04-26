import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getBuyerInquiries } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS_STYLES = {
  PENDING: { bg: '#FEF9EC', color: '#B45309', label: '⏳ Pending' },
  CONTACTED: { bg: '#F0FDF4', color: '#15803D', label: '✅ Contacted' },
  REJECTED: { bg: '#FEF2F2', color: '#B91C1C', label: '❌ Rejected' },
};

function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function MyInquiriesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const fetch = async () => {
      try {
        const res = await getBuyerInquiries();
        setInquiries(res.data);
      } catch {
        setError('Failed to load inquiries.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user, navigate]);

  const counts = {
    all: inquiries.length,
    pending: inquiries.filter(i => i.status === 'PENDING').length,
    contacted: inquiries.filter(i => i.status === 'CONTACTED').length,
    rejected: inquiries.filter(i => i.status === 'REJECTED').length,
  };

  return (
    <div className="page">
      <Navbar />

      {/* Header */}
      <div style={{ background: 'var(--charcoal)', padding: '48px 0 32px' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'white', fontWeight: 300, marginBottom: 8 }}>
            My Inquiries
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>
            Track all the properties you've shown interest in
          </p>

          {/* Stats */}
          {!loading && inquiries.length > 0 && (
            <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
              {[
                { label: 'Total', count: counts.all, color: 'rgba(255,255,255,0.1)' },
                { label: 'Pending', count: counts.pending, color: 'rgba(180,83,9,0.3)' },
                { label: 'Contacted', count: counts.contacted, color: 'rgba(21,128,61,0.3)' },
                { label: 'Rejected', count: counts.rejected, color: 'rgba(185,28,28,0.2)' },
              ].map(s => (
                <div key={s.label} style={{
                  background: s.color,
                  padding: '10px 20px',
                  borderRadius: 100,
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'white', fontWeight: 600 }}>{s.count}</span>
                  <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)' }}>{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ padding: '48px 48px' }}>
        {error && <div className="alert alert-error" style={{ marginBottom: 24 }}>{error}</div>}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 80, gap: 12, color: 'var(--mid)' }}>
            <span className="spinner spinner-dark" /> Loading your inquiries...
          </div>
        ) : inquiries.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>📭</div>
            <h3>No Inquiries Yet</h3>
            <p>Browse properties and click "Send Inquiry" on any listing you like.</p>
            <Link to="/properties" className="btn btn-primary" style={{ marginTop: 24 }}>
              Browse Properties
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {inquiries.map(inquiry => {
              const status = STATUS_STYLES[inquiry.status] || STATUS_STYLES.PENDING;
              return (
                <div key={inquiry.inquiryId} style={{
                  background: 'white',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '24px',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: 24,
                  alignItems: 'start',
                  transition: 'var(--transition)',
                }}>
                  <div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center',
                        padding: '4px 12px', borderRadius: 100,
                        fontSize: '0.75rem', fontWeight: 500,
                        background: status.bg, color: status.color,
                      }}>
                        {status.label}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--light)' }}>
                        {timeAgo(inquiry.createdAt)}
                      </span>
                    </div>

                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 400, marginBottom: 4 }}>
                      {inquiry.propertyTitle || 'Property Inquiry'}
                    </h3>

                    <div style={{ background: 'var(--cream)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginTop: 12, marginBottom: 12 }}>
                      <p style={{ fontSize: '0.875rem', color: 'var(--mid)', fontStyle: 'italic', lineHeight: 1.6 }}>
                        "{inquiry.message}"
                      </p>
                    </div>

                    {inquiry.status === 'CONTACTED' && (
                      <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 'var(--radius-sm)', padding: '10px 14px', display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span>🎉</span>
                        <span style={{ fontSize: '0.875rem', color: '#15803D' }}>
                          Great news! The seller has marked this as contacted. Expect a call soon.
                        </span>
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right', minWidth: 120 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--light)', marginBottom: 8 }}>
                      Inquiry #{inquiry.inquiryId}
                    </div>
                    <Link
                      to={`/properties/${inquiry.propertyId || ''}`}
                      className="btn btn-outline"
                      style={{ fontSize: '0.8125rem', padding: '8px 16px' }}
                    >
                      View Property
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
