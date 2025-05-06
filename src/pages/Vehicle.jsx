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
  const [editingId, setEditingId] = useState(null);

  const navigate = useNavigate();

  const vehicleTypes = ['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible', 'Electric', 'Van'];
  const vehicleModels = [
    'Toyota', 'Tesla', 'Ford', 'BMW', 'Chevrolet', 'Honda', 'Hyundai',
    'Nissan', 'Kia', 'Mazda', 'Land Rover'
  ];

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await vehicleAPI.updateVehicle(editingId, formData);
        setEditingId(null);
      } else {
        await vehicleAPI.create(formData);
      }
      setFormData({ plate_number: "", model: "", type: "", color: "#000000" });
      fetchVehicles();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (vehicle) => {
    setFormData({
      plate_number: vehicle.plate_number,
      model: vehicle.model,
      type: vehicle.type,
      color: vehicle.color,
    });
    setEditingId(vehicle.id);
  };

  const handleDelete = async (id) => {
    try {
      await vehicleAPI.deleteVehicle(id);
      fetchVehicles();
    } catch (err) {
      console.error("Error deleting vehicle:", err);
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
          <h2>{editingId ? "Edit Vehicle" : "Create a Vehicle"}</h2>
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

            <button type="submit">{editingId ? "Update Vehicle" : "Add Vehicle"}</button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ plate_number: "", model: "", type: "", color: "#000000" });
                }}
              >
                Cancel
              </button>
            )}
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
                <p><strong>Plate Number:</strong> {v.plate_number}</p>
                <p><strong>Model:</strong> {v.model}</p>
                <p><strong>Type:</strong> {v.type}</p>
                <p><strong>Color:</strong> 
                  <span className="color-box" style={{ backgroundColor: v.color }}></span>
                </p>
                <div className="vehicle-actions">
                  <button onClick={() => handleEdit(v)}>Edit</button>
                  <button onClick={() => handleDelete(v.id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
