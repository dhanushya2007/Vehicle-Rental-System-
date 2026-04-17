import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [adminOpen, setAdminOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';
  const isAdminPath = location.pathname.startsWith('/admin');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAdminOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setAdminOpen(false);
  }, [location.pathname]);

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">🚗 DriveEasy</Link>

        <div className="navbar-links">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link to="/vehicles" className={isActive('/vehicles')}>Vehicles</Link>
          <Link to="/about" className={isActive('/about')}>About</Link>
          {user && <Link to="/bookings" className={isActive('/bookings')}>My Bookings</Link>}

          {user?.role === 'ADMIN' && (
            <div className="admin-dropdown" ref={dropdownRef}>
              <button
                className={`admin-dropdown-trigger ${isAdminPath ? 'active' : ''}`}
                onClick={() => setAdminOpen(prev => !prev)}
              >
                Admin {adminOpen ? '▴' : '▾'}
              </button>
              {adminOpen && (
                <div className="admin-dropdown-menu">
                  <Link to="/admin">📊 Dashboard</Link>
                  <Link to="/admin/vehicles">🚗 Manage Vehicles</Link>
                  <Link to="/admin/bookings">📋 Manage Bookings</Link>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="navbar-auth">
          {user ? (
            <>
              <span className="navbar-user">👋 {user.name}</span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
