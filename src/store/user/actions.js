import { get, post } from '../../utils/requests';

import { sendNotification } from '../notifications/actions';

// ----------------------------------------------------------------------------
export const CREATE_BEGIN = 'CREATE_BEGIN';
export const CREATE_SUCCESS = 'CREATE_SUCCESS';
export const CREATE_FAILURE = 'CREATE_FAILURE';

export function createBegin() {
	return { type: CREATE_BEGIN };
};
export function createSuccess(session) {
	return { type: CREATE_SUCCESS, session: session };
};
export function createFailure() {
	return { type: CREATE_FAILURE };
};

/**
 * Create a new user
 * @param {{}} user {email: 'email@domain.tld', password: 'password', code: 'invitecode'}
 */
export function createUser(user, callback) {
	return (dispatch) => {
		// clear the session from localstorage
		localStorage.removeItem('session');
		// begin login sequence
		dispatch(createBegin());

		// new post request
		return post(
			// set url to request
			window.origin + '/api/users',
			// set request body to the user object
			JSON.stringify(user),
			// no token used here
			null,
			// headers array (specify content type as json)
			[{name: 'Content-type', value: 'application/json'}]
		).then((result) => {
			// on a 200 code
			if (result.status === 200) {
				try {
					// try parsing the response
					let session = JSON.parse(result.response);

					// set session into local storage
					localStorage.setItem('session', JSON.stringify(session));
					// dispatch the success event
					dispatch(createSuccess(session));
					dispatch(sendNotification({
						variant: 'success',
						text: 'Account created!'
					}));
					if (callback) callback();
				} catch {
					// if we fail to parse fail the login sequence with an error message
					dispatch(createFailure());
					dispatch(sendNotification({
						variant: 'error',
						text: 'Error verifying login!'
					}));
				}
			} else if (result.status === 422) {
				// a 422 code is missing required fields in the payload
				dispatch(createFailure());
				dispatch(sendNotification({
					variant: 'error',
					text: 'Missing required fields!'
				}));
			} else if (result.status === 409) {
				// if we get a 409 code the user already exists
				dispatch(createFailure());
				dispatch(sendNotification({
					variant: 'error',
					text: 'Username already exists!'
				}));
			} else if (result.status === 403) {
				// if we get a 403 code the invite can't be used by this user
				dispatch(createFailure());
				dispatch(sendNotification({
					variant: 'error',
					text: 'Invite code is restricted!'
				}));
			} else if (result.status === 440) {
				// if we get a 440 code the invite is expired
				dispatch(createFailure());
				dispatch(sendNotification({
					variant: 'error',
					text: 'Invite code is expired!'
				}));
			} else {
				// else just fail
				console.error('failed to create account');
				console.error(result);
				dispatch(createFailure());
				dispatch(sendNotification({
					variant: 'error',
					text: 'Error creating the account!'
				}));
			}
		}).catch(() => {
			dispatch(createFailure());
		});
	};
};
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
export const LOG_IN_BEGIN = 'LOG_IN_BEGIN';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export function loginBegin() {
	return { type: LOG_IN_BEGIN };
};
export function loginSuccess(session) {
	return { type: LOG_IN_SUCCESS, session: session };
};
export function loginFailure() {
	return { type: LOG_IN_FAILURE };
};

export function loginUser(email, password, callback) {
	return (dispatch) => {
		localStorage.removeItem('session');
		dispatch(loginBegin());

		return post(
			window.origin + '/api/users/session',
			JSON.stringify({
				email: email,
				password: password
			}),
			null,
			[{name: 'Content-type', value: 'application/json'}]
		).then((result) => {
			if (result.status === 200) {
				try {
					let session = JSON.parse(result.response);

					localStorage.setItem('session', JSON.stringify(session));
					dispatch(loginSuccess(session));
					dispatch(sendNotification({
						variant: 'success',
						text: 'Logged in!'
					}));
					if (callback) callback();
				} catch {
					dispatch(loginFailure());
					dispatch(sendNotification({
						variant: 'error',
						text: 'Error verifying login!'
					}));
				}
			} else if (result.status === 404) {
				dispatch(loginFailure());
				dispatch(sendNotification({
					variant: 'error',
					text: 'User not found!'
				}));
			} else if (result.status === 422) {
				dispatch(loginFailure());
				dispatch(sendNotification({
					variant: 'error',
					text: 'Missing required fields!'
				}));
			} else if (result.status === 401) {
				dispatch(loginFailure());
				dispatch(sendNotification({
					variant: 'error',
					text: 'Username or password is invalid!'
				}));
			} else {
				dispatch(loginFailure());
				dispatch(sendNotification({
					variant: 'error',
					text: 'Error verifying login!'
				}));
			};
		}).catch(() => {
			dispatch(loginFailure());
		});
	};
};
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
export function verifyLogin(token, callback) {
	return (dispatch) => {
		localStorage.removeItem('session');
		dispatch(loginBegin());

		return get(
			window.origin + '/api/users/session',
			token,
			[{name: 'Content-type', value: 'application/json'}]
		).then((result) => {
			if (result.status === 200) {
				try {
					let session = JSON.parse(result.response);

					localStorage.setItem('session', JSON.stringify(session));
					dispatch(loginSuccess(session));
					if (callback) callback();
				} catch {
					dispatch(loginFailure());
					dispatch(sendNotification({
						variant: 'error',
						text: 'Error verifying login!'
					}));
				}
			} else if (result.status === 404) {
				dispatch(loginFailure());
				dispatch(sendNotification({
					variant: 'error',
					text: 'User not found!'
				}));
			} else if (result.response.toString().includes('jwt expired')) {
				dispatch(loginFailure());
			} else {
				dispatch(loginFailure());
				dispatch(sendNotification({
					variant: 'error',
					text: 'Error verifying login!'
				}));
			}
		}).catch(() => {
			dispatch(loginFailure());
		});
	};
};
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
export const LOG_OUT = 'LOG_OUT';

export function logout() {
	return { type: LOG_OUT };
};