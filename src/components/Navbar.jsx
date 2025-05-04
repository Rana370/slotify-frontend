import '../static/Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import * as usersAPI from '../utilities/users-api';
import logo from '../assets/logo1.png'; // ✅ Import logo from src/assets

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  function handleLogout() {
    usersAPI.logout();
    setUser(null);
    navigate('/login');
  }

  return (
    <nav className="Navbar">
      {/* ✅ Logo + brand name */}
      <Link to="/dashboard" className="Navbar-logo">
        <img src={logo} alt="Slotify Logo" />
      </Link>

      <div>
        {user ? (
          <>
            <Link to="/about">About</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/garages">Garages</Link>
            <Link to="/reservations">Reservations</Link>
            <Link to="/add-vehicle">Vehicles</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/about">About</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
