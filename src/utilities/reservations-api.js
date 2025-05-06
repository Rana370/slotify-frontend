import sendRequest from './sendRequest';

const BASE_URL = '/reservations';

// Get all reservations (admin or filter later)
export function getAllReservations() {
  return sendRequest(`${BASE_URL}/`);
}

// Create a new reservation
export function createReservation(data) {
  return sendRequest(`${BASE_URL}/`, 'POST', data);
}

// Cancel (delete) a reservation by ID
export function cancelReservation(id) {
  return sendRequest(`${BASE_URL}/${id}/`, 'DELETE');
}

// Update a reservation by ID (e.g., to change time)
export function updateReservation(id, data) {
  return sendRequest(`${BASE_URL}/${id}/`, 'PUT', data);
}

// ✅ NEW: Get all reservations for a specific vehicle
export function getReservationsByVehicle(vehicleId) {
  return sendRequest(`${BASE_URL}/vehicle/${vehicleId}/`);
}
