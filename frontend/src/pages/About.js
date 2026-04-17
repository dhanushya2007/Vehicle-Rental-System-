import './About.css';

export default function About() {
  return (
    <div>
      {/* Hero */}
      <div className="about-hero">
        <div className="about-hero-overlay" />
        <div className="container about-hero-content">
          <h1>About DriveEasy</h1>
          <p>India's most trusted vehicle rental platform since 2020</p>
        </div>
      </div>

      {/* Who We Are */}
      <div className="section">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <div className="about-tag">🇮🇳 Made in India</div>
              <h2>Who We Are</h2>
              <p>
                DriveEasy is a premium vehicle rental platform built for India — offering a wide range
                of cars and bikes for every occasion, from daily city commutes to long highway road trips.
                We believe in making mobility simple, affordable, and enjoyable for every Indian.
              </p>
              <p>
                With a fleet of 500+ vehicles across 50+ cities including Mumbai, Delhi, Bengaluru,
                Chennai, Hyderabad and more — we serve lakhs of happy customers every month.
                Book in minutes, drive in style.
              </p>
              <div className="about-values">
                {[
                  { icon: '🎯', title: 'Our Mission', desc: 'Make vehicle rental accessible and hassle-free for every Indian.' },
                  { icon: '👁️', title: 'Our Vision', desc: 'Be the most trusted mobility platform across India.' },
                  { icon: '💚', title: 'Our Promise', desc: 'Transparent pricing in ₹, no hidden charges, ever.' },
                ].map(v => (
                  <div key={v.title} className="value-card">
                    <span className="value-icon">{v.icon}</span>
                    <div>
                      <h4>{v.title}</h4>
                      <p>{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="about-image-wrap">
              <img
                src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800"
                alt="About DriveEasy"
                className="about-image"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="about-stats-section">
        <div className="container about-stats-grid">
          {[
            { value: '500+', label: 'Vehicles Available', icon: '🚗' },
            { value: '50+', label: 'Cities in India', icon: '🏙️' },
            { value: '1L+', label: 'Happy Customers', icon: '😊' },
            { value: '4.8★', label: 'Average Rating', icon: '⭐' },
          ].map(s => (
            <div key={s.label} className="about-stat-card card">
              <div className="about-stat-icon">{s.icon}</div>
              <div className="about-stat-value">{s.value}</div>
              <div className="about-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="section">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="section-title">Why Choose DriveEasy?</h2>
            <p className="section-subtitle">We're built differently for India</p>
          </div>
          <div className="why-grid">
            {[
              { icon: '💰', title: 'Prices in ₹', desc: 'All prices in Indian Rupees. No dollar conversions, no surprises.' },
              { icon: '🛡️', title: 'Fully Insured', desc: 'Every vehicle comes with comprehensive insurance coverage.' },
              { icon: '📱', title: 'Easy Booking', desc: 'Book online in under 2 minutes from anywhere in India.' },
              { icon: '🔧', title: '24/7 Roadside Help', desc: 'Breakdown assistance available across all major Indian highways.' },
              { icon: '🧾', title: 'GST Invoice', desc: 'Get proper GST invoices for all your rentals instantly.' },
              { icon: '🚀', title: 'Doorstep Delivery', desc: 'Vehicle delivered to your home or office on time.' },
            ].map(f => (
              <div key={f.title} className="why-card card">
                <div className="why-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="section" style={{ background: 'var(--light)' }}>
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="section-title">Contact Us</h2>
            <p className="section-subtitle">We're here to help — reach us anytime</p>
          </div>
          <div className="contact-grid">
            {[
              { icon: '📍', title: 'Head Office', info: '42, MG Road, Bengaluru, Karnataka — 560001' },
              { icon: '📞', title: 'Phone', info: '+91 98765 43210' },
              { icon: '✉️', title: 'Email', info: 'support@driveeasy.in' },
              { icon: '🕐', title: 'Working Hours', info: 'Mon–Sun: 8:00 AM – 10:00 PM IST' },
              { icon: '💬', title: 'WhatsApp', info: '+91 98765 43210' },
              { icon: '🌐', title: 'Website', info: 'www.driveeasy.in' },
            ].map(c => (
              <div key={c.title} className="contact-card card">
                <div className="contact-icon">{c.icon}</div>
                <h4>{c.title}</h4>
                <p>{c.info}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="about-map-section">
        <div className="container">
          <div className="about-map-wrap">
            <iframe
              title="DriveEasy Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0059!2d77.5945627!3d12.9715987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1680000000000"
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: 12 }}
              allowFullScreen=""
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
