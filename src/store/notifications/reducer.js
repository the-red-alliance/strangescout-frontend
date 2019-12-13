// store notifications reducer

// initial state
const notification = {};

// reducer
function notificationReducer(state = notification, action) {

	switch(action.type) {
// ----------------------------------------------------------------------------
		case 'CREATE_NOTIFICATION':
			return { ...action.notification, open: true };
		case 'DELETE_NOTIFICATION':
			return notification;
		case 'CLOSE_NOTIFICATION':
			return { ...state, open: false };
// ----------------------------------------------------------------------------
		default:
			return state;
	};
};

export default notificationReducer;
