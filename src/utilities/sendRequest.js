export default async function sendRequest(url, method = 'GET', payload) {
	const token = localStorage.getItem('token');
	const options = { method };

	if (payload) {
		options.headers = { 'Content-Type': 'application/json' };
		options.body = JSON.stringify(payload);
	}

	if (token) {
		options.headers = options.headers || {};
		options.headers.Authorization = `Bearer ${token}`;
	}

	try {
		const res = await fetch(`http://127.0.0.1:8000${url}`, options);

		if (res.status === 204) return null; // No Content
		if (res.ok) return await res.json();

		// Optionally handle non-OK responses here
		throw new Error(`Request failed with status ${res.status}`);
	} catch (err) {
		console.log(err, "error in send-request");
		return err;
	}
}
