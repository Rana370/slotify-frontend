import '../static/GarageDetail.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as garageAPI from "../utilities/garage-api";
import * as vehiclesAPI from "../utilities/vehicles-api";

export default function GarageDetail() {
  const { id } = useParams();
  const [garage, setGarage] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [spots, setSpots] = useState([]);
  const [message, setMessage] = useState('');
console.log(id)
  useEffect(() => {
    async function getGarageInfo() {
      try {
        const garageDetail = await garageAPI.show(id)
        const garageSpots = await garageAPI.getSpots(id);
        // const userVehicles = await vehiclesAPI.getUserVehicles();
        console.log(garageDetail, garageSpots, "testing detail 23")
        setGarage(garageDetail);
        setSpots(garageSpots);
        // setVehicles(userVehicles);
      } catch (err) {
        setGarage(null);
        setSpots([]);
        setVehicles([]);
      }
    }
    getGarageInfo()
  }, [id]);


  useEffect(() => {
    async function getGarageInfo() {
      try {
        const garageDetail = await garageAPI.show(id);
        const garageSpots = await garageAPI.getSpots(id);
        const userVehicles = await vehiclesAPI.getUserVehicles();
  
        console.log(garageDetail, garageSpots, userVehicles, "testing detail 42");
  
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
  


  
  // // ✅ Handle reservation
  // const handleReserve = async (spotId) => {
  //   if (!selectedVehicle) {
  //     setMessage('⚠️ Please select a vehicle first.');
  //     return;
  //   }

  //   const now = new Date();
  //   const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

  //   const reservationData = {
  //     parking_spot: spotId,
  //     vehicle: selectedVehicle,
  //     start_time: now.toISOString(),
  //     end_time: oneHourLater.toISOString(),
  //   };

  //   try {
  //     await sendRequest('http://127.0.0.1:8000/api/reservations/', 'POST', reservationData);
  //     setMessage('✅ Reservation successful!');
  //   } catch (err) {
  //     setMessage(`❌ ${err.message}`);
  //   }
  // };


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
            {vehicle.plate_number} ({vehicle.type || 'Vehicle'})
          </option>
        ))}
      </select>

      <h3>Parking Spots</h3>
      <div className="parking-grid">
        {spots.length > 0 ? (
          spots.map((spot) => (
            <div
              // key={spot.id}
              // className={`spot ${spot.is_reserved ? 'reserved' : 'available'}`}
              // onClick={() => !spot.is_reserved && handleReserve(spot.id)}
            >
              {spot.number}
            </div>
          ))
        ) : (
          <p>No parking spots found.</p>
        )}
      </div>

      {message && (
        <p style={{ marginTop: '20px', color: message.includes('✅') ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </>
  );
}
