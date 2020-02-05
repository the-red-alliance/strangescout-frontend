// store events reducer

// initial state
const events = [];
const dummyData = [
	{
		matches: [],
		_id: '5e38c864d9153a0007ef50c6',
		city: 'Pembroke',
		country: 'USA',
		district: {
			abbreviation: 'fnc',
			display_name: 'FIRST North Carolina',
			key: '2020fnc',
			year: 2020
		},
		endDate: new Date('2020-03-08T05:00:00.000Z'),
		eventCode: 'ncpem',
		key: '2020ncpem',
		name: 'FNC District UNC Pembroke Event',
		startDate: new Date('2020-03-06T05:00:00.000Z'),
		year: 2020,
		updated: new Date('2020-02-04T02:10:19.031Z'),
		__v: 0
	},
	{
		matches: [],
		_id: '5e38c864d9153a0007ef50c7',
		city: 'Gibsonville',
		country: 'USA',
		district: {
			abbreviation: 'fnc',
			display_name: 'FIRST North Carolina',
			key: '2020fnc',
			year: 2020
		},
		endDate: new Date('2020-03-22T04:00:00.000Z'),
		eventCode: 'ncgui',
		key: '2020ncgui',
		name: 'FNC District Guilford County Event',
		startDate: new Date('2020-03-20T04:00:00.000Z'),
		year: 2020,
		updated: new Date('2020-02-04T02:10:18.873Z'),
		__v: 0
	}
];

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
