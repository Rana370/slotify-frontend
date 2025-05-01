// src/utilities/sendRequest.js
export default async function sendRequest(url, method = 'GET', payload = null) {
    const options = { method, headers: {} };
  
    if (payload) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(payload);
    }
  
    const token = localStorage.getItem('token');
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
  
    const res = await fetch(url, options);
    if (!res.ok) throw new Error('Request failed');
    return res.json();
  }
  