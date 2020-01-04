import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import TeamDrawer from './TeamSelector/TeamDrawer.jsx';
import { DataSingle } from './Data-content-single.jsx';
import { DataAll } from './Data-content-all.jsx';

import 'react-vis/dist/style.css';

const drawerWidth = 150;
const selectionBreakpoint = 'sm';

const useStyles = makeStyles(theme => ({
	root: {
		// center everything
		display: 'flex',
		justifyContent: 'center',
	},
	content: {
		// set the content width so we have some padding
		// regardless of if the drawer is visible
		width: '90%',
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'center',
	},
}));

// map store to prop
function mapStateToProps(state) {
	return {
		user: state.user,
		template: state.template
	};
};

const dummyProcessed = [
	JSON.parse('{"event":"N/A","notes":[],"team":1533,"matches":12,"data":{"start_defend":{"average_duration": 100}, "get_hatch":{"cargo_hatch":{"average":3,"average_bestfit":{"yintercept":1,"slope":1}},"drop_hatch":{"average":1,"average_bestfit":{"yintercept":1,"slope":0}}},"get_cargo":{"top_cargo":{"average":1,"average_bestfit":{"yintercept":1,"slope":0}},"middle_cargo":{"average":2,"average_bestfit":{"yintercept":2,"slope":0}},"bottom_cargo":{"average":1,"average_bestfit":{"yintercept":1,"slope":0}}}},"updated":"2020-01-04T16:00:31.962Z","__v":0}')
];
const dummyRuns = [
	JSON.parse('{"event":"N/A","_id":"5e0191b5b17998000830e7dc","team":1533,"match":1,"position":"1_right","journal":[{"_id":"5e0191b5b17998000830e7f2","event":"start_defend","time":1},{"_id":"5e0191b5b17998000830e7f1","event":"end_defend","time":1},{"_id":"5e0191b5b17998000830e7ee","event":"get_cargo","time":5},{"_id":"5e0191b5b17998000830e7ed","event":"middle_cargo","time":5},{"_id":"5e0191b5b17998000830e7ec","event":"get_hatch","time":6},{"_id":"5e0191b5b17998000830e7eb","event":"cargo_hatch","time":7},{"_id":"5e0191b5b17998000830e7ea","event":"get_hatch","time":8},{"_id":"5e0191b5b17998000830e7e9","event":"cargo_hatch","time":9},{"_id":"5e0191b5b17998000830e7e8","event":"get_hatch","time":10},{"_id":"5e0191b5b17998000830e7e7","event":"drop_hatch","time":11},{"_id":"5e0191b5b17998000830e7e6","event":"get_cargo","time":12},{"_id":"5e0191b5b17998000830e7e5","event":"middle_cargo","time":13},{"_id":"5e0191b5b17998000830e7e4","event":"get_cargo","time":14},{"_id":"5e0191b5b17998000830e7e3","event":"bottom_cargo","time":15},{"_id":"5e0191b5b17998000830e7e2","event":"get_cargo","time":15},{"_id":"5e0191b5b17998000830e7e1","event":"top_cargo","time":16},{"_id":"5e0191b5b17998000830e7e0","event":"start_defend","time":18},{"_id":"5e0191b5b17998000830e7df","event":"end_defend","time":24},{"_id":"5e0191b5b17998000830e7de","event":"start_climb","time":125},{"_id":"5e0191b5b17998000830e7dd","event":"climb_3","time":135}],"notes":"testing","scouter":"penguinsnail@onebuttonmouse.com","updated":"2019-12-24T04:19:01.913Z","__v":0}'),
	JSON.parse('{"event":"N/A","_id":"5e0191b5b17998000830e7dc","team":1533,"match":1,"position":"1_right","journal":[{"_id":"5e0191b5b17998000830e7f2","event":"start_defend","time":1},{"_id":"5e0191b5b17998000830e7f1","event":"end_defend","time":1},{"_id":"5e0191b5b17998000830e7f0","event":"get_hatch","time":3},{"_id":"5e0191b5b17998000830e7ef","event":"cargo_hatch","time":4},{"_id":"5e0191b5b17998000830e7ee","event":"get_cargo","time":5},{"_id":"5e0191b5b17998000830e7ed","event":"middle_cargo","time":5},{"_id":"5e0191b5b17998000830e7ec","event":"get_hatch","time":6},{"_id":"5e0191b5b17998000830e7eb","event":"cargo_hatch","time":7},{"_id":"5e0191b5b17998000830e7ea","event":"get_hatch","time":8},{"_id":"5e0191b5b17998000830e7e9","event":"cargo_hatch","time":9},{"_id":"5e0191b5b17998000830e7e8","event":"get_hatch","time":10},{"_id":"5e0191b5b17998000830e7e7","event":"drop_hatch","time":11},{"_id":"5e0191b5b17998000830e7e6","event":"get_cargo","time":12},{"_id":"5e0191b5b17998000830e7e5","event":"middle_cargo","time":13},{"_id":"5e0191b5b17998000830e7e4","event":"get_cargo","time":14},{"_id":"5e0191b5b17998000830e7e3","event":"bottom_cargo","time":15},{"_id":"5e0191b5b17998000830e7e2","event":"get_cargo","time":15},{"_id":"5e0191b5b17998000830e7e1","event":"top_cargo","time":16},{"_id":"5e0191b5b17998000830e7e0","event":"start_defend","time":18},{"_id":"5e0191b5b17998000830e7df","event":"end_defend","time":24},{"_id":"5e0191b5b17998000830e7de","event":"start_climb","time":125},{"_id":"5e0191b5b17998000830e7dd","event":"climb_3","time":135}],"notes":"testing","scouter":"penguinsnail@onebuttonmouse.com","updated":"2019-12-24T04:19:01.913Z","__v":0}')
];

function DataContainer(props) {
	const classes = useStyles();
	const theme = useTheme();
	const smallBreakpoint = useMediaQuery(theme.breakpoints.up(selectionBreakpoint));
	
	const { template } = props;
	const [ selected, setSelected ] = useState('all');

	// redirect to the login page if the user isn't logged in
	// this has to be put after hook calls or else react errors
	if (process.env.NODE_ENV === 'production' && !props.user.loggedin) return <Redirect to={"/login"} />;

	const teamsData = dummyProcessed;
	const runsData = dummyRuns;
	
	// map our processed teams data to create a list of available teams
	const teamsList = teamsData.map(value => value.team);
	// if we have a specific team selected
	// create a data object for the specific team
	// contains spread processed data and array of runs
	const selectedTeamData = selected !== 'all' ?
		{
			...teamsData.filter(value => value.team === selected)[0],
			runs: runsData.filter(value => value.team === selected)
		}
	:
		{};

	return (
		<div className={classes.root}>
			{ smallBreakpoint && <TeamDrawer width={drawerWidth} teams={teamsList} selected={selected} onSelect={value => {setSelected(value)}} /> }
			<div id="content" className={classes.content}>
				{ selected === 'all' ?
					<DataAll template={template} teamsData={teamsData} />
				:
					<DataSingle template={template} teamData={selectedTeamData} />
				}
				{}
			</div>
		</div>
	);
};

export default connect(mapStateToProps)(DataContainer);