import React from 'react';
import { connect } from 'react-redux';

import { clearUserError } from '../../../store/user/actions';
import { clearInviteError } from '../../../store/invite/actions';

// import shell content
import { Notifications as Notification } from './Notifications-content.jsx';

// map user from store to prop
function mapStateToProps(state) {
	return {
		user: state.user,
		invite: state.invite,
	};
};

function NotificationsContainer(props) {
	const { user, invite } = props;

	return (
		<React.Fragment>
			<Notification open={Boolean(user.error)} variant="error" message={user.error} handleClose={() => props.dispatch(clearUserError())} />
			<Notification open={Boolean(invite.error)} variant="error" message={invite.error} handleClose={() => props.dispatch(clearInviteError())} />
		</React.Fragment>
	);
};

export default connect(mapStateToProps)(NotificationsContainer);