import React from 'react';
import { connect } from 'react-redux';

import { verifyLogin } from '../../../store/user/actions';
import { loadTemplate, deleteTemplate } from '../../../store/template/actions';

import { syncData, clearData } from '../../../utils/database';

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
				if (success && newSession) syncData(newSession.token).then(null, (e) => console.error('error syncing data: ', e));
				// complete load afterwards
				props.afterLoad();
			}));
		} else {
			// else complete load
			if (process.env.NODE_ENV === 'production') {
				// clear stored data
				clearData();
				props.dispatch(deleteTemplate());
			}
			props.afterLoad();
		};
	};

	// dummy render
	return <React.Fragment />;
};

export default connect(mapStateToProps)(Loader);