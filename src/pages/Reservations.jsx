import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import sendRequest from '../utilities/sendRequest';
import * as reservationAPI from '../utilities/reservations-api';
import * as garageAPI from '../utilities/garage-api';

export default function Reservations({ user }) {
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
        const res = await reservationAPI.getAllReservations();
        const myReservations = res.filter(r => r.user === user.id);

        const reservationsWithGarageNames = await Promise.all(
          myReservations.map(async (r) => {
            let garageName = 'N/A';
            if (r.garage) {
              try {
                const garage = await garageAPI.show(r.garage);
                garageName = garage.name;
              } catch (err) {
                console.error(`Failed to fetch garage ${r.garage}`, err);
              }
            }
            return { ...r, garage_name: garageName };
          })
        );

        setReservations(reservationsWithGarageNames);
      } catch (err) {
        setError(`Failed to fetch reservations: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user.id]);

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
              <strong>Garage:</strong> {res.garage_name}<br />
              <strong>Spot:</strong> {res.parking_spot}<br />
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
