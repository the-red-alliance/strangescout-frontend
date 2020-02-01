import dateParser from '../../utils/dateParser';
// store events reducer

// initial state
const events = [];
const dummyData = JSON.parse('[{"matches":[],"_id":"5e35bf5128723319d332a74a","city":"Gibsonville","country":"USA","district":{"abbreviation":"fnc","display_name":"FIRST North Carolina","key":"2020fnc","year":2020},"endDate":"2020-03-22T04:00:00.000Z","eventCode":"ncgui","key":"2020ncgui","name":"FNC District Guilford County Event","startDate":"2020-03-20T04:00:00.000Z","year":2020,"updated":"2020-02-01T18:11:30.545Z","__v":0},' + 
'{"matches":[],"_id":"5e35bf5128723319d332a74b","city":"Pembroke","country":"USA","district":{"abbreviation":"fnc","display_name":"FIRST North Carolina","key":"2020fnc","year":2020},"endDate":"2020-03-08T05:00:00.000Z","eventCode":"ncpem","key":"2020ncpem","name":"FNC District UNC Pembroke Event","startDate":"2020-03-06T05:00:00.000Z","year":2020,"updated":"2020-02-01T18:11:30.584Z","__v":0},' + 
'{"matches":[],"_id":"5e35bf5128723319d332a74b","city":"Pembroke","country":"USA","district":{"abbreviation":"fnc","display_name":"FIRST North Carolina","key":"2020fnc","year":2020},"endDate":"2020-03-08T05:00:00.000Z","eventCode":"ncpem","key":"2020test","name":"Test Event","startDate":"2020-01-31T05:00:00.000Z","year":2020,"updated":"2020-02-01T18:11:30.584Z","__v":0}' + ']', dateParser);

// reducer
function eventsReducer(state = process.env.NODE_ENV === 'production' ? events : dummyData, action) {

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
