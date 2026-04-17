import { Link } from 'react-router-dom';
import './VehicleCard.css';

export default function VehicleCard({ vehicle }) {
  return (
    <div className="card vehicle-card">
      <div className="vehicle-img-wrap">
        <img src={vehicle.imageUrl} alt={vehicle.name} className="vehicle-img" />
        <span className={`vehicle-type-badge ${vehicle.type.toLowerCase()}`}>{vehicle.type}</span>
        {!vehicle.available && <div className="unavailable-overlay">Unavailable</div>}
      </div>
      <div className="vehicle-info">
        <div className="vehicle-header">
          <h3>{vehicle.name}</h3>
          <span className="vehicle-price">₹{vehicle.pricePerDay}<small>/day</small></span>
        </div>
        <p className="vehicle-brand">{vehicle.brand} · {vehicle.model}</p>
        <p className="vehicle-desc">{vehicle.description}</p>
        <Link
          to={vehicle.available ? `/book/${vehicle.id}` : '#'}
          className={`btn btn-primary btn-sm ${!vehicle.available ? 'disabled' : ''}`}
          style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}
        >
          {vehicle.available ? 'Book Now' : 'Not Available'}
        </Link>
      </div>
    </div>
  );
}
