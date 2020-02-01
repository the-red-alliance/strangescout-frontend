// store events reducer

// initial state
const events = [];

// reducer
function eventsReducer(state = events, action) {

	switch(action.type) {
// ----------------------------------------------------------------------------
		case 'SET_EVENTS':
			return [ ...action.events ];
		case 'CLEAR_EVENTS':
			return events;
// ----------------------------------------------------------------------------
		default:
			return state;
	};
};

export default eventsReducer;
