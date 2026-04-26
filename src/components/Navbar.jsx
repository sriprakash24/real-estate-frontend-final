import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">Estate<span>Hub</span></Link>

      <div className="nav-links">
        <Link to="/properties" className={isActive('/properties')}>Properties</Link>
        {user?.role === 'BUYER' && (
          <Link to="/my-inquiries" className={isActive('/my-inquiries')}>My Inquiries</Link>
        )}
        {(user?.role === 'SELLER' || user?.role === 'AGENT') && (
          <Link to="/seller-dashboard" className={isActive('/seller-dashboard')}>Dashboard</Link>
        )}
      </div>

      <div className="nav-links">
        {user ? (
          <>
            <div className="nav-user">
              <div className="nav-avatar">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--dark)' }}>
                {user.name?.split(' ')[0]}
              </span>
            </div>
            <button className="btn btn-ghost" onClick={handleLogout}>Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost">Sign In</Link>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
}
