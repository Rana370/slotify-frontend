// src/utilities/users-api.js
import sendRequest from './sendRequest';

const BASE_URL = "/users";

// Signup - adjust endpoint if your backend differs
export async function signup(formData) {
  try {
    const response = await sendRequest(`${BASE_URL}/register/`, 'POST', formData);
    localStorage.setItem('token', response.access);  // Save JWT access token
    return response.user || true;
  } catch (err) {
    localStorage.removeItem('token');
    return null;
  }
}

// Login - if using SimpleJWT, change URL to /api/token/
export async function login(credentials) {
  try {
    const response = await sendRequest(`${BASE_URL}/login/`, 'POST', credentials);
    localStorage.setItem('token', response.access);  // Save JWT token
    return response.user || true;
  } catch (err) {
    return false;
  }
}

// Logout
export function logout() {
  localStorage.removeItem('token');
}

// Get current user info (requires token)
export async function getUser() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const response = await sendRequest(`${BASE_URL}/token/`, 'GET');  // adjust URL as needed
    return response;
  } catch (err) {
    return null;
  }
}
