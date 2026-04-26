import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { getSellerInquiries, getAllProperties, deleteProperty, updateInquiryStatus } from '../services/api';

const STATUS_STYLES = {
  PENDING:   { bg: '#FEF9EC', color: '#B45309', dot: '#D97706', label: 'Pending' },
  CONTACTED: { bg: '#F0FDF4', color: '#15803D', dot: '#22C55E', label: 'Contacted' },
  REJECTED:  { bg: '#FEF2F2', color: '#B91C1C', dot: '#EF4444', label: 'Rejected' },
};

function timeAgo(dateString) {
  if (!dateString) return '';
  const diff = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function formatPrice(price) {
  if (!price) return '—';
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
  return `₹${price.toLocaleString()}`;
}

// ─── STAT CARD ─────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div style={{
      background: 'white',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '24px',
      display: 'flex',
      gap: 16,
      alignItems: 'flex-start',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: accent || 'var(--gold-pale)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.375rem', flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 600, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '0.875rem', color: 'var(--mid)', marginTop: 4 }}>{label}</div>
        {sub && <div style={{ fontSize: '0.75rem', color: 'var(--light)', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ─── INQUIRY ROW ───────────────────────────────────────────────────────────────
function InquiryRow({ inquiry, onStatusChange }) {
  const [updating, setUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(inquiry.status);
  const s = STATUS_STYLES[currentStatus] || STATUS_STYLES.PENDING;

  const handleStatus = async (newStatus) => {
    setUpdating(true);
    try {
      await updateInquiryStatus(inquiry.inquiryId, newStatus);
      setCurrentStatus(newStatus);
      onStatusChange?.(inquiry.inquiryId, newStatus);
    } catch (e) {
      alert('Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div style={{
      background: 'white', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', padding: '20px 24px',
      display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto',
      gap: 20, alignItems: 'center',
      transition: 'var(--transition)',
    }}>
      {/* Buyer */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'var(--gold)', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.875rem', fontWeight: 600, flexShrink: 0,
        }}>
          {inquiry.buyerName?.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight: 500, fontSize: '0.9375rem' }}>{inquiry.buyerName}</div>
          <a href={`mailto:${inquiry.buyerEmail}`} style={{ fontSize: '0.8125rem', color: 'var(--gold)', textDecoration: 'none' }}>
            {inquiry.buyerEmail}
          </a>
        </div>
      </div>

      {/* Property + message */}
      <div>
        <div style={{ fontWeight: 500, fontSize: '0.875rem', marginBottom: 4 }}>{inquiry.propertyTitle}</div>
        <div style={{
          fontSize: '0.8125rem', color: 'var(--mid)',
          overflow: 'hidden', textOverflow: 'ellipsis',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          lineHeight: 1.5,
        }}>
          "{inquiry.message}"
        </div>
      </div>

      {/* Time + status badge */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--light)' }}>{timeAgo(inquiry.createdAt)}</span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 12px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 500,
          background: s.bg, color: s.color, width: 'fit-content',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot }} />
          {s.label}
        </span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 120 }}>
        {currentStatus === 'PENDING' && (
          <>
            <button
              className="btn btn-gold"
              style={{ padding: '7px 14px', fontSize: '0.8125rem', justifyContent: 'center' }}
              disabled={updating}
              onClick={() => handleStatus('CONTACTED')}
            >
              {updating ? <span className="spinner" style={{ width: 14, height: 14 }} /> : '✅ Contacted'}
            </button>
            <button
              className="btn btn-outline"
              style={{ padding: '7px 14px', fontSize: '0.8125rem', justifyContent: 'center', color: 'var(--red)', borderColor: '#FECACA' }}
              disabled={updating}
              onClick={() => handleStatus('REJECTED')}
            >
              ✕ Reject
            </button>
          </>
        )}
        {currentStatus === 'CONTACTED' && (
          <span style={{ fontSize: '0.8125rem', color: 'var(--green)', fontWeight: 500 }}>Done ✓</span>
        )}
        {currentStatus === 'REJECTED' && (
          <button
            className="btn btn-ghost"
            style={{ padding: '7px 14px', fontSize: '0.8125rem' }}
            onClick={() => handleStatus('PENDING')}
          >
            ↩ Reopen
          </button>
        )}
      </div>
    </div>
  );
}

// ─── LISTING ROW ───────────────────────────────────────────────────────────────
function ListingRow({ property, onDelete, inquiryCount }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${property.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteProperty(property.id);
      onDelete(property.id);
    } catch {
      alert('Failed to delete property.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{
      background: 'white', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', padding: '20px 24px',
      display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
      gap: 16, alignItems: 'center',
    }}>
      <div>
        <div style={{ fontWeight: 500, marginBottom: 4 }}>{property.title}</div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--mid)' }}>📍 {property.city}, {property.state}</div>
      </div>
      <div>
        <span className={`badge badge-green`}>{property.type}</span>
        <div style={{ fontSize: '0.75rem', color: 'var(--mid)', marginTop: 4 }}>{property.listingType}</div>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600 }}>
        {formatPrice(property.price)}
      </div>
      <div style={{ fontSize: '0.875rem', color: inquiryCount > 0 ? 'var(--gold)' : 'var(--light)', fontWeight: inquiryCount > 0 ? 600 : 400 }}>
        {inquiryCount > 0 ? `📩 ${inquiryCount} inquir${inquiryCount > 1 ? 'ies' : 'y'}` : 'No inquiries'}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Link to={`/properties/${property.id}`} className="btn btn-outline" style={{ padding: '7px 14px', fontSize: '0.8125rem' }}>
          View
        </Link>
        <button
          className="btn btn-ghost"
          style={{ padding: '7px 14px', fontSize: '0.8125rem', color: 'var(--red)' }}
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? <span className="spinner spinner-dark" style={{ width: 14, height: 14 }} /> : 'Delete'}
        </button>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ────────────────────────────────────────────────────────────
export default function SellerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [inquiries, setInquiries] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'SELLER' && user.role !== 'AGENT') { navigate('/'); return; }

    const load = async () => {
      try {
        const [iqRes, propRes] = await Promise.all([
          getSellerInquiries(),
          getAllProperties(),
        ]);
        setInquiries(iqRes.data);
        // Filter to only this seller's listings by matching owner email
        const myListings = propRes.data.filter(p => p.owner?.email === user.email);
        setListings(myListings);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, navigate]);

  const handleStatusChange = (id, newStatus) => {
    setInquiries(prev => prev.map(i => i.inquiryId === id ? { ...i, status: newStatus } : i));
  };

  const handleDeleteListing = (id) => {
    setListings(prev => prev.filter(p => p.id !== id));
  };

  const filteredInquiries = filterStatus === 'ALL'
    ? inquiries
    : inquiries.filter(i => i.status === filterStatus);

  // Count inquiries per property
  const inquiryCountByProperty = inquiries.reduce((acc, i) => {
    const title = i.propertyTitle;
    acc[title] = (acc[title] || 0) + 1;
    return acc;
  }, {});

  const stats = {
    listings: listings.length,
    inquiries: inquiries.length,
    pending: inquiries.filter(i => i.status === 'PENDING').length,
    contacted: inquiries.filter(i => i.status === 'CONTACTED').length,
  };

  const TABS = [
    { key: 'overview',  label: '📊 Overview' },
    { key: 'inquiries', label: `📩 Inquiries${stats.pending > 0 ? ` (${stats.pending})` : ''}` },
    { key: 'listings',  label: '🏠 My Listings' },
  ];

  return (
    <div className="page">
      <Navbar />

      {/* Header */}
      <div style={{ background: 'var(--charcoal)', padding: '40px 0 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
            <div>
              <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {user?.role} Dashboard
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'white', fontWeight: 300 }}>
                Welcome back, <em style={{ color: 'var(--gold-light)' }}>{user?.name?.split(' ')[0]}</em>
              </h1>
            </div>
            <Link to="/seller/add-property" className="btn btn-gold">
              + Add New Listing
            </Link>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                padding: '12px 24px', background: 'none', border: 'none',
                cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                color: tab === t.key ? 'var(--gold)' : 'rgba(255,255,255,0.45)',
                borderBottom: `2px solid ${tab === t.key ? 'var(--gold)' : 'transparent'}`,
                transition: 'var(--transition)',
                fontWeight: tab === t.key ? 500 : 400,
              }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ padding: '40px 48px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 80, gap: 12, color: 'var(--mid)' }}>
            <span className="spinner spinner-dark" /> Loading dashboard...
          </div>
        ) : (
          <>
            {/* ── OVERVIEW TAB ── */}
            {tab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                  <StatCard icon="🏠" label="Active Listings"    value={stats.listings}  sub="Your properties" />
                  <StatCard icon="📩" label="Total Inquiries"    value={stats.inquiries} sub="All time" accent="var(--gold-pale)" />
                  <StatCard icon="⏳" label="Pending Responses"  value={stats.pending}   sub="Need your action" accent="#FEF9EC" />
                  <StatCard icon="✅" label="Successfully Contacted" value={stats.contacted} sub="Deals in progress" accent="#F0FDF4" />
                </div>

                {/* Recent inquiries */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Recent Inquiries</h2>
                    <button className="btn btn-ghost" style={{ fontSize: '0.875rem' }} onClick={() => setTab('inquiries')}>
                      View all →
                    </button>
                  </div>
                  {inquiries.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px', background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--border)', color: 'var(--mid)' }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📭</div>
                      <p>No inquiries yet. Once buyers show interest, they'll appear here.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {inquiries.slice(0, 3).map(i => (
                        <InquiryRow key={i.inquiryId} inquiry={i} onStatusChange={handleStatusChange} />
                      ))}
                    </div>
                  )}
                </div>

                {/* My listings preview */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>My Listings</h2>
                    <button className="btn btn-ghost" style={{ fontSize: '0.875rem' }} onClick={() => setTab('listings')}>
                      Manage all →
                    </button>
                  </div>
                  {listings.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px', background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--border)', color: 'var(--mid)' }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🏠</div>
                      <p style={{ marginBottom: 16 }}>You haven't listed any properties yet.</p>
                      <Link to="/seller/add-property" className="btn btn-primary">Add Your First Listing</Link>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {listings.slice(0, 3).map(p => (
                        <ListingRow
                          key={p.id} property={p}
                          onDelete={handleDeleteListing}
                          inquiryCount={inquiryCountByProperty[p.title] || 0}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── INQUIRIES TAB ── */}
            {tab === 'inquiries' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem' }}>
                    All Inquiries
                    <span style={{ fontSize: '1rem', color: 'var(--mid)', fontFamily: 'var(--font-body)', fontWeight: 400, marginLeft: 10 }}>
                      ({inquiries.length} total)
                    </span>
                  </h2>
                  {/* Filter pills */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['ALL', 'PENDING', 'CONTACTED', 'REJECTED'].map(s => (
                      <button key={s} onClick={() => setFilterStatus(s)} style={{
                        padding: '6px 16px', borderRadius: 100, border: '1.5px solid',
                        borderColor: filterStatus === s ? 'var(--gold)' : 'var(--border)',
                        background: filterStatus === s ? 'var(--gold-pale)' : 'white',
                        color: filterStatus === s ? 'var(--gold)' : 'var(--mid)',
                        fontSize: '0.8125rem', fontFamily: 'var(--font-body)',
                        cursor: 'pointer', transition: 'var(--transition)', fontWeight: filterStatus === s ? 500 : 400,
                      }}>
                        {s === 'ALL' ? `All (${inquiries.length})` :
                         s === 'PENDING' ? `⏳ Pending (${stats.pending})` :
                         s === 'CONTACTED' ? `✅ Contacted (${stats.contacted})` :
                         `✕ Rejected (${inquiries.filter(i => i.status === 'REJECTED').length})`}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredInquiries.length === 0 ? (
                  <div className="empty-state">
                    <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📭</div>
                    <h3>No {filterStatus !== 'ALL' ? filterStatus.toLowerCase() : ''} inquiries</h3>
                    <p>When buyers express interest in your properties, inquiries will show here.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {filteredInquiries.map(i => (
                      <InquiryRow key={i.inquiryId} inquiry={i} onStatusChange={handleStatusChange} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── LISTINGS TAB ── */}
            {tab === 'listings' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem' }}>
                    My Listings
                    <span style={{ fontSize: '1rem', color: 'var(--mid)', fontFamily: 'var(--font-body)', fontWeight: 400, marginLeft: 10 }}>
                      ({listings.length} properties)
                    </span>
                  </h2>
                  <Link to="/seller/add-property" className="btn btn-gold">+ Add New Listing</Link>
                </div>

                {listings.length === 0 ? (
                  <div className="empty-state">
                    <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🏠</div>
                    <h3>No Listings Yet</h3>
                    <p>Start by adding your first property listing.</p>
                    <Link to="/seller/add-property" className="btn btn-primary" style={{ marginTop: 24 }}>
                      Add First Property
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* Table header */}
                    <div style={{
                      display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                      gap: 16, padding: '10px 24px',
                      fontSize: '0.75rem', color: 'var(--mid)',
                      textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500,
                    }}>
                      <span>Property</span>
                      <span>Type</span>
                      <span>Price</span>
                      <span>Inquiries</span>
                      <span>Actions</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {listings.map(p => (
                        <ListingRow
                          key={p.id} property={p}
                          onDelete={handleDeleteListing}
                          inquiryCount={inquiryCountByProperty[p.title] || 0}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
