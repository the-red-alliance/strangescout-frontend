// store user reducer

// initial user state
const user = {
	session: {
		_id: '',
		email: '',
		admin: false,
		invite: false,
		token: ''
	},
	
	loggedin: false,
	loading: false
};

// reducer
function userReducer(state = user, action) {
	//console.log('`user` reducer', state, action);

	switch(action.type) {
// ----------------------------------------------------------------------------
		case 'LOG_IN_BEGIN':
			return { ...user, loading: true, loggedin: false };
		case 'LOG_IN_SUCCESS':
			return { ...state, loading: false, loggedin: true, session: action.session };
		case 'LOG_IN_FAILURE':
			return user;
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
		case 'CREATE_BEGIN':
			return { ...user, loading: true, loggedin: false };
		case 'CREATE_SUCCESS':
			return { ...state, loading: false, loggedin: true, session: action.session };
		case 'CREATE_FAILURE':
			return user;
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
		case 'LOG_OUT':
			// return initial user state
			return user;
// ----------------------------------------------------------------------------

		default:
			return state;
	};
};

export default userReducer;
