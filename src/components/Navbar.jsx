import { Link, useNavigate } from 'react-router-dom';
import * as usersAPI from '../utilities/users-api';

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  function handleLogout() {
    usersAPI.logout();        
    setUser(null);            
    navigate('/login');       
  }

  return (
    <nav style={{ padding: '1rem', background: '#eee' }}>
      {user ? (
        <div>
          <Link to="/about" style={{ marginRight: '1rem' }}>About</Link>
          <Link to="/dashboard" style={{ marginRight: '1rem' }}>Dashboard</Link>
          <Link to="/reservations" style={{ marginRight: '1rem' }}>Reservations</Link>
          <Link to="/add-vehicle" style={{ marginRight: '1rem' }}>Vehicles</Link>
          <Link to="/garages" style={{ marginRight: '1rem' }}>Garages</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <Link to="/about" style={{ marginRight: '1rem' }}>About</Link>
          <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      )}
    </nav>
  );
}
