import sendRequest from './sendRequest';
const url = "/vehicles";


export function getUserVehicles() {
    return sendRequest(`${url}/users`)
}






