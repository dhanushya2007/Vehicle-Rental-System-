import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vehicleApi } from '../api';
import VehicleCard from '../components/VehicleCard';
import './Home.css';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vehicleApi.getAll().then(res => {
      setFeatured(res.data.slice(0, 6));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="container hero-content">
          <h1>Find Your Perfect Ride</h1>
          <p>Premium cars and bikes available for rent. Flexible dates, unbeatable prices.</p>
          <div className="hero-actions">
            <Link to="/vehicles" className="btn btn-primary btn-lg">Browse Vehicles</Link>
            <Link to="/register" className="btn btn-outline btn-lg" style={{ color: 'white', borderColor: 'white' }}>
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container stats-grid">
          {[
            { value: '500+', label: 'Vehicles Available' },
            { value: '10K+', label: 'Happy Customers' },
            { value: '50+', label: 'Cities Covered' },
            { value: '24/7', label: 'Customer Support' },
          ].map(s => (
            <div key={s.label} className="stat-item">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="section-title">Featured Vehicles</h2>
            <p className="section-subtitle">Handpicked selection of our most popular rentals</p>
          </div>
          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : (
            <div className="grid-3">
              {featured.map(v => <VehicleCard key={v.id} vehicle={v} />)}
            </div>
          )}
          <div className="text-center mt-4" style={{ marginTop: 40 }}>
            <Link to="/vehicles" className="btn btn-outline btn-lg">View All Vehicles</Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section" style={{ background: 'var(--light)' }}>
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="section-title">Why Choose DriveEasy?</h2>
          </div>
          <div className="features-grid">
            {[
              { icon: '🛡️', title: 'Fully Insured', desc: 'All vehicles come with comprehensive insurance coverage.' },
              { icon: '💰', title: 'Best Prices', desc: 'Competitive rates with no hidden fees or charges.' },
              { icon: '🔑', title: 'Easy Booking', desc: 'Book in minutes with our simple online process.' },
              { icon: '🚀', title: 'Fast Delivery', desc: 'Vehicle delivered to your doorstep on time.' },
            ].map(f => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container text-center">
          <h2>Ready to Hit the Road?</h2>
          <p>Join thousands of satisfied customers and book your vehicle today.</p>
          <Link to="/vehicles" className="btn btn-secondary btn-lg" style={{ marginTop: 24 }}>
            Book Now
          </Link>
        </div>
      </section>
    </div>
  );
}
