import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

// import content
import { Home } from './Home-content.jsx';

import { syncRuns } from '../../../utils/database';
import { sendNotification } from '../../../store/notifications/actions';

// map store to prop
function mapStateToProps(state) {
	return {
		user: state.user
	};
};

function HomeContainer(props) {
	// redirect to the login page if the user isn't logged in
	if (process.env.NODE_ENV === 'production' && !props.user.loggedin) return <Redirect to={"/login"} />;

	const syncAction = () => {
		syncRuns(props.user.session.token).then(() => {
			props.dispatch(sendNotification({
				variant: 'success',
				text: 'Successfully synced data!'
			}));
		}, (e) => {
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