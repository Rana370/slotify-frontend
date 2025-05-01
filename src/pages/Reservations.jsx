import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Fetch reservations
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/reservations/')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch reservations');
        return res.json();
      })
      .then(data => setReservations(data))
      .catch(err => setError(err.message || 'Something went wrong'))
      .finally(() => setLoading(false));
  }, []);

  // Cancel reservation
  const handleCancel = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/reservations/${id}/`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to cancel reservation');
      setMessage('Reservation cancelled.');
      setReservations(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  if (loading) return <p>Loading reservations...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (reservations.length === 0) return <p>No active reservations.</p>;

  return (
    <>
      <Navbar />
      <h2>Your Reservations</h2>

      <ul>
        {reservations.map(res => (
          <li key={res.id}>
            <p>
              <strong>Garage:</strong> {res.parking_spot?.garage?.name || 'N/A'}<br />
              <strong>Spot:</strong> {res.parking_spot?.number}<br />
              <strong>Start:</strong> {new Date(res.start_time).toLocaleString()}<br />
              <strong>End:</strong> {new Date(res.end_time).toLocaleString()}
            </p>
            <button onClick={() => handleCancel(res.id)}>Cancel</button>
          </li>
        ))}
      </ul>

      {message && <p style={{ marginTop: '20px' }}>{message}</p>}
    </>
  );
}
