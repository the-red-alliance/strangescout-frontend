// initial state
const dummyTemplate = {
    active: true,
    _id: '5df553b7ba24039bfcc815e2',
    gameInfo: {
      _id: '5df553b7ba24039bfcc815e3',
      program: 'FRC',
      name: 'FIRST Deep Space',
      year: 2019
    },
    positions: [
      {
        _id: '5df553b7ba24039bfcc815e8',
        display: 'Level 1 Left',
        key: '1_left'
      },
      {
        _id: '5df553b7ba24039bfcc815e7',
        display: 'Level 1 Middle',
        key: '1_middle'
      },
      {
        _id: '5df553b7ba24039bfcc815e6',
        display: 'Level 1 Right',
        key: '1_right'
      },
      {
        _id: '5df553b7ba24039bfcc815e5',
        display: 'Level 2 Left',
        key: '2_left'
      },
      {
        _id: '5df553b7ba24039bfcc815e4',
        display: 'Level 2 Right',
        key: '2_right'
      }
    ],
    loadouts: [
      {
        _id: '5df553b7ba24039bfcc815ea',
        display: 'Hatch',
        event: 'get_hatch'
      },
      {
        _id: '5df553b7ba24039bfcc815e9',
        display: 'Cargo',
        event: 'get_cargo'
      }
    ],
    scout: {
      _id: '5df553b7ba24039bfcc815ec',
      run: [
        {
          activeTime: 0,
          endDisable: true,
          children: [
            {
              _id: '5df553b7ba24039bfcc815fc',
              display: 'Top Ship Hatch',
              key: 'top_hatch'
            },
            {
              _id: '5df553b7ba24039bfcc815fb',
              display: 'Middle Ship Hatch',
              key: 'middle_hatch'
            },
            {
              _id: '5df553b7ba24039bfcc815fa',
              display: 'Bottom Ship Hatch',
              key: 'bottom_hatch'
            },
            {
              _id: '5df553b7ba24039bfcc815f9',
              display: 'Cargo Bay Hatch',
              key: 'cargo_hatch'
            },
            {
              _id: '5df553b7ba24039bfcc815f8',
              display: 'Dropped Hatch',
              key: 'drop_hatch'
            }
          ],
          _id: '5df553b7ba24039bfcc815f7',
          display: 'Get Hatch',
          canHold: true,
          ignoreHold: false,
          key: 'get_hatch'
        },
        {
          activeTime: 0,
          endDisable: true,
          children: [
            {
              _id: '5df553b7ba24039bfcc815f6',
              display: 'Top Ship Cargo',
              key: 'top_cargo'
            },
            {
              _id: '5df553b7ba24039bfcc815f5',
              display: 'Middle Ship Cargo',
              key: 'middle_cargo'
            },
            {
              _id: '5df553b7ba24039bfcc815f4',
              display: 'Bottom Ship Cargo',
              key: 'bottom_cargo'
            },
            {
              _id: '5df553b7ba24039bfcc815f3',
              display: 'Cargo Bay Cargo',
              key: 'cargo_cargo'
            },
            {
              _id: '5df553b7ba24039bfcc815f2',
              display: 'Dropped Cargo',
              key: 'drop_cargo'
            }
          ],
          _id: '5df553b7ba24039bfcc815f1',
          display: 'Get Cargo',
          canHold: true,
          ignoreHold: false,
          key: 'get_cargo'
        },
        {
          activeTime: 90,
          endDisable: false,
          children: [
            {
              _id: '5df553b7ba24039bfcc815f0',
              display: 'Level 1',
              key: 'climb_1'
            },
            {
              _id: '5df553b7ba24039bfcc815ef',
              display: 'Level 2',
              key: 'climb_2'
            },
            {
              _id: '5df553b7ba24039bfcc815ee',
              display: 'Level 3',
              key: 'climb_3'
            }
          ],
          _id: '5df553b7ba24039bfcc815ed',
          display: 'Start Habitat Climb',
          canHold: false,
          ignoreHold: true,
          key: 'start_climb'
        }
      ]
    },
    process: {
      _id: '5df553b7ba24039bfcc815fd',
      run: [
        {
          _id: '5df553b7ba24039bfcc815ff',
          type: 'average_children',
          event: 'get_hatch'
        },
        {
          _id: '5df553b7ba24039bfcc815fe',
          type: 'average_children',
          event: 'get_cargo'
        }
      ]
    },
    __v: 0
  }

const template = {};

// reducer
function templateReducer(state = process.env.NODE_ENV === 'production' ? template : dummyTemplate, action) {

	switch(action.type) {
// ----------------------------------------------------------------------------
		case 'SET_TEMPLATE':
			return { ...action.template };
		case 'UNSET_TEMPLATE':
			return template;
// ----------------------------------------------------------------------------
		default:
			return state;
	};
};

export default templateReducer;
