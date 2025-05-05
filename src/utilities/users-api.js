// src/utilities/users-api.js
import sendRequest from './sendRequest';
const url = "/users"

export async function signup(formData) {
  try {
    const response = await sendRequest(`${url}/register/`, 'POST', formData);
    localStorage.setItem('token', response.access);  // Save access token
    console.log("response:  ", response)
    return response.user;  // Return user info for setting state
  } catch (err) {
    localStorage.removeItem('token');
    return null;
  }
}

export async function login(credentials) {
  try {
    const response = await sendRequest(`${url}/login/`, 'POST', credentials);
    localStorage.setItem('token', response.access);  // Save access token
    return response.user;  // Indicate success
  } catch (err) {
    return false;  // Indicate failure
  }
}

export function logout() {
  localStorage.removeItem('token');  // Clear token on logout
}


export async function getUser() {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            const response = await sendRequest(`${url}/token/`)
            localStorage.setItem('token', response.access);
            return response.user
        }
        return null;
    } catch (err) {
        console.log(err);
        return null;
    }
}