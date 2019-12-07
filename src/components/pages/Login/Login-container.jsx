import React from 'react';
import { connect } from 'react-redux';

// import login content
import { Login } from './Login-content.jsx';

// map store to prop (currently not needed here)
function mapStateToProps(state) {
	return {};
};

function LoginContainer(props) {
	return (
		<Login />
	);
};

export default connect(mapStateToProps)(LoginContainer);