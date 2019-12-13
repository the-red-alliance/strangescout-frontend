import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { post } from '../../../utils/requests';
import { sendNotification } from '../../../store/notifications/actions';

// import content
import { Invite } from './Invite-content.jsx';

// map store to prop
function mapStateToProps(state) {
	return {
		user: state.user
	};
};

function InviteContainer(props) {
	const initialState = {
		invite: {
			admin: null,
			invite: null,
			single: null,
			email: '',
			expires: null,
			code: '',
			_id: ''
		},
		loading: false
	};
	const [ state, setState ] = useState(initialState);
	// redirect to the home page if the user can't invite
	if (process.env.NODE_ENV === 'production' && !props.user.session.invite) return <Redirect to={"/"} />;

	const createInvite = (token, inviteData) => {
		setState({ ...state, loading: true });
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
					setState({ ...state, loading: false, invite: resInvite });
					props.dispatch(sendNotification({
						variant: 'success',
						text: 'Invite created!'
					}));
				} catch {
					// if we fail to parse fail the login sequence with an error message
					setState({ ...state, loading: false, invite: initialState.invite });
					props.dispatch(sendNotification({
						variant: 'error',
						text: 'Error verifying invite!'
					}));
				}
			} else if (result.status === 403) {
				setState({ ...state, loading: false, invite: initialState.invite });
				props.dispatch(sendNotification({
					variant: 'error',
					text: 'You\'re not allowed to invite users!'
				}));
			} else if (result.status === 422) {
				setState({ ...state, loading: false, invite: initialState.invite });
				props.dispatch(sendNotification({
					variant: 'error',
					text: 'Invalid email or duration!'
				}));
			} else {
				// else just fail
				console.error('failed to create invite');
				console.error(result);
				setState({ ...state, loading: false, invite: initialState.invite });
				props.dispatch(sendNotification({
					variant: 'error',
					text: 'Error creating invite!'
				}));
			}
		}).catch(() => {
			setState({ ...state, loading: false, invite: initialState.invite });
			props.dispatch(sendNotification({
				variant: 'error',
				text: 'Error creating invite!'
			}));
		});
	};

	return (
		<Invite
		admin={props.user.session.admin}
		invite={state}
		inviteAction={(inviteData) => createInvite(props.user.session.token, inviteData)}
		resetAction={() => setState(initialState)} />
	);
};

export default connect(mapStateToProps)(InviteContainer);