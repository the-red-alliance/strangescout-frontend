import React from 'react';
import { connect } from 'react-redux';

// import login content
import { Login } from './Login-content.jsx';

import { loginUser } from '../../../store/user/actions';

// map store to prop (currently not needed here)
function mapStateToProps(state) {
	return {};
};

function LoginContainer(props) {
	function login(user) {
		props.dispatch(loginUser(user.email, user.password));
	};

	return (
		<Login loginAction={login} />
	);
};

export default connect(mapStateToProps)(LoginContainer);