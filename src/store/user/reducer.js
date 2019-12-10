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
	loading: false,

	error: null
};

// reducer
function userReducer(state = user, action) {
	//console.log('`user` reducer', state, action);

	switch(action.type) {
// ----------------------------------------------------------------------------
		case 'LOG_IN_BEGIN':
			return { ...user, loading: true, loggedin: false, dialog: state.dialog, error: null };
		case 'LOG_IN_SUCCESS':
			return { ...state, loading: false, loggedin: true, session: action.session };
		case 'LOG_IN_FAILURE':
			return { ...user, dialog: state.dialog, error: action.error };
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
		case 'CREATE_BEGIN':
			return { ...user, loading: true, loggedin: false, dialog: state.dialog, error: null };
		case 'CREATE_SUCCESS':
			return { ...state, loading: false, loggedin: true, session: action.session };
		case 'CREATE_FAILURE':
			return { ...user, dialog: state.dialog, error: action.error };
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
		case 'LOG_OUT':
			// return initial user state
			return user;
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
		case 'CLEAR_USER_ERROR':
			return { ...state, error: null };
// ----------------------------------------------------------------------------

		default:
			return state;
	};
};

export default userReducer;
