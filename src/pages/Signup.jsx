import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as usersAPI from '../utilities/users-api';

export default function Signup({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  function handleChange(evt) {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
    setError('');
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      const user = await usersAPI.signup(formData);
      if (user) {
        setUser(user); // Set user in App state
        navigate('/dashboard'); // Redirect after signup
      } else {
        setError('Signup failed. Try again.');
      }
    } catch (err) {
      setError('Signup failed. Please try again.');
    }
  }

  return (
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
        <button type="submit">Create Account</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
