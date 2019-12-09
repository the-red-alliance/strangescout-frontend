import React from 'react';
import { connect } from 'react-redux';

// import shell content
import { Shell } from './Shell-content.jsx';

// map user from store to prop
function mapStateToProps(state) {
	return {
		user: state.user
	};
};

function ShellContainer(props) {
	// return shell content passing in loggedin prop
	return (
		<Shell loggedin={props.user.loggedin}/>
	);
};

export default connect(mapStateToProps)(ShellContainer);