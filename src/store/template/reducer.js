// initial state
const dummyTemplate = {
    gameInfo: {
      program: 'FRC',
      name: 'FIRST Infinite Recharge',
      year: 2020
    },
    positions: [
      {
        display: 'Left',
        key: 'left'
      },
      {
        display: 'Middle',
        key: 'middle'
      },
      {
        display: 'Right',
        key: 'right'
      }
    ],
    loadouts: [
      {
        display: 'Power Cell',
        events: ['get_cell']
      },
      {
        display: '2 Power Cells',
        events: ['get_cell', 'get_cell']
      },
      {
        display: '3 Power Cells',
        events: ['get_cell', 'get_cell', 'get_cell']
      }
    ],
    scout: {
      run: [
        {
          type: 'multi_item',
          activeTime: 0,
          display: 'Power Cells',
          key: 'power_cells',
          max: 5,
          get: {
            display: 'Get Power Cell',
            key: 'get_cell'
          },
          children: [
            {
              display: 'Upper Power Ports',
              key: 'upper_cell'
            },
            {
              display: 'Lower Power Port',
              key: 'lower_cell'
            },
            {
              display: 'Dropped Cell',
              key: 'drop_cell'
            }
          ],
          endDisable: true
        },
        {
          type: 'single_item',
          activeTime: 0,
          display: 'Start Control Panel',
          key: 'start_panel',
          children: [
            {
              display: 'Successful Spin',
              key: 'successful_panel'
            },
            {
              display: 'Failed Spin',
              key: 'failed_panel'
            },
          ],
          canHold: false,
          ignoreHold: true,
          endDisable: true
        },
        {
          type: 'single_item',
          activeTime: 90,
          display: 'Start Hang',
          key: 'start_hang',
          children: [
            {
              display: 'Successful Hang',
              key: 'successful_hang'
            },
            {
              display: 'Failed Hang',
              key: 'failed_hang'
            },
          ],
          singleUse: true,
          canHold: false,
          ignoreHold: true,
          endDisable: false
        },
        {
          type: 'duration',
          activeTime: 0,
          key: 'defense',
          startDisplay: 'Start Defending',
          startKey: 'start_defend',
          endDisplay: 'Stop Defending',
          endKey: 'end_defend',
          canHold: false,
          ignoreHold: true,
          endDisable: true
        }
      ]
    }
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
