import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { bookingApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import '../Admin.css';

export default function AdminBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') { navigate('/'); return; }
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      const res = await bookingApi.getAllAdmin();
      setBookings(res.data);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id, status, name) => {
    try {
      await bookingApi.updateStatus(id, status);
      toast.success(`Booking #${id} ${status.toLowerCase()}`);
      fetchBookings();
    } catch (err) {
      toast.error(err || 'Failed to update');
    }
  };

  const filtered = bookings.filter(b => {
    const matchFilter = filter === 'ALL' || b.status === filter;
    const matchSearch = b.user.name.toLowerCase().includes(search.toLowerCase()) ||
                        b.vehicle.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    ALL: bookings.length,
    PENDING: bookings.filter(b => b.status === 'PENDING').length,
    APPROVED: bookings.filter(b => b.status === 'APPROVED').length,
    REJECTED: bookings.filter(b => b.status === 'REJECTED').length,
    CANCELLED: bookings.filter(b => b.status === 'CANCELLED').length,
  };

  const totalRevenue = bookings
    .filter(b => b.status === 'APPROVED')
    .reduce((s, b) => s + parseFloat(b.totalPrice), 0);

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div>
      <div className="admin-page-header">
        <div className="container">
          <div className="admin-header-inner">
            <div>
              <h1>📋 Manage Bookings</h1>
              <p>{bookings.length} total bookings · Revenue: ₹{totalRevenue.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">

          {/* Summary Cards */}
          <div className="booking-summary-cards">
            {[
              { label: 'Total', count: counts.ALL, color: '#2563eb', icon: '📋' },
              { label: 'Pending', count: counts.PENDING, color: '#f59e0b', icon: '⏳' },
              { label: 'Approved', count: counts.APPROVED, color: '#10b981', icon: '✅' },
              { label: 'Rejected', count: counts.REJECTED, color: '#ef4444', icon: '❌' },
              { label: 'Cancelled', count: counts.CANCELLED, color: '#94a3b8', icon: '🚫' },
            ].map(s => (
              <div key={s.label} className="bsc-card card" style={{ borderTop: `4px solid ${s.color}` }}
                onClick={() => setFilter(s.label === 'Total' ? 'ALL' : s.label.toUpperCase())}
                role="button">
                <div className="bsc-icon">{s.icon}</div>
                <div className="bsc-count" style={{ color: s.color }}>{s.count}</div>
                <div className="bsc-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="🔍 Search by customer or vehicle..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 220, padding: '9px 14px', border: '2px solid #e2e8f0', borderRadius: 8, fontSize: 14 }}
            />
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map(f => (
                <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setFilter(f)}>
                  {f} ({counts[f]})
                </button>
              ))}
            </div>
          </div>

          {/* Bookings Table */}
          <div className="admin-table-wrap card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Customer</th>
                  <th>Vehicle</th>
                  <th>Dates</th>
                  <th>Days</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: 48, color: 'var(--gray)' }}>
                      No bookings found
                    </td>
                  </tr>
                ) : filtered.map(b => {
                  const days = Math.ceil((new Date(b.endDate) - new Date(b.startDate)) / 86400000) + 1;
                  return (
                    <tr key={b.id}>
                      <td style={{ color: 'var(--gray)', fontSize: 13, fontWeight: 600 }}>#{b.id}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{b.user.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--gray)' }}>{b.user.email}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <img src={b.vehicle.imageUrl} alt={b.vehicle.name}
                            style={{ width: 44, height: 32, objectFit: 'cover', borderRadius: 4 }}
                            onError={e => e.target.style.display = 'none'} />
                          <div>
                            <div style={{ fontWeight: 500, fontSize: 13 }}>{b.vehicle.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--gray)' }}>{b.vehicle.type}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: 13 }}>
                        <div>{b.startDate}</div>
                        <div style={{ color: 'var(--gray)' }}>→ {b.endDate}</div>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>{days}d</td>
                      <td>
                        <strong style={{ color: 'var(--primary)' }}>
                          ₹{parseFloat(b.totalPrice).toLocaleString('en-IN')}
                        </strong>
                      </td>
                      <td><span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span></td>
                      <td>
                        {b.status === 'PENDING' ? (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="btn btn-success btn-sm"
                              onClick={() => handleStatus(b.id, 'APPROVED', b.vehicle.name)}>
                              ✓ Approve
                            </button>
                            <button className="btn btn-danger btn-sm"
                              onClick={() => handleStatus(b.id, 'REJECTED', b.vehicle.name)}>
                              ✗ Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: 13, color: 'var(--gray)' }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
