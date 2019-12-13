import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { put } from '../../../utils/requests';

import { sendNotification } from '../../../store/notifications/actions';
import { logout } from '../../../store/user/actions';

// import content
import { Account } from './Account-content.jsx';

// map store to prop (currently not needed here)
function mapStateToProps(state) {
	return {
		user: state.user,
	};
};

function LoginContainer(props) {
	const [ loading, setLoading ] = useState(false);

	// redirect to the login page if the user isn't logged in
	if (process.env.NODE_ENV === 'production' && !props.user.loggedin) return <Redirect to={"/login"} />;

	const action = (settings) => {
		setLoading(true);
		put(
			// set url to request
			window.origin + '/api/users/' + props.user.session._id + '/password',
			// set request body to the user object
			JSON.stringify(settings),
			// no token used here
			props.user.session.token,
			// headers array (specify content type as json)
			[{name: 'Content-type', value: 'application/json'}]
		).then((result) => {
			if (result.status === 202) {
				setLoading(false);
				props.dispatch(sendNotification({
					variant: 'success',
					text: 'Settings updated!'
				}));
			} else if (result.status === 403) {
				setLoading(false);
				props.dispatch(sendNotification({
					variant: 'error',
					text: 'Unauthorized!'
				}));
			} else if (result.status === 404) {
				setLoading(false);
				props.dispatch(sendNotification({
					variant: 'error',
					text: 'User not found!'
				}));
				props.dispatch(logout());
			} else if (result.status === 422) {
				setLoading(false);
				props.dispatch(sendNotification({
					variant: 'error',
					text: 'Invalid settings!'
				}));
			} else {
				setLoading(false);
				props.dispatch(sendNotification({
					variant: 'error',
					text: 'Error updating settings!'
				}));
			}
		});
	};

	return (
		<Account loading={loading} saveAction={action} />
	);
};

export default connect(mapStateToProps)(LoginContainer);