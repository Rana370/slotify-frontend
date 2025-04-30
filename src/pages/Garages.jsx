import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Garages() {
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/garages/')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch garages');
        return res.json();
      })
      .then(data => {
        setGarages(data);
        console.log(garages)
        setError('');
      })
      .catch(err => {
        setError(err.message || 'Something went wrong');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading garages...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (garages.length === 0) return <p>No garages available.</p>;

  return (
    <div>
      <h2>Available Garages</h2>
      <ul>
        {garages.map(garage => (
          <li key={garage.id}>
            <Link to={`/garage/${garage.id}`}>{garage.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
