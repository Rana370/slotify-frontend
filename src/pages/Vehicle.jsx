import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as vehicleAPI from "../utilities/vehicles-api";
import '../static/Vehicle.css';
import carImage from "../assets/landrover.png";

export default function Vehicle() {
  const [formData, setFormData] = useState({
    plate_number: "",
    model: "",
    type: "",
    color: "#000000",
  });

  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();

  const vehicleTypes = ['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible', 'Electric', 'Van'];
  const vehicleModels = [
    'Toyota', 'Tesla', 'Ford', 'BMW', 'Chevrolet', 'Honda', 'Hyundai',
    'Nissan', 'Kia', 'Mazda', 'Land Rover'
  ];

  function handleChange(evt) {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newVehicle = await vehicleAPI.create(formData);
      setFormData({ plate_number: "", model: "", type: "", color: "#000000" });
      fetchVehicles();
    } catch (err) {
      console.log(err);
    }
  };

  const fetchVehicles = async () => {
    try {
      const data = await vehicleAPI.getUserVehicles();
      setVehicles(data);
    } catch (err) {
      console.error("Failed to fetch vehicles:", err);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div className="vehicle-wrapper">
      <div className="top-row">
        <div className="image-section">
          <img src={carImage} alt="car" className="vehicle-image" />
        </div>

        <div className="form-section">
          <h2>Create a Vehicle</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Plate Number"
              value={formData.plate_number}
              onChange={handleChange}
              name="plate_number"
              required
            />

            <input
              type="text"
              placeholder="Vehicle Model"
              list="model-suggestions"
              value={formData.model}
              onChange={handleChange}
              name="model"
              required
            />
            <datalist id="model-suggestions">
              {vehicleModels.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </datalist>

            <select
              value={formData.type}
              onChange={handleChange}
              name="type"
              required
            >
              <option value="">Select Vehicle Type</option>
              {vehicleTypes.map((vType) => (
                <option key={vType}>{vType}</option>
              ))}
            </select>

            <label className="color-picker">
              Vehicle Color:
              <input
                type="color"
                value={formData.color}
                onChange={handleChange}
                name="color"
              />
            </label>

            <button type="submit">Add Vehicle</button>
          </form>
        </div>
      </div>

      <hr className="vehicle-divider" />

      <div className="vehicle-gallery-wrapper">
        <h2 className="vehicle-section-header">All Vehicles</h2>
        <div className="vehicle-gallery">
          {vehicles.length === 0 ? (
            <p>No vehicles added yet.</p>
          ) : (
            vehicles.map((v) => (
              <div key={v.id} className="vehicle-card">
                <p><strong>Garage:</strong> {v.reservation?.garage?.name || 'N/A'}</p>
                <p><strong>Plate Number:</strong> {v.plate_number}</p>
                <p><strong>Model:</strong> {v.model}</p>
                <p><strong>Type:</strong> {v.type}</p>
                <p><strong>Color:</strong> 
                  <span
                    className="color-box"
                    style={{ backgroundColor: v.color }}
                  ></span>
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
