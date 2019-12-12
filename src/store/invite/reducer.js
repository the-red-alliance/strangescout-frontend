// store invite reducer

// initial state
const invite = {
	invite: {
		admin: null,
		invite: null,
		single: null,
		email: '',
		expires: null,
		code: '',
		_id: ''
	},
	loading: false,
	error: null
};

// reducer
function userReducer(state = invite, action) {

	switch(action.type) {
// ----------------------------------------------------------------------------
		case 'INVITE_BEGIN':
			return { ...invite, loading: true, error: null };
		case 'INVITE_SUCCESS':
			return { ...state, loading: false, invite: action.invite };
		case 'INVITE_FAILURE':
			return { ...invite, error: action.error };
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
		case 'CLEAR_INVITE_ERROR':
			return { ...state, error: null };
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
case 'CLEAR_INVITE':
	return invite;
// ----------------------------------------------------------------------------

		default:
			return state;
	};
};

export default userReducer;
