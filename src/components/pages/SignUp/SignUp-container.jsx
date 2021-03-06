import React from 'react';
import { connect } from 'react-redux';

import { useLocation, useHistory } from "react-router-dom";

// import login content
import { SignUp } from './SignUp-content.jsx';

import { createUser } from '../../../store/user/actions';
import { loadTemplate } from '../../../store/template/actions';
import { sync } from '../../../utils/storage';

function useQuery() {
	return new URLSearchParams(useLocation().search);
};

// map store to prop (currently not needed here)
function mapStateToProps(state) {
	return {
		user: state.user,
	};
};

function SignUpContainer(props) {
	const query = useQuery();
	const history = useHistory();

	const callback = (success, newSession) => {
		if (success) {
			history.push('/');
			props.dispatch(loadTemplate(newSession.token));
			sync(newSession.token).then(() => {}, e => console.error('error syncing data: ', e));
		};
	};

	function create(user) {
		props.dispatch(createUser(user, callback));
	};

	return (
		<SignUp loading={props.user.loading} code={query.get("code")} createAction={create} />
	);
};

export default connect(mapStateToProps)(SignUpContainer);