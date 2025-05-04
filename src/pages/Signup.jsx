import '../static/Signup.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as usersAPI from '../utilities/users-api';

export default function Signup({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [error, setError] = useState('');

  function handleChange(evt) {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
    setError('');
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    if (formData.password !== formData.confirm) {
      return setError('Passwords do not match');
    }

    const success = await usersAPI.signup(formData);
    if (success) {
      setUser({});
      navigate('/dashboard');
    } else {
      setError('Signup failed.');
    }
  }

  return (
    <div className="SignupWrapper">
      <div className="SignupPage">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
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
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirm"
            value={formData.confirm}
            onChange={handleChange}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
}
