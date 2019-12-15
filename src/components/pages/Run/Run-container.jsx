import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { sendNotification } from '../../../store/notifications/actions';

import { Run } from './Run-content.jsx';

function mapStateToProps(state) {
	return {
		user: state.user,
		notification: state.notification,
		template: state.template,
	};
};

export function RunContainer(props) {
	// redirect to the login page if the user isn't logged in
	if (process.env.NODE_ENV === 'production' && !props.user.loggedin) return <Redirect to={"/login"} />;

	return (
		<Run template={props.template} />
	);
};

export default connect(mapStateToProps)(RunContainer);