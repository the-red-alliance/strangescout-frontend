import React from 'react';
import { connect } from 'react-redux';

import { verifyLogin } from '../../../store/user/actions';
import { loadTemplate, deleteTemplate } from '../../../store/template/actions';

import { sync, clearData } from '../../../utils/database';

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
				props.afterLoad();
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