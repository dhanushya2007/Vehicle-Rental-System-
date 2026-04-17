import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { vehicleApi, bookingApi } from '../api';
import { useAuth } from '../context/AuthContext';
import './BookingPage.css';

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    pickupLocation: '',
    startDate: '',
    endDate: '',
    notes: '',
  });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    vehicleApi.getById(id).then(res => setVehicle(res.data));
    // Pre-fill name and email from logged in user
    setForm(p => ({ ...p, fullName: user.name || '', email: '' }));
  }, [id, user, navigate]);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const days = form.startDate && form.endDate
    ? Math.max(1, Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / 86400000) + 1)
    : 0;

  const total = vehicle ? (days * vehicle.pricePerDay).toFixed(2) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.startDate || !form.endDate) {
      toast.error('Please select rental dates');
      return;
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      toast.error('End date must be after start date');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      toast.error('Enter a valid 10-digit Indian mobile number');
      return;
    }
    setLoading(true);
    try {
      await bookingApi.create({
        vehicleId: Number(id),
        startDate: form.startDate,
        endDate: form.endDate,
      });
      toast.success('🎉 Booking submitted successfully!');
      navigate('/bookings');
    } catch (err) {
      toast.error(err || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  if (!vehicle) return <div className="loading"><div className="spinner" /></div>;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Book Vehicle</h1>
          <p>Fill in your details to complete the booking</p>
        </div>
      </div>

      <div className="section">
        <div className="container booking-layout">

          {/* Booking Form */}
          <div className="card booking-form-card">
            <div className="booking-form-inner">
              <form onSubmit={handleSubmit}>

                {/* Section 1 — Personal Details */}
                <div className="booking-section-title">
                  <span className="booking-step">1</span> Personal Details
                </div>
                <div className="booking-form-grid">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input name="fullName" value={form.fullName} onChange={handleChange}
                      placeholder="Enter your full name" required />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange}
                      placeholder="your@email.com" required />
                  </div>
                  <div className="form-group">
                    <label>Mobile Number *</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                      placeholder="10-digit mobile number" maxLength={10} required />
                  </div>
                  <div className="form-group">
                    <label>Address *</label>
                    <input name="address" value={form.address} onChange={handleChange}
                      placeholder="Your full address" required />
                  </div>
                </div>

                {/* Section 2 — Rental Details */}
                <div className="booking-section-title" style={{ marginTop: 24 }}>
                  <span className="booking-step">2</span> Rental Details
                </div>
                <div className="booking-form-grid">
                  <div className="form-group">
                    <label>Start Date *</label>
                    <input type="date" name="startDate" min={today} value={form.startDate}
                      onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>End Date *</label>
                    <input type="date" name="endDate" min={form.startDate || today} value={form.endDate}
                      onChange={handleChange} required />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Pickup Location *</label>
                    <select name="pickupLocation" value={form.pickupLocation} onChange={handleChange} required>
                      <option value="">Select pickup location</option>
                      <option>Chennai — Anna Nagar Branch</option>
                      <option>Chennai — T. Nagar Branch</option>
                      <option>Chennai — OMR Branch</option>
                      <option>Bengaluru — MG Road Branch</option>
                      <option>Bengaluru — Koramangala Branch</option>
                      <option>Mumbai — Andheri Branch</option>
                      <option>Delhi — Connaught Place Branch</option>
                      <option>Hyderabad — Banjara Hills Branch</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Special Requests / Notes</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange}
                      rows={3} placeholder="Any special requests or additional information..." />
                  </div>
                </div>

                {/* Price Summary */}
                {days > 0 && (
                  <div className="price-summary">
                    <div className="price-row">
                      <span>₹{Number(vehicle.pricePerDay).toLocaleString('en-IN')} × {days} day{days > 1 ? 's' : ''}</span>
                      <span>₹{Number(total).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="price-row">
                      <span>GST (18%)</span>
                      <span>₹{(total * 0.18).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="price-row total">
                      <span>Total Payable</span>
                      <span>₹{(total * 1.18).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                )}

                <button type="submit" className="btn btn-primary"
                  style={{ width: '100%', marginTop: 20, padding: '14px' }} disabled={loading}>
                  {loading ? '⏳ Submitting...' : '🚗 Confirm Booking'}
                </button>

                <p style={{ fontSize: 12, color: 'var(--gray)', textAlign: 'center', marginTop: 12 }}>
                  By confirming, you agree to our rental terms and conditions.
                </p>
              </form>
            </div>
          </div>

          {/* Vehicle Summary */}
          <div className="booking-sidebar">
            <div className="card vehicle-summary-card">
              <img src={vehicle.imageUrl} alt={vehicle.name}
                style={{ width: '100%', height: 220, objectFit: 'cover' }}
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800'; }} />
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{vehicle.name}</h3>
                  <span className={`badge ${vehicle.type === 'CAR' ? 'badge-approved' : 'badge-pending'}`}>
                    {vehicle.type}
                  </span>
                </div>
                <p style={{ color: 'var(--gray)', fontSize: 13, marginBottom: 12 }}>{vehicle.brand} · {vehicle.model}</p>
                <p style={{ color: 'var(--gray)', fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>{vehicle.description}</p>
                <div className="vehicle-price-box">
                  <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>
                    ₹{Number(vehicle.pricePerDay).toLocaleString('en-IN')}
                  </span>
                  <span style={{ color: 'var(--gray)', fontSize: 13 }}> / day</span>
                </div>
              </div>
            </div>

            {/* Booking Info */}
            <div className="card" style={{ padding: 20, marginTop: 16 }}>
              <h4 style={{ marginBottom: 14, fontWeight: 700 }}>📋 Booking Info</h4>
              {[
                { icon: '✅', text: 'Free cancellation before pickup' },
                { icon: '🛡️', text: 'Comprehensive insurance included' },
                { icon: '🧾', text: 'GST invoice provided' },
                { icon: '⛽', text: 'Full tank on delivery' },
                { icon: '📞', text: '24/7 roadside assistance' },
              ].map(i => (
                <div key={i.text} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 13, color: 'var(--gray)' }}>
                  <span>{i.icon}</span><span>{i.text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
