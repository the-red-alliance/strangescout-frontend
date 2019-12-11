import React from 'react';
import { connect } from 'react-redux';

import { Redirect } from 'react-router-dom';

// import content
import { NotFound } from './NotFound-content.jsx';

// map store to props
function mapStateToProps(state) {
	return {
		user: state.user
	};
};

function NotFoundContainer(props) {
	// redirect to the login page if the user isn't logged in
	if (process.env.NODE_ENV && !props.user.loggedin) return <Redirect to={"/login"} />;

	return (
		<NotFound />
	);
};

export default connect(mapStateToProps)(NotFoundContainer);