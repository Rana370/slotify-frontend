import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as vehicleAPI from "../utilities/vehicles-api";

export default function Vehicle() {
  const [formData, setFOrmData] = useState({
    plate_number: "",
    model: "",
    type: "",
    color: "#000000",
  })

  const navigate = useNavigate();

  const vehicleTypes = ['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible', 'Electric', 'Van'];
  const vehicleModels = [
    'Toyota', 'Tesla', 'Ford', 'BMW', 'Chevrolet', 'Honda', 'Hyundai',
    'Nissan', 'Kia', 'Mazda', 'Land Rover'
  ];

  function handleChange(evt) {
    console.log(evt.target.name, evt.target.value)
    setFOrmData({...formData, [evt.target.name]: evt.target.value})
  }


  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const newVehicle = await vehicleAPI.create(formData);
      console.log(newVehicle)
      navigate('/garages');
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <>
      
      <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
        <h2>Add a Vehicle</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Plate Number"
            value={formData.plate}
            onChange={handleChange}
            name="plate_number"
            required
          /><br />

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
              <option key={m} >{m}</option>
            ))}
          </datalist><br />

          <select
            value={formData.type}
            onChange={handleChange}
            name="type"
            required
          >
            <option value="Select Vehicle Type">Select Vehicle Type</option>
            {vehicleTypes.map((vType) => (
              <option key={vType} >
                {vType}
              </option>
            ))}
          </select><br />

          <label>
            Vehicle Color:
            <input
              type="color"
              value={formData.color}
              onChange={handleChange}
              style={{ marginLeft: '10px' }}
              name="color"
            />
          </label><br /><br />

          <button type="submit" >Add Vehicle</button>
        </form>
      </div>
    </>
  );
}
