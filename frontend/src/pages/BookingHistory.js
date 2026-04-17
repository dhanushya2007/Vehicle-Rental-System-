import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { bookingApi } from '../api';
import { useAuth } from '../context/AuthContext';
import './BookingHistory.css';

export default function BookingHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editDates, setEditDates] = useState({ startDate: '', endDate: '' });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = () => {
    bookingApi.getMyBookings().then(res => {
      setBookings(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await bookingApi.cancel(id);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err) { toast.error(err || 'Failed to cancel'); }
  };

  const handleEdit = (booking) => {
    setEditId(booking.id);
    setEditDates({ startDate: booking.startDate, endDate: booking.endDate });
  };

  const handleUpdate = async (id) => {
    try {
      await bookingApi.update(id, { ...editDates, vehicleId: bookings.find(b => b.id === id).vehicle.id });
      toast.success('Booking updated');
      setEditId(null);
      fetchBookings();
    } catch (err) { toast.error(err || 'Failed to update'); }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>My Bookings</h1>
          <p>View and manage your rental history</p>
        </div>
      </div>

      <div className="section">
        <div className="container">
          {bookings.length === 0 ? (
            <div className="empty-state">
              <h3>No bookings yet</h3>
              <p>Start by browsing our available vehicles</p>
              <button className="btn btn-primary mt-4" onClick={() => navigate('/vehicles')}>
                Browse Vehicles
              </button>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map(b => (
                <div key={b.id} className="card booking-item">
                  <img src={b.vehicle.imageUrl} alt={b.vehicle.name} className="booking-vehicle-img" />
                  <div className="booking-details">
                    <div className="booking-top">
                      <div>
                        <h3>{b.vehicle.name}</h3>
                        <p className="text-gray">{b.vehicle.brand} · {b.vehicle.model}</p>
                      </div>
                      <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
                    </div>

                    {editId === b.id ? (
                      <div className="edit-form">
                        <input type="date" value={editDates.startDate}
                          onChange={e => setEditDates(p => ({ ...p, startDate: e.target.value }))} />
                        <input type="date" value={editDates.endDate}
                          onChange={e => setEditDates(p => ({ ...p, endDate: e.target.value }))} />
                        <button className="btn btn-success btn-sm" onClick={() => handleUpdate(b.id)}>Save</button>
                        <button className="btn btn-outline btn-sm" onClick={() => setEditId(null)}>Cancel</button>
                      </div>
                    ) : (
                      <div className="booking-meta">
                        <span>📅 {b.startDate} → {b.endDate}</span>
                        <span>💰 Total: <strong>₹{b.totalPrice}</strong></span>
                      </div>
                    )}

                    {b.status === 'PENDING' && editId !== b.id && (
                      <div className="booking-actions">
                        <button className="btn btn-outline btn-sm" onClick={() => handleEdit(b)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleCancel(b.id)}>Cancel</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
