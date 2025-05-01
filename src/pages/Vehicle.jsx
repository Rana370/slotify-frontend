import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Vehicle() {
  const [plate, setPlate] = useState('');
  const [model, setModel] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

 
  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    console.log('🚨 Access token:', token); 

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
        }),
      });

      const data = await res.json();
      console.log('Vehicle POST response:', data); 

      if (!res.ok) {
        const detail =
          data.detail ||
          data.plate_number?.[0] ||
          data.type?.[0] ||
          'Failed to add vehicle';
        throw new Error(detail);
      }

      // ✅ Redirect on success
      navigate('/reservations');
    } catch (err) {
      console.error('Error:', err);
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
   
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
          value={model}
          onChange={(e) => setModel(e.target.value)}
          required
        /><br />
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Vehicle'}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: '10px', color: message.includes('❌') ? 'red' : 'green' }}>
          {message}
        </p>
      )}
    </>
  );
}
