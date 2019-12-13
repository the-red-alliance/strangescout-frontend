import React from 'react';
import { connect } from 'react-redux';

import { clearNotification } from '../../../store/notifications/actions';

// import shell content
import { Notifications as Notification } from './Notifications-content.jsx';

// map user from store to prop
function mapStateToProps(state) {
	return {
		notification: state.notification,
	};
};

function NotificationsContainer(props) {
	const { notification } = props;

	return (
		<Notification
		open={notification.open}
		variant={notification.variant}
		text={notification.text}
		handleClose={() => props.dispatch(clearNotification())}
		/>
	);
};

export default connect(mapStateToProps)(NotificationsContainer);