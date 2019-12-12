import React from 'react';
import { connect } from 'react-redux';

import { createInvite, clearInvite } from '../../../store/invite/actions';

import { Redirect } from 'react-router-dom';

// import content
import { Invite } from './Invite-content.jsx';

// map store to prop
function mapStateToProps(state) {
	return {
		user: state.user,
		invite: state.invite
	};
};

function InviteContainer(props) {
	// redirect to the home page if the user can't invite
	if (process.env.NODE_ENV === 'production' && !props.user.session.invite) return <Redirect to={"/"} />;

	return (
		<Invite
		admin={props.user.session.admin}
		invite={props.invite}
		inviteAction={(inviteData) => props.dispatch(createInvite(props.user.session.token, inviteData))}
		resetAction={() => props.dispatch(clearInvite())} />
	);
};

export default connect(mapStateToProps)(InviteContainer);