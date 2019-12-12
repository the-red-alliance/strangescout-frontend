import { post } from '../../utils/requests';

// ----------------------------------------------------------------------------
export const INVITE_BEGIN = 'INVITE_BEGIN';
export const INVITE_SUCCESS = 'INVITE_SUCCESS';
export const INVITE_FAILURE = 'INVITE_FAILURE';

export function inviteBegin() {
	return { type: INVITE_BEGIN };
};
export function inviteSuccess(invite) {
	return { type: INVITE_SUCCESS, invite: invite };
};
export function inviteFailure(error) {
	return { type: INVITE_FAILURE, error: error };
};

export function createInvite(token, inviteData) {
	return (dispatch) => {
		// begin login sequence
		dispatch(inviteBegin());

		// new post request
		return post(
			// set url to request
			window.origin + '/api/codes',
			// set request body to the user object
			JSON.stringify(inviteData),
			// no token used here
			token,
			// headers array (specify content type as json)
			[{name: 'Content-type', value: 'application/json'}]
		).then((result) => {
			// on a 200 code
			if (result.status === 200) {
				try {
					// try parsing the response
					let resInvite = JSON.parse(result.response);

					// dispatch the success event
					dispatch(inviteSuccess(resInvite));
				} catch {
					// if we fail to parse fail the login sequence with an error message
					dispatch(inviteFailure('Error verifying invite!'));
				}
			} else if (result.status === 403) {
				dispatch(inviteFailure('You\'re not allowed to invite users!'));
			} else if (result.status === 422) {
				dispatch(inviteFailure('Invalid email or duration!'));
			} else {
				// else just fail
				console.error('failed to create invite');
				console.error(result);
				dispatch(inviteFailure('Error creating the invite!'));
			}
		}).catch(() => {
			dispatch(inviteFailure(null));
		});
	};
};
// ----------------------------------------------------------------------------

// Clear errors ---------------------------------------------------------------
export const CLEAR_INVITE_ERROR = 'CLEAR_INVITE_ERROR';

export function clearInviteError() {
	return { type: CLEAR_INVITE_ERROR };
};

// Clear invite ---------------------------------------------------------------
export const CLEAR_INVITE = 'CLEAR_INVITE';

export function clearInvite() {
	return { type: CLEAR_INVITE };
};