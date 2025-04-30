import { Routes, Route } from 'react-router-dom';
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
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/garages" element={<Garages />} /> 
        <Route path="/garage/:id" element={<GarageDetail />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/add-vehicle" element={<Vehicle />} />
      </Routes>
    </div>
  );
}
