/**
 * GET request
 * @param {string} url URL to GET
 * @param {string} token passport auth token
 * @param {[]} headers Array of objects for headers
 * @param {string} responseType XHR response type
 * ex. `{name: 'Content-type', value: 'application/json'}`
 * @returns {Promise<XMLHttpRequest>} promise resolves an xhr object
 */
export function get(url, token, headers, responseType) {
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);

		if (token) xhr.setRequestHeader('Authorization', 'Token ' + token);
		if (responseType) xhr.responseType = responseType;

		headers.forEach((item) => {
			xhr.setRequestHeader(item.name, item.value);
		});

		xhr.onreadystatechange = () => {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				resolve(xhr);
			};
		};

		xhr.send();
	});
};

/**
 * POST request
 * @param {string} url URL to POST
 * @param {any} body data to POST
 * @param {string} token passport auth token
 * @param {[]} headers Array of objects for headers
 * ex. `{name: 'Content-type', value: 'application/json'}`
 * @returns {Promise<XMLHttpRequest>} promise resolves an xhr object
 */
export function post(url, body, token, headers) {
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();
		xhr.open('POST', url, true);

		if (token) xhr.setRequestHeader('Authorization', 'Token ' + token);

		headers.forEach((item) => {
			xhr.setRequestHeader(item.name, item.value);
		});

		xhr.onreadystatechange = () => {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				resolve(xhr);
			};
		};
		
		xhr.send(body);
	});
};

/**
 * PUT request
 * @param {string} url URL to PUT
 * @param {any} body data to PUT
 * @param {string} token passport auth token
 * @param {[]} headers Array of objects for headers
 * ex. `{name: 'Content-type', value: 'application/json'}`
 * @returns {Promise<XMLHttpRequest>} promise resolves an xhr object
 */
export function put(url, body, token, headers) {
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();
		xhr.open('PUT', url, true);

		if (token) xhr.setRequestHeader('Authorization', 'Token ' + token);

		headers.forEach((item) => {
			xhr.setRequestHeader(item.name, item.value);
		});

		xhr.onreadystatechange = () => {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				resolve(xhr);
			};
		};
		
		xhr.send(body);
	});
};

/**
 * DELETE request
 * @param {string} url URL to DELETE
 * @param {string} token passport auth token
 * @param {[]} headers Array of objects for headers
 * ex. `{name: 'Content-type', value: 'application/json'}`
 * @returns {Promise<XMLHttpRequest>} promise resolves an xhr object
 */
export function del(url, token, headers) {
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();
		xhr.open('DELETE', url, true);

		if (token) xhr.setRequestHeader('Authorization', 'Token ' + token);

		headers.forEach((item) => {
			xhr.setRequestHeader(item.name, item.value);
		});

		xhr.onreadystatechange = () => {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				resolve(xhr);
			};
		};
		
		xhr.send();
	});
};