import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import { DataContent } from './Data-content.jsx';

import { readProcessedTeams, readRuns, storeLocalTeam, syncData, readTeams } from '../../../utils/database';
import { sendNotification } from '../../../store/notifications/actions';

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
		template: state.template,
		events: state.events,
	};
};

function DataContainer(props) {
	const classes = useStyles();
	
	const { user, template, events } = props;
	const [ processed, setProcessed ] = useState([]);
	const [ dbRead, setDbRead ] = useState(false);
	const [ runs, setRuns ] = useState([]);
	const [ pits, setPits ] = useState([]);

	// redirect to the login page if the user isn't logged in
	// this has to be put after hook calls or else react errors
	if (process.env.NODE_ENV === 'production' && !user.loggedin) return <Redirect to={"/login"} />;

	if (!dbRead) {
		if (process.env.NODE_ENV === 'production') {
			readProcessedTeams().then(docs => {
				setProcessed(docs);
				readRuns().then(newRuns => {
					setRuns(newRuns);
					readTeams().then(newTeams => {
						setPits(newTeams);
						setDbRead(true);
					});
				});
			});
		} else {
			setProcessed([
				JSON.parse('{"event":"2020ncpem","notes":[],"_id":"5e3a0a149b88210008cacf6a","team":1533,"matches":2,"data":{"power_cells":{"upper_cell":{"average":16,"average_bestfit":{"yintercept":4,"slope":8},"average_duration":8.46875},"lower_cell":{"average":1,"average_bestfit":{"yintercept":-2,"slope":2},"average_duration":3},"drop_cell":{"average":1.5,"average_bestfit":{"yintercept":0,"slope":1},"average_duration":13.666666666666666}},"start_panel":{"successful_panel":{"average":2,"average_bestfit":{"yintercept":2,"slope":0},"average_duration":7,"average_duration_bestfit":{"yintercept":7,"slope":0}}},"start_hang":{"successful_hang":{"average":1,"average_bestfit":{"yintercept":1,"slope":0},"average_duration":9,"average_duration_bestfit":{"yintercept":6,"slope":2}}}},"updated":"2020-02-05T00:19:32.202Z","__v":0}')
			]);
			setRuns([
				JSON.parse('{"event":"2020ncpem","_id":"5e3a081644497700079b9e45","team":1533,"match":1,"position":"middle","journal":[{"_id":"5e3a081644497700079b9e67","event":"get_cell","time":23},{"_id":"5e3a081644497700079b9e66","event":"get_cell","time":24},{"_id":"5e3a081644497700079b9e65","event":"get_cell","time":25},{"_id":"5e3a081644497700079b9e64","event":"get_cell","time":26},{"_id":"5e3a081644497700079b9e63","event":"get_cell","time":28},{"_id":"5e3a081644497700079b9e62","event":"upper_cell","time":33},{"_id":"5e3a081644497700079b9e61","event":"upper_cell","time":33},{"_id":"5e3a081644497700079b9e60","event":"upper_cell","time":34},{"_id":"5e3a081644497700079b9e5f","event":"upper_cell","time":34},{"_id":"5e3a081644497700079b9e5e","event":"upper_cell","time":35},{"_id":"5e3a081644497700079b9e5d","event":"start_panel","time":38},{"_id":"5e3a081644497700079b9e5c","event":"successful_panel","time":44},{"_id":"5e3a081644497700079b9e5b","event":"get_cell","time":50},{"_id":"5e3a081644497700079b9e5a","event":"get_cell","time":50},{"_id":"5e3a081644497700079b9e59","event":"get_cell","time":51},{"_id":"5e3a081644497700079b9e58","event":"get_cell","time":53},{"_id":"5e3a081644497700079b9e57","event":"upper_cell","time":56},{"_id":"5e3a081644497700079b9e56","event":"upper_cell","time":56},{"_id":"5e3a081644497700079b9e55","event":"upper_cell","time":56},{"_id":"5e3a081644497700079b9e54","event":"get_cell","time":62},{"_id":"5e3a081644497700079b9e53","event":"get_cell","time":63},{"_id":"5e3a081644497700079b9e52","event":"get_cell","time":63},{"_id":"5e3a081644497700079b9e51","event":"get_cell","time":64},{"_id":"5e3a081644497700079b9e50","event":"upper_cell","time":66},{"_id":"5e3a081644497700079b9e4f","event":"upper_cell","time":66},{"_id":"5e3a081644497700079b9e4e","event":"upper_cell","time":67},{"_id":"5e3a081644497700079b9e4d","event":"drop_cell","time":68},{"_id":"5e3a081644497700079b9e4c","event":"upper_cell","time":69},{"_id":"5e3a081644497700079b9e4b","event":"start_defend","time":84},{"_id":"5e3a081644497700079b9e4a","event":"end_defend","time":104},{"_id":"5e3a081644497700079b9e49","event":"start_panel","time":107},{"_id":"5e3a081644497700079b9e48","event":"successful_panel","time":115},{"_id":"5e3a081644497700079b9e47","event":"start_hang","time":122},{"_id":"5e3a081644497700079b9e46","event":"successful_hang","time":130}],"notes":"test","scouter":"penguinsnail@onebuttonmouse.com","updated":"2020-02-05T00:11:02.744Z","__v":0}'),
				JSON.parse('{"event":"2020ncpem","_id":"5e38cd16dfc0e10007d7835a","team":1533,"match":13,"position":"middle","journal":[{"_id":"5e38cd16dfc0e10007d78395","event":"get_cell","time":0},{"_id":"5e38cd16dfc0e10007d78394","event":"get_cell","time":0},{"_id":"5e38cd16dfc0e10007d78393","event":"upper_cell","time":12},{"_id":"5e38cd16dfc0e10007d78392","event":"upper_cell","time":12},{"_id":"5e38cd16dfc0e10007d78391","event":"get_cell","time":16},{"_id":"5e38cd16dfc0e10007d78390","event":"get_cell","time":16},{"_id":"5e38cd16dfc0e10007d7838f","event":"get_cell","time":17},{"_id":"5e38cd16dfc0e10007d7838e","event":"get_cell","time":18},{"_id":"5e38cd16dfc0e10007d7838d","event":"get_cell","time":19},{"_id":"5e38cd16dfc0e10007d7838c","event":"upper_cell","time":24},{"_id":"5e38cd16dfc0e10007d7838b","event":"upper_cell","time":24},{"_id":"5e38cd16dfc0e10007d7838a","event":"upper_cell","time":24},{"_id":"5e38cd16dfc0e10007d78389","event":"upper_cell","time":25},{"_id":"5e38cd16dfc0e10007d78388","event":"upper_cell","time":25},{"_id":"5e38cd16dfc0e10007d78387","event":"start_panel","time":31},{"_id":"5e38cd16dfc0e10007d78386","event":"successful_panel","time":37},{"_id":"5e38cd16dfc0e10007d78385","event":"get_cell","time":40},{"_id":"5e38cd16dfc0e10007d78384","event":"get_cell","time":43},{"_id":"5e38cd16dfc0e10007d78383","event":"get_cell","time":44},{"_id":"5e38cd16dfc0e10007d78382","event":"get_cell","time":45},{"_id":"5e38cd16dfc0e10007d78381","event":"get_cell","time":47},{"_id":"5e38cd16dfc0e10007d78380","event":"upper_cell","time":48},{"_id":"5e38cd16dfc0e10007d7837f","event":"upper_cell","time":49},{"_id":"5e38cd16dfc0e10007d7837e","event":"drop_cell","time":50},{"_id":"5e38cd16dfc0e10007d7837d","event":"upper_cell","time":50},{"_id":"5e38cd16dfc0e10007d7837c","event":"upper_cell","time":51},{"_id":"5e38cd16dfc0e10007d7837b","event":"get_cell","time":54},{"_id":"5e38cd16dfc0e10007d7837a","event":"get_cell","time":55},{"_id":"5e38cd16dfc0e10007d78379","event":"get_cell","time":57},{"_id":"5e38cd16dfc0e10007d78378","event":"start_defend","time":64},{"_id":"5e38cd16dfc0e10007d78377","event":"end_defend","time":72},{"_id":"5e38cd16dfc0e10007d78376","event":"get_cell","time":81},{"_id":"5e38cd16dfc0e10007d78375","event":"get_cell","time":82},{"_id":"5e38cd16dfc0e10007d78374","event":"drop_cell","time":84},{"_id":"5e38cd16dfc0e10007d78373","event":"upper_cell","time":85},{"_id":"5e38cd16dfc0e10007d78372","event":"upper_cell","time":85},{"_id":"5e38cd16dfc0e10007d78371","event":"upper_cell","time":86},{"_id":"5e38cd16dfc0e10007d78370","event":"upper_cell","time":86},{"_id":"5e38cd16dfc0e10007d7836f","event":"start_panel","time":89},{"_id":"5e38cd16dfc0e10007d7836e","event":"successful_panel","time":97},{"_id":"5e38cd16dfc0e10007d7836d","event":"get_cell","time":108},{"_id":"5e38cd16dfc0e10007d7836c","event":"get_cell","time":109},{"_id":"5e38cd16dfc0e10007d7836b","event":"get_cell","time":109},{"_id":"5e38cd16dfc0e10007d7836a","event":"lower_cell","time":111},{"_id":"5e38cd16dfc0e10007d78369","event":"lower_cell","time":112},{"_id":"5e38cd16dfc0e10007d78368","event":"get_cell","time":114},{"_id":"5e38cd16dfc0e10007d78367","event":"get_cell","time":114},{"_id":"5e38cd16dfc0e10007d78366","event":"get_cell","time":115},{"_id":"5e38cd16dfc0e10007d78365","event":"get_cell","time":115},{"_id":"5e38cd16dfc0e10007d78364","event":"upper_cell","time":117},{"_id":"5e38cd16dfc0e10007d78363","event":"upper_cell","time":118},{"_id":"5e38cd16dfc0e10007d78362","event":"upper_cell","time":118},{"_id":"5e38cd16dfc0e10007d78361","event":"get_cell","time":122},{"_id":"5e38cd16dfc0e10007d78360","event":"get_cell","time":122},{"_id":"5e38cd16dfc0e10007d7835f","event":"get_cell","time":123},{"_id":"5e38cd16dfc0e10007d7835e","event":"upper_cell","time":124},{"_id":"5e38cd16dfc0e10007d7835d","event":"upper_cell","time":125},{"_id":"5e38cd16dfc0e10007d7835c","event":"start_hang","time":128},{"_id":"5e38cd16dfc0e10007d7835b","event":"successful_hang","time":138}],"notes":"test 1","scouter":"penguinsnail@onebuttonmouse.com","updated":"2020-02-04T01:47:02.152Z","__v":0}'),
				JSON.parse('{"event":"2020ncpem","_id":"5e38cd16dfc0e10007d7835a","team":1533,"match":10,"position":"middle","journal":[{"_id":"5e38cd16dfc0e10007d78395","event":"get_cell","time":0},{"_id":"5e38cd16dfc0e10007d78394","event":"get_cell","time":0},{"_id":"5e38cd16dfc0e10007d78393","event":"upper_cell","time":12},{"_id":"5e38cd16dfc0e10007d78392","event":"upper_cell","time":12},{"_id":"5e38cd16dfc0e10007d78391","event":"get_cell","time":16},{"_id":"5e38cd16dfc0e10007d78390","event":"get_cell","time":16},{"_id":"5e38cd16dfc0e10007d7838f","event":"get_cell","time":17},{"_id":"5e38cd16dfc0e10007d7838e","event":"get_cell","time":18},{"_id":"5e38cd16dfc0e10007d7838d","event":"get_cell","time":19},{"_id":"5e38cd16dfc0e10007d7838c","event":"upper_cell","time":24},{"_id":"5e38cd16dfc0e10007d7838b","event":"upper_cell","time":24},{"_id":"5e38cd16dfc0e10007d7838a","event":"upper_cell","time":24},{"_id":"5e38cd16dfc0e10007d78389","event":"upper_cell","time":25},{"_id":"5e38cd16dfc0e10007d78388","event":"upper_cell","time":25},{"_id":"5e38cd16dfc0e10007d78387","event":"start_panel","time":31},{"_id":"5e38cd16dfc0e10007d78386","event":"successful_panel","time":37},{"_id":"5e38cd16dfc0e10007d78385","event":"get_cell","time":40},{"_id":"5e38cd16dfc0e10007d78384","event":"get_cell","time":43},{"_id":"5e38cd16dfc0e10007d78383","event":"get_cell","time":44},{"_id":"5e38cd16dfc0e10007d78382","event":"get_cell","time":45},{"_id":"5e38cd16dfc0e10007d78381","event":"get_cell","time":47},{"_id":"5e38cd16dfc0e10007d78380","event":"upper_cell","time":48},{"_id":"5e38cd16dfc0e10007d7837f","event":"upper_cell","time":49},{"_id":"5e38cd16dfc0e10007d7837e","event":"drop_cell","time":50},{"_id":"5e38cd16dfc0e10007d7837d","event":"upper_cell","time":50},{"_id":"5e38cd16dfc0e10007d7837c","event":"upper_cell","time":51},{"_id":"5e38cd16dfc0e10007d7837b","event":"get_cell","time":54},{"_id":"5e38cd16dfc0e10007d7837a","event":"get_cell","time":55},{"_id":"5e38cd16dfc0e10007d78379","event":"get_cell","time":57},{"_id":"5e38cd16dfc0e10007d78378","event":"start_defend","time":64},{"_id":"5e38cd16dfc0e10007d78377","event":"end_defend","time":72},{"_id":"5e38cd16dfc0e10007d78376","event":"get_cell","time":81},{"_id":"5e38cd16dfc0e10007d78375","event":"get_cell","time":82},{"_id":"5e38cd16dfc0e10007d78374","event":"drop_cell","time":84},{"_id":"5e38cd16dfc0e10007d78373","event":"upper_cell","time":85},{"_id":"5e38cd16dfc0e10007d78372","event":"upper_cell","time":85},{"_id":"5e38cd16dfc0e10007d78371","event":"upper_cell","time":86},{"_id":"5e38cd16dfc0e10007d78370","event":"upper_cell","time":86},{"_id":"5e38cd16dfc0e10007d7836f","event":"start_panel","time":89},{"_id":"5e38cd16dfc0e10007d7836e","event":"successful_panel","time":97},{"_id":"5e38cd16dfc0e10007d7836d","event":"get_cell","time":108},{"_id":"5e38cd16dfc0e10007d7836c","event":"get_cell","time":109},{"_id":"5e38cd16dfc0e10007d7836b","event":"get_cell","time":109},{"_id":"5e38cd16dfc0e10007d7836a","event":"lower_cell","time":111},{"_id":"5e38cd16dfc0e10007d78369","event":"lower_cell","time":112},{"_id":"5e38cd16dfc0e10007d78368","event":"get_cell","time":114},{"_id":"5e38cd16dfc0e10007d78367","event":"get_cell","time":114},{"_id":"5e38cd16dfc0e10007d78366","event":"get_cell","time":115},{"_id":"5e38cd16dfc0e10007d78365","event":"get_cell","time":115},{"_id":"5e38cd16dfc0e10007d78364","event":"upper_cell","time":117},{"_id":"5e38cd16dfc0e10007d78363","event":"upper_cell","time":118},{"_id":"5e38cd16dfc0e10007d78362","event":"upper_cell","time":118},{"_id":"5e38cd16dfc0e10007d78361","event":"get_cell","time":122},{"_id":"5e38cd16dfc0e10007d78360","event":"get_cell","time":122},{"_id":"5e38cd16dfc0e10007d7835f","event":"get_cell","time":123},{"_id":"5e38cd16dfc0e10007d7835e","event":"upper_cell","time":124},{"_id":"5e38cd16dfc0e10007d7835d","event":"upper_cell","time":125},{"_id":"5e38cd16dfc0e10007d7835c","event":"start_hang","time":128},{"_id":"5e38cd16dfc0e10007d7835b","event":"successful_hang","time":138}],"notes":"test 1","scouter":"penguinsnail@onebuttonmouse.com","updated":"2020-02-04T01:47:02.152Z","__v":0}')
			]);
			setPits([
				{
					event: '2020ncpem',
					team: 254,
					data: {
						ground_clearance: 2,
						control_panel: true,
						drivetrain: 'swerve'
					}
				}
			]);
			setDbRead(true);
		}
	}

	const updatePit = (event, team, data) => {
		// store the team doc to local db
		storeLocalTeam({team: team, event: event, data: data}).then(() => {
			// on successful store
			// async sync data with the server
			syncData(user.session.token).then(() => {
				// notification on success
				props.dispatch(sendNotification({
					variant: 'success',
					text: 'Updated data!'
				}));
			}, (e) => {
				// error handling
				// log to console and notify the user
				console.error('failed to sync pits ', e);
				props.dispatch(sendNotification({
					variant: 'error',
					text: 'Failed to sync data!'
				}));
			});
		}, (e) => {
			// error handling
			// log to console and notify the user
			console.error('failed to save pit ', e);
			props.dispatch(sendNotification({
				variant: 'error',
				text: 'Failed to store data!'
			}));
		});
	};

	return (
		<div className={classes.root}>
			{true && <DataContent template={template} events={events} processedTeams={processed} rawRuns={runs.sort((a, b) => a.match - b.match)} updatePit={updatePit} pits={pits} />}
		</div>
	);
};

export default connect(mapStateToProps)(DataContainer);