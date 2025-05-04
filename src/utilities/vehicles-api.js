import sendRequest from './sendRequest';
const url = "/vehicles";


export function getUserVehicles() {
    return sendRequest(`${url}/users`)
}

export function create(formData) {
    console.log(formData, "form info for new vehicle")
    return sendRequest(`${url}/`, "POST", formData)
}






