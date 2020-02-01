import React from 'react';
import { connect } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';

import { sendNotification } from '../../../store/notifications/actions';
import { storeLocalTeam, syncData } from '../../../utils/database';

// import content
import { Pit } from './Pit-content.jsx';

// map store to props
function mapStateToProps(state) {
	return {
		user: state.user,
		template: state.template
	};
};

function PitContainer(props) {
	const { user, template } = props;

	// history api for routing
	const history = useHistory();

	// redirect to the login page if the user isn't logged in
	if (process.env.NODE_ENV === 'production' && !props.user.loggedin) return <Redirect to={"/login"} />;

	// when submitting a team
	const onSubmit = (team, data) => {
		// store the team doc to local db
		storeLocalTeam({team: team, data: data}).then(() => {
			// on successful store
			// redirect to /
			history.push('/');
			// async sync data with the server
			syncData(user.session.token).then(() => {
				// notification on success
				props.dispatch(sendNotification({
					variant: 'success',
					text: 'Successfully synced data!'
				}));
			}, (e) => {
				// error handling
				// log to console and notify the user
				console.error('failed to sync pits ', e);
				props.dispatch(sendNotification({
					variant: 'error',
					text: 'Failed to sync data!'
				}));
			});
		}, (e) => {
			// error handling
			// log to console and notify the user
			console.error('failed to save pit ', e);
			props.dispatch(sendNotification({
				variant: 'error',
				text: 'Failed to store data!'
			}));
		});
	};

	return (
		<Pit submit={onSubmit} template={template} />
	);
};

export default connect(mapStateToProps)(PitContainer);