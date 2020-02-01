import React from 'react';
import { connect } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';

import { storeLocalTeam } from '../../../utils/database';

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
	const { template } = props;

	// history api for routing
	const history = useHistory();

	// redirect to the login page if the user isn't logged in
	if (process.env.NODE_ENV === 'production' && !props.user.loggedin) return <Redirect to={"/login"} />;

	const onSubmit = (team, data) => {
		storeLocalTeam({team: team, data: data});
		history.push('/');
	};

	return (
		<Pit submit={onSubmit} template={template} />
	);
};

export default connect(mapStateToProps)(PitContainer);