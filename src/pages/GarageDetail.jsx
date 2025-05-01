import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

export default function GarageDetail() {
  const { id } = useParams();
  const [garage, setGarage] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ Fetch garage details
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/garages/${id}/`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch garage');
        return res.json();
      })
      .then(data => setGarage(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // ✅ Fetch user's vehicles
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/vehicles/')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch vehicles');
        return res.json();
      })
      .then(data => setVehicles(data))
      .catch(err => console.error('Vehicle fetch error:', err));
  }, []);

  // ✅ Handle reserve
  const handleReserve = async (spotId) => {
    if (!selectedVehicle) {
      setMessage('⚠️ Please select a vehicle first.');
      return;
    }

    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    const reservationData = {
      parking_spot: spotId,
      vehicle: selectedVehicle,
      start_time: now.toISOString(),
      end_time: oneHourLater.toISOString(),
    };

    try {
      const res = await fetch('http://127.0.0.1:8000/api/reservations/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationData),
      });

      if (!res.ok) throw new Error('Reservation failed.');
      setMessage('✅ Reservation successful!');
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  if (loading) return <p>Loading garage...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!garage) return <p>No garage found.</p>;

  return (
    <>
      
      <h2>{garage.name}</h2>
      <p>Location: {garage.location}</p>

      <h3>Select Your Vehicle</h3>
      <select
        value={selectedVehicle}
        onChange={(e) => setSelectedVehicle(e.target.value)}
      >
        <option value="">-- Select Vehicle --</option>
        {vehicles.map((vehicle) => (
          <option key={vehicle.id} value={vehicle.id}>
            {vehicle.plate_number} ({vehicle.type})
          </option>
        ))}
      </select>

      <h3>Parking Spots</h3>
      {garage.parking_spots && garage.parking_spots.length > 0 ? (
        <ul>
          {garage.parking_spots.map((spot) => (
            <li key={spot.id}>
              Spot #{spot.number} — {spot.is_available ? 'Available' : 'Taken'}
              {spot.is_available && (
                <button
                  onClick={() => handleReserve(spot.id)}
                  style={{ marginLeft: '10px' }}
                >
                  Reserve
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No parking spots found.</p>
      )}

      {message && (
        <p style={{ marginTop: '20px', color: message.includes('✅') ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </>
  );
}
