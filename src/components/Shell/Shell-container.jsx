import React from 'react';
import { connect } from 'react-redux';

// import shell content
import { Shell } from './Shell-content.jsx';

import Notifications from './Notifications';

// map user from store to prop
function mapStateToProps(state) {
	return {
		user: state.user
	};
};

function ShellContainer(props) {
	// return shell content passing in loggedin prop
	return (
		<React.Fragment>
			<Notifications />
			<Shell loggedin={props.user.loggedin}/>
		</React.Fragment>
	);
};

export default connect(mapStateToProps)(ShellContainer);