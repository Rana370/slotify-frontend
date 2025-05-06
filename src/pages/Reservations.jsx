import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import * as reservationAPI from '../utilities/reservations-api';
import * as garageAPI from '../utilities/garage-api';
import * as vehiclesAPI from '../utilities/vehicles-api';
import '../static/Reservations.css';

export default function Reservations({ user }) {
  const [reservations, setReservations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editStart, setEditStart] = useState('');
  const [editEnd, setEditEnd] = useState('');
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
        const [res, vehicles] = await Promise.all([
          reservationAPI.getAllReservations(),
          vehiclesAPI.getUserVehicles()
        ]);

        const vehicleMap = {};
        vehicles.forEach(v => {
          vehicleMap[v.id] = v.plate_number || v.plateNumber || 'No Plate';
        });

        const myReservations = res.filter(r => r.user === user.id);

        const reservationsWithDetails = await Promise.all(
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

            return {
              ...r,
              garage_name: garageName,
              vehicle_plate: vehicleMap[r.vehicle] || `ID: ${r.vehicle}`
            };
          })
        );

        const sorted = reservationsWithDetails.sort(
          (a, b) => new Date(b.start_time) - new Date(a.start_time)
        );

        setReservations(sorted);
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
      await reservationAPI.cancelReservation(id);
      setMessage('✅ Reservation cancelled.');
      setReservations(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  const startEditing = (res) => {
    setEditingId(res.id);
    setEditStart(res.start_time.slice(0, 16)); // format: "YYYY-MM-DDTHH:mm"
    setEditEnd(res.end_time.slice(0, 16));
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditStart('');
    setEditEnd('');
  };

  const handleSave = async (id) => {
    try {
      const update = {...current}
      update.start_time = new Date(editStart).toISOString()
      update.end_time= new Date(editEnd).toISOString()

      const updatedData = {
        start_time: new Date(editStart).toISOString(),
        end_time: new Date(editEnd).toISOString(),
        vehicle: current.vehicle
      };
      await reservationAPI.updateReservation(id, updatedData);

      setReservations(prev =>
        prev.map(r => r.id === id
          ? { ...r, start_time: updatedData.start_time, end_time: updatedData.end_time }
          : r
        )
      );

      setMessage('✅ Reservation updated.');
      cancelEditing();
    } catch (err) {
      setMessage(`❌ Update failed: ${err.message}`);
    }
  };

  if (loading) return <p>Loading reservations...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (reservations.length === 0) return <p>No active reservations.</p>;

  const now = new Date();
  const upcoming = reservations.filter(r => new Date(r.end_time) > now);
  const history = reservations.filter(r => new Date(r.end_time) <= now);

  const current = upcoming[0]; // The soonest upcoming reservation
  const others = upcoming.slice(1);

  return (
    <>
      <h2 className="reservations-title">Your Reservations</h2>

      {current && (
        <div className="newest-reservation-section">
          <h3 className="section-subtitle">Current Reservation</h3>

          <div className="reservation-card newest">
            <p><strong>Garage:</strong> {current.garage_name}</p>
            <p><strong>Spot:</strong> {current.parking_spot}</p>
            <p><strong>Vehicle:</strong> {current.vehicle_plate}</p>

            {editingId === current.id ? (
              <>
                <label>Start Time:</label>
                <input
                  type="datetime-local"
                  value={editStart}
                  onChange={e => setEditStart(e.target.value)}
                />
                <label>End Time:</label>
                <input
                  type="datetime-local"
                  value={editEnd}
                  onChange={e => setEditEnd(e.target.value)}
                />
                <button onClick={() => handleSave(current.id)}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
              </>
            ) : (
              <>
                <p><strong>Start:</strong> {new Date(current.start_time).toLocaleString()}</p>
                <p><strong>End:</strong> {new Date(current.end_time).toLocaleString()}</p>
                <button onClick={() => startEditing(current)}>Edit</button>
                <button onClick={() => handleCancel(current.id)}>Cancel</button>
              </>
            )}
          </div>
        </div>
      )}

      {others.length > 0 && (
        <>
          <hr className="divider-line" />
          <div className="other-upcoming-reservations">
            <h3 className="section-subtitle">Upcoming Reservations</h3>
            <div className="older-reservations-row">
              {others.map(res => (
                <div key={res.id} className="reservation-card">
                  <p><strong>Garage:</strong> {res.garage_name}</p>
                  <p><strong>Spot:</strong> {res.parking_spot}</p>
                  <p><strong>Vehicle:</strong> {res.vehicle_plate}</p>
                  <p><strong>Start:</strong> {new Date(res.start_time).toLocaleString()}</p>
                  <p><strong>End:</strong> {new Date(res.end_time).toLocaleString()}</p>
                  <button onClick={() => handleCancel(res.id)}>Cancel</button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      

      {message && <p className="reservation-message">{message}</p>}
    </>
  );
}
