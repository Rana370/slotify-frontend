import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import GarageDetail from './pages/GarageDetail';
import Garages from './pages/Garages';
import Reservations from './pages/Reservations';
import Vehicle from './pages/Vehicle';
import Navbar from './components/Navbar';

export default function App() {
  const [user, setUser] = useState(null);

  // Optional: Check for token on load and auto-login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({}); // or decode token later
    }
  }, []);

  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        {user ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/garages" element={<Garages />} />
            <Route path="/garage/:id" element={<GarageDetail />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/add-vehicle" element={<Vehicle />} />
            <Route path="/about" element={<About />} />
            <Route path="/signup" element={<Signup setUser={setUser} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
          </>
        ) : (
          <>
            <Route path="/signup" element={<Signup setUser={setUser} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/about" element={<About />} />
            <Route path="/*" element={<Login setUser={setUser} />} />
          </>
        )}
      </Routes>
    </div>
  );
}
