export function apiCreateUser(user) {
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();
		xhr.open('POST', window.origin + `/api/users`, true);
		xhr.setRequestHeader('Content-type', 'application/json');

		xhr.onreadystatechange = () => {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (xhr.status === 200) {
					let session;
					try {
						session = JSON.parse(xhr.response);
					} catch {
						reject('Bad JSON!');
					};
					resolve(session);
				} else {
					reject(xhr.status);
				};
			};
		};

		xhr.send(JSON.stringify(user));
	});
};

export function apiLoginUser(email, password) {
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();
		xhr.open('POST', window.origin + `/api/users/session`, true);
		xhr.setRequestHeader('Content-type', 'application/json');

		xhr.onreadystatechange = () => {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (xhr.status === 200) {
					let session;
					try {
						session = JSON.parse(xhr.response);
					} catch {
						reject('Bad JSON!');
					};
					resolve(session);
				} else {
					reject(xhr.status);
				};
			};
		};

		xhr.send(JSON.stringify({
			email: email,
			password: password
		}));
	});
};

export function apiCheckToken(token) {
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();
		xhr.open('GET', window.origin + '/api/users/session', true);
		xhr.setRequestHeader('Authorization', `Token ${token}`);
		xhr.setRequestHeader('Content-type', 'application/json');

		xhr.onreadystatechange = () => {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (xhr.status === 200) {
					let session;
					try {
						session = JSON.parse(xhr.response);
					} catch {
						reject('Bad JSON!');
					};
					resolve(session);
				} else {
					const reason = xhr.response.toString().includes('jwt expired') ? 'expired' : xhr.status;
					reject(reason);
				};
			};
		};

		xhr.send();
	});
};