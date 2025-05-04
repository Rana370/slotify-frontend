import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Vehicle() {
  const [plate, setPlate] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState('');
  const [color, setColor] = useState('#000000'); // ✅ Color picker state
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const vehicleTypes = ['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible', 'Electric', 'Van'];
  const vehicleModels = [
    'Toyota', 'Tesla', 'Ford', 'BMW', 'Chevrolet', 'Honda', 'Hyundai',
    'Nissan', 'Kia', 'Mazda', 'Land Rover'
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://127.0.0.1:8000/api/vehicles/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plate_number: plate,
          model: model,
          type: type,
          color: color, // ✅ Include color in request
        }),
      });

      const data = await res.json();
      console.log('✅ Vehicle POST response:', data);

      if (!res.ok) {
        const detail =
          data.detail ||
          data.plate_number?.[0] ||
          data.model?.[0] ||
          data.type?.[0] ||
          data.color?.[0] ||
          'Failed to add vehicle';
        throw new Error(detail);
      }

      navigate('/reservations');
    } catch (err) {
      console.error('❌ Error:', err);
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      
      <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
        <h2>Add a Vehicle</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Plate Number"
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            required
          /><br />

          <input
            type="text"
            placeholder="Vehicle Model"
            list="model-suggestions"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
          />
          <datalist id="model-suggestions">
            {vehicleModels.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist><br />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">Select Vehicle Type</option>
            {vehicleTypes.map((vType) => (
              <option key={vType} value={vType}>
                {vType}
              </option>
            ))}
          </select><br />

          <label>
            Vehicle Color:
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ marginLeft: '10px' }}
            />
          </label><br /><br />

          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Vehicle'}
          </button>
        </form>

        {message && (
          <p style={{ marginTop: '10px', color: message.includes('❌') ? 'red' : 'green' }}>
            {message}
          </p>
        )}
      </div>
    </>
  );
}
