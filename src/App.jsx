import './static/base.css';

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
import Footer from './components/Footer'; // ✅ Import Footer
import { getUser } from './utilities/users-api';



export default function App() {
  const [user, setUser] = useState(getUser());

  



  return (
    <div className="App">
      <Navbar user={user} setUser={setUser} />
      <Routes>
        {user ? (
          <>
            <Route path="/*" element={<Dashboard />} />
            <Route path="/garages" element={<Garages />} />
            <Route path="/garage/:id" element={<GarageDetail />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/add-vehicle" element={<Vehicle />} />
            <Route path="/about" element={<About />} />
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
      <Footer /> {/* ✅ Add Footer at the bottom */}
    </div>
  );
}
