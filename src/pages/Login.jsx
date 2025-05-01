import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as usersAPI from '../utilities/users-api';

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  function handleChange(evt) {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
    setError('');
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    const success = await usersAPI.login(formData);
    if (success) {
      setUser({}); // You can decode token later for user info
      navigate('/dashboard');
    } else {
      setError('Login failed. Check your credentials.');
    }
  }

  return (
    <div className="LoginPage">
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Log In</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
