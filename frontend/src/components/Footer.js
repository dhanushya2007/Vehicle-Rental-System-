import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">🚗 DriveEasy</div>
          <p>Your trusted vehicle rental partner. Premium cars and bikes for every journey.</p>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/vehicles">Vehicles</Link>
          <Link to="/about">About</Link>
          <Link to="/login">Login</Link>
        </div>
        <div className="footer-links">
          <h4>Vehicle Types</h4>
          <Link to="/vehicles?type=CAR">Cars</Link>
          <Link to="/vehicles?type=BIKE">Bikes</Link>
        </div>
        <div className="footer-contact">
          <h4>Contact</h4>
          <p>📞 +1 (555) 123-4567</p>
          <p>✉️ support@driveeasy.com</p>
          <p>📍 123 Rental Street, Auto City</p>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} DriveEasy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
