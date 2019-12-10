import { apiCreateUser, apiLoginUser, apiCheckToken } from './api';

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
export function createFailure(error) {
	return { type: CREATE_FAILURE, error: error };
};

/**
 * Create a new user
 * @param {{}} user {email: 'email@domain.tld', password: 'password', code: 'invitecode'}
 */
export function createUser(user) {
	return (dispatch, getState) => {
		localStorage.removeItem('session');
		dispatch(createBegin());

		return apiCreateUser(user).then(session => {
			localStorage.setItem('session', JSON.stringify(session));
			dispatch(createSuccess(session));
		}).catch((err) => {
			console.error(`create status code: ${err}`);
			if (err === 409) {
				dispatch(createFailure('Username already exists!'));
			} else if (err === 422) {
				dispatch(createFailure('Missing required fields!'));
			} else if (err === 401) {
				dispatch(loginFailure('Username or password is invalid!'));
			} else {
				dispatch(loginFailure('Error verifying login!'));
			};
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
export function loginFailure(error) {
	return { type: LOG_IN_FAILURE, error: error };
};

export function loginUser(email, password) {
	return (dispatch, getState) => {
		localStorage.removeItem('session');
		dispatch(loginBegin());

		return apiLoginUser(email, password).then(session => {
			localStorage.setItem('session', JSON.stringify(session));
			dispatch(loginSuccess(session));
		}).catch((err) => {
			console.error(`login status code: ${err}`);
			if (err === 404) {
				dispatch(loginFailure('User not found!'));
			} else if (err === 422) {
				dispatch(loginFailure('Missing required fields!'));
			} else if (err === 401) {
				dispatch(loginFailure('Username or password is invalid!'));
			} else {
				dispatch(loginFailure('Error verifying login!'));
			};
		});
	};
};
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
export function verifyLogin(token) {
	return (dispatch, getState) => {

		localStorage.removeItem('session');
		dispatch(loginBegin());
		return apiCheckToken(token).then(session => {
			localStorage.setItem('session', JSON.stringify(session));
			dispatch(loginSuccess(session));
		}).catch((err) => {
			console.error(`verify status code: ${err}`);
			if (err === 'expired') {
				dispatch(loginFailure(null));
			} else if (err === 404) {
				dispatch(loginFailure('User not found!'));
			} else {
				dispatch(loginFailure('Error verifying login!'));
			};
		});
	};
};
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
export const LOG_OUT = 'LOG_OUT';

export function logout() {
	return { type: LOG_OUT };
};
// ----------------------------------------------------------------------------

// Clear errors ---------------------------------------------------------------
export const CLEAR_USER_ERROR = 'CLEAR_USER_ERROR';

export function clearUserError() {
	return { type: CLEAR_USER_ERROR };
};