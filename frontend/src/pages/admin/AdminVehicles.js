import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { vehicleApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import '../Admin.css';

const EMPTY = { name: '', type: 'CAR', brand: '', model: '', pricePerDay: '', available: true, imageUrl: '', description: '' };

export default function AdminVehicles() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') { navigate('/'); return; }
    fetchVehicles();
  }, [user, navigate]);

  const fetchVehicles = async () => {
    try {
      const res = await vehicleApi.getAll();
      setVehicles(res.data);
    } catch {
      toast.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const openAdd = () => {
    setEditVehicle(null);
    setForm(EMPTY);
    setShowForm(true);
  };

  const openEdit = (v) => {
    setEditVehicle(v);
    setForm({ ...v });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, pricePerDay: parseFloat(form.pricePerDay) };
      if (editVehicle) {
        await vehicleApi.update(editVehicle.id, payload);
        toast.success(`✅ "${form.name}" updated successfully`);
      } else {
        await vehicleApi.create(payload);
        toast.success(`✅ "${form.name}" added successfully`);
      }
      setShowForm(false);
      setEditVehicle(null);
      setForm(EMPTY);
      fetchVehicles();
    } catch (err) {
      toast.error(err || 'Failed to save vehicle');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (v) => {
    if (!window.confirm(`Delete "${v.name}"? This cannot be undone.`)) return;
    try {
      await vehicleApi.delete(v.id);
      toast.success(`🗑️ "${v.name}" deleted`);
      fetchVehicles();
    } catch (err) {
      toast.error(err || 'Failed to delete vehicle');
    }
  };

  const filtered = vehicles.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
                        v.brand.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'ALL' || v.type === typeFilter;
    return matchSearch && matchType;
  });

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div>
      <div className="admin-page-header">
        <div className="container">
          <div className="admin-header-inner">
            <div>
              <h1>🚗 Manage Vehicles</h1>
              <p>{vehicles.length} vehicles in fleet</p>
            </div>
            <button className="btn btn-primary btn-lg" onClick={openAdd}>+ Add New Vehicle</button>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">

          {/* Add / Edit Form */}
          {showForm && (
            <div className="card form-card" style={{ marginBottom: 32 }}>
              <div className="form-card-header">
                <h3>{editVehicle ? `✏️ Edit — ${editVehicle.name}` : '➕ Add New Vehicle'}</h3>
                <button className="close-btn" onClick={() => { setShowForm(false); setEditVehicle(null); }}>✕</button>
              </div>
              <form onSubmit={handleSubmit} className="vehicle-form">
                <div className="form-group">
                  <label>Vehicle Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Maruti Swift" />
                </div>
                <div className="form-group">
                  <label>Type *</label>
                  <select name="type" value={form.type} onChange={handleChange}>
                    <option value="CAR">🚗 Car</option>
                    <option value="BIKE">🏍️ Bike</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Brand *</label>
                  <input name="brand" value={form.brand} onChange={handleChange} required placeholder="e.g. Maruti Suzuki" />
                </div>
                <div className="form-group">
                  <label>Model *</label>
                  <input name="model" value={form.model} onChange={handleChange} required placeholder="e.g. Swift 2024" />
                </div>
                <div className="form-group">
                  <label>Price Per Day (₹) *</label>
                  <input name="pricePerDay" type="number" min="1" step="1" value={form.pricePerDay} onChange={handleChange} required placeholder="e.g. 1500" />
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://images.unsplash.com/..." />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Brief description..." />
                </div>
                {form.imageUrl && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: 13, color: 'var(--gray)', display: 'block', marginBottom: 6 }}>Image Preview</label>
                    <img src={form.imageUrl} alt="preview" style={{ height: 120, borderRadius: 8, objectFit: 'cover' }}
                      onError={e => e.target.style.display = 'none'} />
                  </div>
                )}
                <div className="form-group available-check" style={{ gridColumn: '1 / -1' }}>
                  <input type="checkbox" name="available" id="avail" checked={form.available} onChange={handleChange} />
                  <label htmlFor="avail">Available for booking</label>
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10 }}>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : editVehicle ? 'Update Vehicle' : 'Add Vehicle'}
                  </button>
                  <button type="button" className="btn btn-outline" onClick={() => { setShowForm(false); setEditVehicle(null); }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Filters */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="🔍 Search by name or brand..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 200, padding: '9px 14px', border: '2px solid #e2e8f0', borderRadius: 8, fontSize: 14 }}
            />
            {['ALL', 'CAR', 'BIKE'].map(t => (
              <button key={t} className={`btn btn-sm ${typeFilter === t ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setTypeFilter(t)}>
                {t === 'ALL' ? 'All' : t === 'CAR' ? '🚗 Cars' : '🏍️ Bikes'}
                {' '}({t === 'ALL' ? vehicles.length : vehicles.filter(v => v.type === t).length})
              </button>
            ))}
          </div>

          {/* Vehicle Cards Grid */}
          {filtered.length === 0 ? (
            <div className="empty-state">
              <h3>No vehicles found</h3>
              <p>Try a different search or add a new vehicle</p>
            </div>
          ) : (
            <div className="admin-vehicles-grid">
              {filtered.map(v => (
                <div key={v.id} className="admin-vehicle-card card">
                  <div className="admin-vehicle-img-wrap">
                    <img src={v.imageUrl} alt={v.name} className="admin-vehicle-img"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400'; }} />
                    <span className={`av-type-badge ${v.type.toLowerCase()}`}>{v.type}</span>
                    {!v.available && <div className="av-unavailable">Unavailable</div>}
                  </div>
                  <div className="admin-vehicle-body">
                    <div className="av-header">
                      <div>
                        <h4>{v.name}</h4>
                        <p>{v.brand} · {v.model}</p>
                      </div>
                      <div className="av-price">₹{v.pricePerDay}<span>/day</span></div>
                    </div>
                    <p className="av-desc">{v.description}</p>
                    <div className="av-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(v)}>✏️ Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(v)}>🗑️ Delete</button>
                    </div>
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
