import React from 'react';
import { connect } from 'react-redux';

import { Redirect } from 'react-router-dom';

// import content
import { Home } from './Home-content.jsx';

// map store to prop
function mapStateToProps(state) {
	return {
		user: state.user
	};
};

function HomeContainer(props) {
	// redirect to the login page if the user isn't logged in
	if (process.env.NODE_ENV === 'production' && !props.user.loggedin) return <Redirect to={"/login"} />;

	return (
		<Home invite={props.user.session.invite} admin={props.user.session.admin} />
	);
};

export default connect(mapStateToProps)(HomeContainer);