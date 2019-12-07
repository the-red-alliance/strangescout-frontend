import React from 'react';
import { connect } from 'react-redux';

import { useLocation } from "react-router-dom";

// import login content
import { SignUp } from './SignUp-content.jsx';

function useQuery() {
	return new URLSearchParams(useLocation().search);
};

// map store to prop (currently not needed here)
function mapStateToProps(state) {
	return {};
};

function SignUpContainer(props) {
	const query = useQuery();

	return (
		<SignUp code={query.get("code")} />
	);
};

export default connect(mapStateToProps)(SignUpContainer);