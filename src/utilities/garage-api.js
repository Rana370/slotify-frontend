import sendRequest from './sendRequest';
const url = "/garages";

export function getGarages() {
    return sendRequest(`${url}/`)
}

export function show(garageId) {
    return sendRequest(`${url}/${garageId}/`)
}

export function getSpots(garageId) {
    return sendRequest(`${url}/${garageId}/spots/`)
}
