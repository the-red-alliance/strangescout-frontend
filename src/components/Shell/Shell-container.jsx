import React from 'react';
import { connect } from 'react-redux';

import { logout } from '../../store/user/actions';
import { sendNotification } from '../../store/notifications/actions';

import { clearData } from '../../utils/database';

// import shell content
import { Shell } from './Shell-content.jsx';

import Notifications from './Notifications';

// map user from store to prop
function mapStateToProps(state) {
	return {
		user: state.user
	};
};

function ShellContainer(props) {
	const logoutAction = () => {
		props.dispatch(logout());
		props.dispatch(sendNotification({
			variant: 'success',
			text: 'Logged out!'
		}));
		localStorage.removeItem('template');
		localStorage.removeItem('session');
		clearData();
	};

	return (
		<React.Fragment>
			<Notifications />
			<Shell loggedin={props.user.loggedin} logoutAction={logoutAction} />
		</React.Fragment>
	);
};

export default connect(mapStateToProps)(ShellContainer);