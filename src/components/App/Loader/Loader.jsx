import React from 'react';
import { connect } from 'react-redux';

import { verifyLogin } from '../../../store/user/actions';
import { loadTemplate, deleteTemplate } from '../../../store/template/actions';
import { setEvents } from '../../../store/events/actions';

import { sync, clearData } from '../../../utils/database';
// import database query fn
import { queryDB } from '../../../utils/database';
import { readableTables } from '../../../utils/database';

const mapStateToProps = (state) => {
	return {};
};

export function Loader(props) {
	if (!props.initialLoad) {
		const session = JSON.parse(localStorage.getItem('session'));

		// if a stored session was found
		if (session) {
			// attempt to verify it
			props.dispatch(verifyLogin(session.token, session, (success, newSession) => {
				if (success && newSession) props.dispatch(loadTemplate(newSession.token));
				if (success && newSession) sync(newSession.token).then(null, (e) => console.error('error syncing data: ', e));
				queryDB(readableTables.EVENTS).then(events => {
					props.dispatch(setEvents(events));
					props.afterLoad();
				}, e => {
					console.error('error loading events from local db: ', e);
					props.afterLoad();
				});
			}));
		// else if no stored session
		} else {
			// if running in production
			if (process.env.NODE_ENV === 'production') {
				// clear stored data
				clearData();
				props.dispatch(deleteTemplate());
			}
			// finish loader
			props.afterLoad();
		};
	};

	// dummy render
	return <React.Fragment />;
};

export default connect(mapStateToProps)(Loader);