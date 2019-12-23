import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { post } from '../../../utils/requests';
import { sendNotification } from '../../../store/notifications/actions';

// import content
import { Admin } from './Admin-content.jsx';

// map store to prop
function mapStateToProps(state) {
	return {
		user: state.user,
		template: state.template
	};
};

function AdminContainer(props) {
	const initialState = {
		loading: false
	};
	const [ state, setState ] = useState(initialState);
	// redirect to the home page if the user can't invite
	if (process.env.NODE_ENV === 'production' && !props.user.session.admin) return <Redirect to={"/"} />;

	const onSubmit = (template) => {
		setState({ ...state, loading: true });
		// new post request
		return post(
			// set url to request
			window.origin + '/api/template',
			// set request body to the user object
			JSON.stringify(template),
			// no token used here
			props.user.session.token,
			// headers array (specify content type as json)
			[{name: 'Content-type', value: 'application/json'}]
		).then((result) => {
			// on a 200 code
			if (result.status === 200) {
				props.dispatch(sendNotification({
					variant: 'success',
					text: 'Successfully updated!'
				}));
			} else if (result.status === 403) {
				props.dispatch(sendNotification({
					variant: 'error',
					text: 'You\'re not allowed to update that!'
				}));
			} else {
				// else just fail
				console.error('failed to update');
				console.error(result);
				props.dispatch(sendNotification({
					variant: 'error',
					text: 'Error updating!'
				}));
			}
		}).catch(() => {
			props.dispatch(sendNotification({
				variant: 'error',
				text: 'Error updating!'
			}));
		});
	};

	return (
		<Admin template={props.template} onSubmit={onSubmit} />
	);
};

export default connect(mapStateToProps)(AdminContainer);