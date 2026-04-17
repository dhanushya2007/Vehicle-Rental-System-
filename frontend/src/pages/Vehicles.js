import { useState, useEffect } from 'react';
import { vehicleApi } from '../api';
import VehicleCard from '../components/VehicleCard';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const type = filter === 'ALL' ? undefined : filter;
    vehicleApi.getAll(type).then(res => {
      setVehicles(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [filter]);

  const filtered = vehicles.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Our Fleet</h1>
          <p>Choose from our wide selection of cars and bikes</p>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="🔍 Search vehicles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 200, padding: '10px 16px', border: '2px solid #e2e8f0', borderRadius: 8, fontSize: 14 }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              {['ALL', 'CAR', 'BIKE'].map(t => (
                <button
                  key={t}
                  className={`btn ${filter === t ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setFilter(t)}
                >
                  {t === 'ALL' ? '🚘 All' : t === 'CAR' ? '🚗 Cars' : '🏍️ Bikes'}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <h3>No vehicles found</h3>
              <p>Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className="grid-3">
              {filtered.map(v => <VehicleCard key={v.id} vehicle={v} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
