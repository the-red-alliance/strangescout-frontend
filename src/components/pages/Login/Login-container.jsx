import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

// import login content
import { Login } from './Login-content.jsx';

import { loginUser } from '../../../store/user/actions';
import { loadTemplate } from '../../../store/template/actions';
import { syncData, readEvents } from '../../../utils/database';

import { setEvents } from '../../../store/events/actions';

// map store to prop (currently not needed here)
function mapStateToProps(state) {
	return {
		user: state.user,
	};
};

function LoginContainer(props) {
	const history = useHistory();

	const callback = (success, newSession) => {
		if (success) {
			history.push('/');
			props.dispatch(loadTemplate(newSession.token));
			syncData(newSession.token).then(() => {
				readEvents().then(events => {
					props.dispatch(setEvents(events));
				}, e => {
					console.error('error loading events from local db: ', e);
				});
			}, e => console.error('error syncing data: ', e));
		};
	};

	function login(user) {
		props.dispatch(loginUser(user.email, user.password, callback));
	};

	return (
		<Login loading={props.user.loading} loginAction={login} />
	);
};

export default connect(mapStateToProps)(LoginContainer);