
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import sendRequest from '../utilities/sendRequest';
import * as reservationAPI from '../utilities/reservations-api'

export default function Reservations({user}) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('⚠️ Not authenticated. Please log in.');
      setLoading(false);
      return;
    }

    const fetchReservations = async () => {
      try {
        const res = await reservationAPI.getAllReservations()
        // create an array using arr.filter to only show reservations that belong to logged in user
        const myReservations = res.filter(r => r.user === user.id)
        setReservations(myReservations);
      } catch (err) {
        setError(`Failed to fetch reservations: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleCancel = async (id) => {
    try {
      await sendRequest(`/api/reservations/${id}/`, 'DELETE');
      setMessage('✅ Reservation cancelled.');
      setReservations(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  if (loading) return <p>Loading reservations...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (reservations.length === 0) return <p>No active reservations.</p>;

  return (
    <>
     
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
