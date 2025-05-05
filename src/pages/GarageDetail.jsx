import '../static/GarageDetail.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as garageAPI from "../utilities/garage-api";
import * as vehiclesAPI from "../utilities/vehicles-api";
import * as reservationAPI from '../utilities/reservations-api';

export default function GarageDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [garage, setGarage] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [spots, setSpots] = useState([]);
  const [message, setMessage] = useState('');
  const [reservationDate, setReservationDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    async function getGarageInfo() {
      try {
        const garageDetail = await garageAPI.show(id);
        const garageSpots = await garageAPI.getSpots(id);
        const userVehicles = await vehiclesAPI.getUserVehicles();

        setGarage(garageDetail);
        setSpots(garageSpots);
        setVehicles(userVehicles);
      } catch (err) {
        setGarage(null);
        setSpots([]);
        setVehicles([]);
      }
    }
    getGarageInfo();
  }, [id]);

  const handleReserve = async (spotId) => {
    if (!selectedVehicle || !reservationDate || !startTime || !endTime) {
      setMessage('⚠️ Please select vehicle, date, start and end time.');
      return;
    }

    const startDateTime = new Date(`${reservationDate}T${startTime}`);
    const endDateTime = new Date(`${reservationDate}T${endTime}`);

    const reservationData = {
      parking_spot: spotId,
      vehicle: selectedVehicle,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      garage: garage.id,
      user_id: user.id
    };

    try {
      const res = await reservationAPI.createReservation(reservationData);
      setMessage(res ? '✅ Reservation successful!' : '❌ Reservation failed. Something went wrong!');
    } catch (err) {
      console.error(err);
      setMessage(`❌ Reservation failed. ${err.message}`);
    }
  };

  if (!garage) return <p>No garage found.</p>;

  return (
    <div className="parking-lot">
      {/* Garage Header */}
      <div className="garage-header">
        <h2>{garage.name}</h2>
        <div className="garage-location-wrapper">
          <div className="location-text-box">
            <strong>Location:</strong><br />
            {garage.location}
          </div>
          <div className="location-map">
            <iframe
              title="garage-map"
              width="600"
              height="350"
              frameBorder="0"
              style={{ border: 0, borderRadius: '8px' }}
              src={`https://www.google.com/maps?q=${encodeURIComponent(garage.location)}&output=embed`}
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>

      <hr className="section-divider" />

      {/* Selection Form */}
      <h3 className="vehicle-date-heading">Choose Your</h3>
      <div className="vehicle-date-wrapper">
        {/* Vehicle Card */}
        <div className="card-box">
          <label>Vehicle</label>
          <select value={selectedVehicle} onChange={(e) => setSelectedVehicle(e.target.value)}>
            <option value="">-- Select Vehicle --</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.plate_number} ({vehicle.type || 'Vehicle'})
              </option>
            ))}
          </select>
        </div>

        {/* Date/Time Card */}
        <div className="card-box">
          <label>Date</label>
          <input
            type="date"
            value={reservationDate}
            onChange={(e) => setReservationDate(e.target.value)}
          />

          <label>Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />

          <label>End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>

      <hr className="section-divider" />

      {/* Parking Layout */}
      <h3 className="section-title">Parking Spots</h3>
      <div className="garage-layout">
        <div className="row upper-row">
          {spots.filter(s => s.number.startsWith('A')).map((spot) => (
            <div
              key={spot.id}
              className={`spot ${spot.is_reserved ? 'reserved' : 'available'}`}
              onClick={() => !spot.is_reserved && handleReserve(spot.id)}
            >
              {spot.number}
            </div>
          ))}
        </div>

        <div className="lane-street">
          <div className="lane-arrow-left">⬅⬅⬅⬅⬅⬅⬅⬅⬅⬅⬅⬅⬅⬅⬅⬅⬅⬅⬅⬅⬅⬅⬅⬅⬅⬅⬅⬅</div>
        </div>

        <div className="row lower-row">
          {spots.filter(s => s.number.startsWith('B')).map((spot) => (
            <div
              key={spot.id}
              className={`spot ${spot.is_reserved ? 'reserved' : 'available'}`}
              onClick={() => !spot.is_reserved && handleReserve(spot.id)}
            >
              {spot.number}
            </div>
          ))}
        </div>
      </div>

      {/* Check Reservation Button */}
      <div className="check-reservation-container">
        <button className="check-reservation-btn" onClick={() => navigate('/reservations')}>
          Check Your Reservation
        </button>
      </div>

      {message && (
        <p className="reservation-message">{message}</p>
      )}

      <hr className="section-divider" />

      {/* Price Section */}
      <div className="price-section">
        <div className="price-card">
          <h3>Price</h3>
          <div className="price-grid">
            <div>
              <p><strong>1 Hour</strong></p>
              <p>3 SAR</p>
            </div>
            <div>
              <p><strong>2 Hours</strong></p>
              <p>6 SAR</p>
            </div>
            <div>
              <p><strong>3 Hours</strong></p>
              <p>9 SAR</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
