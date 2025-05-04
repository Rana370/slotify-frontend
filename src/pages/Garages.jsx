import '../static/Garages.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as garageAPI from "../utilities/garage-api";

export default function Garages() {
  const [garages, setGarages] = useState([]);

  useEffect(() => {
    async function getGarages() {
      try {
        console.log("should be getting garages")
        const allGarages = await garageAPI.getGarages();
        setGarages(allGarages)
      } catch (err) {
        console.log(err)
        setGarages([])
      }
    }
    getGarages();
    console.log("testing use effect")
  }, []);

  if (garages.length === 0) return <p>No garages available.</p>;

  return (
    <div className="garages-container">
      <h2>Available Garages</h2>
      <ul className="garages-list">
        {garages.map(garage => (
          <li key={garage.id}>
            <Link to={`/garage/${garage.id}`}>{garage.name}</Link>
            <p className={`availability ${garage.available_spots === 0 ? 'full' : ''}`}>
              {garage.available_spots > 0
                ? `${garage.available_spots} spots available`
                : 'Full'}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
