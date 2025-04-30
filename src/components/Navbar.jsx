import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ padding: '1rem', background: '#eee' }}>
      <Link to="/dashboard" style={{ marginRight: '1rem' }}>Dashboard</Link>
      <Link to="/reservations" style={{ marginRight: '1rem' }}>Reservations</Link>
      <Link to="/add-vehicle" style={{ marginRight: '1rem' }}>Vehicles</Link>
      <Link to="/about" style={{ marginRight: '1rem' }}>About</Link>
      <Link to="/login">Logout</Link>
    </nav>
  );
}
