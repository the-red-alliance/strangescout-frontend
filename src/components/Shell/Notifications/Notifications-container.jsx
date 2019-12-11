import React from 'react';
import { connect } from 'react-redux';

import { clearUserError } from '../../../store/user/actions';

// import shell content
import { Notifications as Notification } from './Notifications-content.jsx';

// map user from store to prop
function mapStateToProps(state) {
	return {
		user: state.user
	};
};

function NotificationsContainer(props) {
	const { user } = props;

	function closeUserError() {
		props.dispatch(clearUserError());
	};

	return (
		<React.Fragment>
			<Notification open={Boolean(user.error)} variant="error" message={user.error} handleClose={closeUserError} />
		</React.Fragment>
	);
};

export default connect(mapStateToProps)(NotificationsContainer);