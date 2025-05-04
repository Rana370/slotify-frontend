import '../static/Dashboard.css';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="Dashboard">
      {/* Hero section */}
      <div className="hero-text">
        <h1 className="brand-name">
          Slotify<span></span>
        </h1>
        <p className="tagline">
          <span className="fade-in-word">Find</span>{' '}
          <span className="fade-in-word">Your</span>{' '}
          <span className="fade-in-word special-word">Slot</span>
        </p>
        <h4 className="map-label">📍 SDA Riyadh Parking Location</h4>
      </div>

      {/* Map section */}
      <div className="map-container">
        <iframe
          title="SDA Riyadh Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3623.363748419039!2d46.688508899999995!3d24.7487145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f038451b4ef8b%3A0x55d1cda7426f4f79!2sSaudi%20Digital%20Academy%20-%20SDA!5e0!3m2!1sen!2ssa!4v1746293522411!5m2!1sen!2ssa"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      {/* Action Boxes */}
      <div className="action-boxes">
        <Link to="/reservations" className="action-square">
          📅 Reservations
        </Link>
        <Link to="/add-vehicle" className="action-square">
          🚘 Vehicle
        </Link>
      </div>
    </div>
  );
}
