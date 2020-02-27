import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

// import content
import { Home } from './Home-content.jsx';

import { sync } from '../../../utils/storage';
import { sendNotification } from '../../../store/notifications/actions';

// map store to prop
// home card only needs the user session
function mapStateToProps(state) {
	return {
		user: state.user
	};
};

function HomeContainer(props) {
	// redirect to the login page if the user isn't logged in
	if (process.env.NODE_ENV === 'production' && !props.user.loggedin) return <Redirect to={"/login"} />;

	// function for the sync button
	const syncAction = () => {
		// execute the data sync promise, passing in the session token
		sync(props.user.session.token).then(() => {
			// on success dispatch a success notification
			props.dispatch(sendNotification({
				variant: 'success',
				text: 'Successfully synced data!'
			}));
		}, (e) => {
			// and an error on failure
			console.error('error syncing data: ', e);
			props.dispatch(sendNotification({
				variant: 'error',
				text: 'Error syncing data!'
			}));
		});
	};

	return (
		<Home invite={props.user.session.invite} admin={props.user.session.admin} syncAction={syncAction} />
	);
};

export default connect(mapStateToProps)(HomeContainer);