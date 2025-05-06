import sendRequest from './sendRequest';
const url = "/vehicles";


export function getUserVehicles() {
    return sendRequest(`${url}/`)
}

export function create(formData) {
    console.log(formData, "form info for new vehicle")
    return sendRequest(`${url}/`, "POST", formData)
}


export function updateVehicle(id, formData) {
    console.log(formData, "updating vehicle with id", id);
    return sendRequest(`${url}/${id}/`, "PUT", formData);
  }
  
  export function deleteVehicle(id) {
    return sendRequest(`${url}/${id}/`, "DELETE");
  }



