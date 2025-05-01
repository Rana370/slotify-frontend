import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div>
      <h2>Welcome to Slotify Dashboard</h2>
      <p>Manage your vehicles, reservations, and garages below.</p>

      <ul>
        <li><Link to="/garages">View Garages</Link></li>
        <li><Link to="/reservations">Your Reservations</Link></li>
        <li><Link to="/add-vehicle">Manage Vehicles</Link></li>
      </ul>
    </div>
  );
}
