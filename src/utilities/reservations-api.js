import sendRequest from './sendRequest';
const url = '/reservations';

export function getAllReservations() {
  return sendRequest(`${url}/`);
}

// export function getUserReservations(id) {
//   return sendRequest(`${url}/user/${id}`);
// }

export function createReservation(data) {
  return sendRequest(`${url}/`, 'POST', data);
}

export function cancelReservation(id) {
  return sendRequest(`${url}/${id}/`, 'DELETE');
}
