import '../static/GarageDetail.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as garageAPI from "../utilities/garage-api";
import * as vehiclesAPI from "../utilities/vehicles-api";
import * as reservationAPI from '../utilities/reservations-api'

export default function GarageDetail() {
  const { id } = useParams();
  const [garage, setGarage] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [spots, setSpots] = useState([]);
  const [message, setMessage] = useState('');

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

      const res = await reservationAPI.createReservation()
      console.log('reservations', res)
      if (!res.ok) throw new Error('Reservation failed.');

      setMessage('✅ Reservation successful!');
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  if (!garage) return <p>No garage found.</p>;

  return (
    <div className="parking-lot">
      {/* Garage Name & Location */}
      <div className="garage-header">
        <h2>{garage.name}</h2>
        <div className="garage-location-wrapper">
          <div className="location-text">
            <strong>Location:</strong><br />
            {garage.location}
          </div>
          <div className="location-map">
            <iframe
              title="garage-map"
              width="250"
              height="150"
              frameBorder="0"
              style={{ border: 0, borderRadius: '8px' }}
              src={`https://www.google.com/maps?q=${encodeURIComponent(garage.location)}&output=embed`}
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>

      {/* Divider Line */}
      <hr className="section-divider" />

      {/* Vehicle Selector */}
      <div className="vehicle-select-container">
        <h3>Select Your Vehicle</h3>
        <select
          value={selectedVehicle}
          onChange={(e) => setSelectedVehicle(e.target.value)}
        >
          <option value="">-- Select Vehicle --</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.plate_number} ({vehicle.type || 'Vehicle'})
            </option>
          ))}
        </select>
      </div>

      {/* Parking Layout */}
      <h3 className="section-title">Parking Spots</h3>
      <div className="garage-layout">
        {/* Top row (A spots) */}
        <div className="row upper-row">
          {spots
            .filter((s) => s.number.startsWith('A'))
            .map((spot) => (
              <div
                key={spot.id}
                className={`spot ${spot.is_reserved ? 'reserved' : 'available'}`}
                onClick={() => !spot.is_reserved && handleReserve(spot.id)}
              >
                {spot.number}
              </div>
            ))}
        </div>

        {/* Middle lane with arrow */}
        <div className="lane-street">
          <div className="lane-line" />
          <div className="lane-arrow">⬆️</div>
          <div className="lane-line" />
        </div>

        {/* Bottom row (B spots) */}
        <div className="row lower-row">
          {spots
            .filter((s) => s.number.startsWith('B'))
            .map((spot) => (
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

      {/* Success/Error Message */}
      {message && (
        <p style={{ marginTop: '20px', color: message.includes('✅') ? 'green' : 'red', textAlign: 'center' }}>
          {message}
        </p>
      )}
    </div>
  );
}
