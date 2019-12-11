import React from 'react';
import { connect } from 'react-redux';

import { useLocation } from "react-router-dom";

// import login content
import { SignUp } from './SignUp-content.jsx';

import { createUser } from '../../../store/user/actions';

function useQuery() {
	return new URLSearchParams(useLocation().search);
};

// map store to prop (currently not needed here)
function mapStateToProps(state) {
	return {};
};

function SignUpContainer(props) {
	const query = useQuery();

	function create(user) {
		props.dispatch(createUser(user));
	};

	return (
		<SignUp code={query.get("code")} createAction={create} />
	);
};

export default connect(mapStateToProps)(SignUpContainer);