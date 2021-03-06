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
      pit: [
        {
          type: 'number',
          name: 'Ground Clearance (inches)',
          key: 'ground_clearance',
          required: true,
        },

        {
          type: 'boolean',
          name: 'Can you fit under the control panel?',
          key: 'control_panel',
        },
        {
          type: 'select',
          name: 'Drivetrain',
          key: 'drivetrain',
          required: true,
          options: [
              {
                name: 'Kit Bot',
                key: 'kit_bot',
              }, 
              {
                name: 'Swerve',
                key: 'swerve',
              },
              {
                name: 'West Coast',
                key: 'west_coast',
              },
              {
                name: 'Mecanum',
                key: 'mecanum',
              },
              {
                name: 'All Omni',
                key: 'all_omni',
              },
              {
                name: 'Pnuematic',
                key: 'Pnuematic',
              },
              {
                name: 'Eight Wheel',
                key: 'eight_wheel',
              },
              {
                name: 'Treads',
                key: 'treads',
              },
              {
                name: 'Other (in notes)',
                key: 'notes',
              },

          ]
          
        
        },
      ],
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
          analysisDisplay: 'Control Panel',
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
          analysisDisplay: 'Hang',
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
          display: 'Defense',
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
