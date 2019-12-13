import React from 'react';
import { connect } from 'react-redux';

import { verifyLogin } from '../../../store/user/actions';

const mapStateToProps = (state) => {
	return {};
};

export function Loader(props) {
	if (!props.initialLoad) {
		const session = JSON.parse(localStorage.getItem('session'));

		// if a stored session was found
		if (session) {
			// attempt to verify it
			props.dispatch(verifyLogin(session.token, session, () => {
				// complete load afterwards
				props.afterLoad();
			}));
		} else {
			// else complete load
			props.afterLoad();
		};
	};

	// dummy render
	return <React.Fragment />;
};

export default connect(mapStateToProps)(Loader);