import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { vehicleApi, bookingApi } from '../api';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') { navigate('/'); return; }
    Promise.all([vehicleApi.getAll(), bookingApi.getAllAdmin()])
      .then(([vRes, bRes]) => {
        setVehicles(vRes.data);
        setBookings(bRes.data);
      })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleStatusChange = async (id, status) => {
    try {
      await bookingApi.updateStatus(id, status);
      toast.success(`Booking ${status.toLowerCase()}`);
      const res = await bookingApi.getAllAdmin();
      setBookings(res.data);
    } catch (err) {
      toast.error(err || 'Failed to update');
    }
  };

  const totalRevenue = bookings
    .filter(b => b.status === 'APPROVED')
    .reduce((s, b) => s + parseFloat(b.totalPrice), 0);

  const pending = bookings.filter(b => b.status === 'PENDING');

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div className="container">
          <div className="admin-header-inner">
            <div>
              <h1>📊 Admin Dashboard</h1>
              <p>Welcome back, {user.name} 👋 &nbsp;·&nbsp;
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">

          {/* Stat Cards */}
          <div className="admin-stats">
            <div className="admin-stat-card card stat-blue">
              <div className="stat-icon-wrap">🚗</div>
              <div className="stat-info">
                <div className="admin-stat-value">{vehicles.length}</div>
                <div className="admin-stat-label">Total Vehicles</div>
              </div>
            </div>
            <div className="admin-stat-card card stat-purple">
              <div className="stat-icon-wrap">📋</div>
              <div className="stat-info">
                <div className="admin-stat-value">{bookings.length}</div>
                <div className="admin-stat-label">Total Bookings</div>
              </div>
            </div>
            <div className="admin-stat-card card stat-orange">
              <div className="stat-icon-wrap">⏳</div>
              <div className="stat-info">
                <div className="admin-stat-value">{pending.length}</div>
                <div className="admin-stat-label">Pending Approval</div>
              </div>
            </div>
            <div className="admin-stat-card card stat-green">
              <div className="stat-icon-wrap">₹</div>
              <div className="stat-info">
                <div className="admin-stat-value">₹{totalRevenue.toLocaleString('en-IN')}</div>
                <div className="admin-stat-label">Total Revenue</div>
              </div>
            </div>
          </div>

          {/* Quick Action Nav Cards */}
          <div className="admin-nav-cards">
            <Link to="/admin/vehicles" className="admin-nav-card card">
              <div className="anc-icon">🚗</div>
              <div className="anc-body">
                <h3>Manage Vehicles</h3>
                <p>Add, edit or delete vehicles from the fleet</p>
                <span className="anc-count">{vehicles.length} vehicles</span>
              </div>
              <div className="anc-arrow">→</div>
            </Link>
            <Link to="/admin/bookings" className="admin-nav-card card">
              <div className="anc-icon">📋</div>
              <div className="anc-body">
                <h3>Manage Bookings</h3>
                <p>Approve or reject customer booking requests</p>
                <span className="anc-count anc-pending">{pending.length} pending</span>
              </div>
              <div className="anc-arrow">→</div>
            </Link>
          </div>

          {/* Fleet Overview + Booking Breakdown */}
          <div className="overview-grid" style={{ marginTop: 28 }}>
            <div className="card overview-card">
              <div className="overview-card-header">
                <h3>Fleet Overview</h3>
                <Link to="/admin/vehicles" className="overview-link">Manage →</Link>
              </div>
              <div className="fleet-overview">
                {[
                  { label: '🚗 Cars', value: vehicles.filter(v => v.type === 'CAR').length },
                  { label: '🏍️ Bikes', value: vehicles.filter(v => v.type === 'BIKE').length },
                  { label: '✅ Available', value: vehicles.filter(v => v.available).length },
                  { label: '❌ Unavailable', value: vehicles.filter(v => !v.available).length },
                ].map(f => (
                  <div key={f.label} className="fleet-item">
                    <span className="fleet-label">{f.label}</span>
                    <span className="fleet-value">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card overview-card">
              <div className="overview-card-header">
                <h3>Booking Status</h3>
                <Link to="/admin/bookings" className="overview-link">View All →</Link>
              </div>
              <div className="status-breakdown">
                {['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map(s => {
                  const count = bookings.filter(b => b.status === s).length;
                  const pct = bookings.length ? Math.round((count / bookings.length) * 100) : 0;
                  const color = s === 'APPROVED' ? '#10b981' : s === 'PENDING' ? '#f59e0b' : s === 'REJECTED' ? '#ef4444' : '#94a3b8';
                  return (
                    <div key={s} className="status-row">
                      <span className={`badge badge-${s.toLowerCase()}`}>{s}</span>
                      <div className="status-bar-wrap">
                        <div className="status-bar" style={{ width: `${pct}%`, background: color }} />
                      </div>
                      <span className="status-count">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pending Bookings Quick Actions */}
          {pending.length > 0 && (
            <div className="card" style={{ marginTop: 24, padding: 24 }}>
              <div className="overview-card-header" style={{ marginBottom: 16 }}>
                <h3>⏳ Pending Bookings — Quick Approve</h3>
                <Link to="/admin/bookings" className="overview-link">View All →</Link>
              </div>
              <div className="pending-list">
                {pending.slice(0, 5).map(b => (
                  <div key={b.id} className="pending-item">
                    <img src={b.vehicle.imageUrl} alt={b.vehicle.name}
                      style={{ width: 52, height: 38, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }}
                      onError={e => e.target.style.display = 'none'} />
                    <div className="pending-info">
                      <strong>{b.vehicle.name}</strong>
                      <span>{b.user.name} &nbsp;·&nbsp; {b.startDate} → {b.endDate}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--primary)', marginLeft: 'auto', marginRight: 16 }}>
                      ₹{parseFloat(b.totalPrice).toLocaleString('en-IN')}
                    </span>
                    <div className="pending-actions">
                      <button className="btn btn-success btn-sm" onClick={() => handleStatusChange(b.id, 'APPROVED')}>✓ Approve</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleStatusChange(b.id, 'REJECTED')}>✗ Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
