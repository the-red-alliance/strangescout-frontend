import React from 'react';
import { connect } from 'react-redux';

import { Redirect } from 'react-router-dom';

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
	const {template}=props;
	// redirect to the login page if the user isn't logged in
	if (process.env.NODE_ENV === 'production' && !props.user.loggedin) return <Redirect to={"/login"} />;

	return (
		<Pit template={template}/>
	);
};

export default connect(mapStateToProps)(PitContainer);