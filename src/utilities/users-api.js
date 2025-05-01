// src/utilities/users-api.js
import sendRequest from './sendRequest';

const BASE_URL = 'http://localhost:8000/api';

export async function signup(formData) {
  try {
    const response = await sendRequest(`${BASE_URL}/register/`, 'POST', formData);
    localStorage.setItem('token', response.access);  // Save access token
    console.log('form',formData)
    console.log('response',response)
    return response.user;  // Return user info for setting state
  } catch (err) {
    localStorage.removeItem('token');
    return null;
  }
}

export async function login(credentials) {
  try {
    const response = await sendRequest(`${BASE_URL}/token/`, 'POST', credentials);
    localStorage.setItem('token', response.access);  // Save access token
    return true;  // Indicate success
  } catch (err) {
    return false;  // Indicate failure
  }
}

export function logout() {
  localStorage.removeItem('token');  // Clear token on logout
}
