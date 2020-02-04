import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import { DataContent } from './Data-content.jsx';

import { readProcessedTeams } from '../../../utils/database';

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
	
	const { template, events } = props;
	const [ processed, setProcessed ] = useState([]);
	const [ runs, setRuns ] = useState([]);

	// redirect to the login page if the user isn't logged in
	// this has to be put after hook calls or else react errors
	if (process.env.NODE_ENV === 'production' && !props.user.loggedin) return <Redirect to={"/login"} />;

	if (process.env.NODE_ENV !== 'production' && processed.length === 0) {setProcessed(JSON.parse('[{"event":"2020ncpem","notes":[],"_id":"5e36f8d1deab9f95d8bab9e9","team":254,"matches":3,"data":{"power_cells":{"lower_cell":{"average":2.6666666666666665,"average_bestfit":{"yintercept":10.666666666666666,"slope":-4},"average_duration":7.75},"drop_cell":{"average":0.6666666666666666,"average_bestfit":{"yintercept":2.6666666666666665,"slope":-1},"average_duration":5.5}},"start_panel":{"successful_panel":{"average":0.3333333333333333,"average_bestfit":{"yintercept":1.3333333333333333,"slope":-0.5},"average_duration":3}},"start_hang":{"successful_hang":{"average":0.3333333333333333,"average_bestfit":{"yintercept":1.3333333333333333,"slope":-0.5},"average_duration":11}}},"updated":"2020-02-03T02:57:00.152Z","__v":0},{"event":"2020ncpem","notes":[],"_id":"5e36f8d1deab9f95d8bab9e9","team":2555,"matches":3,"data":{"power_cells":{"lower_cell":{"average":2.6666666666666665,"average_bestfit":{"yintercept":10.666666666666666,"slope":-4},"average_duration":7.75},"drop_cell":{"average":0.6666666666666666,"average_bestfit":{"yintercept":2.6666666666666665,"slope":-1},"average_duration":5.5}},"start_panel":{"successful_panel":{"average":0.3333333333333333,"average_bestfit":{"yintercept":1.3333333333333333,"slope":-0.5},"average_duration":3}},"start_hang":{"successful_hang":{"average":0.3333333333333333,"average_bestfit":{"yintercept":1.3333333333333333,"slope":-0.5},"average_duration":11}}},"updated":"2020-02-03T02:57:00.152Z","__v":0},{"event":"2020ncpem","notes":[],"_id":"5e36f8d1deab9f95d8bab9e9","team":9999,"matches":3,"data":{"power_cells":{"lower_cell":{"average":2.6666666666666665,"average_bestfit":{"yintercept":10.666666666666666,"slope":-4},"average_duration":7.75},"drop_cell":{"average":0.6666666666666666,"average_bestfit":{"yintercept":2.6666666666666665,"slope":-1},"average_duration":5.5}},"start_panel":{"successful_panel":{"average":0.3333333333333333,"average_bestfit":{"yintercept":1.3333333333333333,"slope":-0.5},"average_duration":3}},"start_hang":{"successful_hang":{"average":0.3333333333333333,"average_bestfit":{"yintercept":1.3333333333333333,"slope":-0.5},"average_duration":11}}},"updated":"2020-02-03T02:57:00.152Z","__v":0},{"event":"2020ncgui","notes":[],"_id":"5e36f8d1deab9f95d8bab9ea","team":8888,"matches":3,"updated":"2020-02-03T02:57:00.164Z","__v":0},{"event":"2020ncpem","notes":[],"_id":"5e36f8d1deab9f95d8bab9e9","team":1542,"matches":3,"data":{"power_cells":{"lower_cell":{"average":2.6666666666666665,"average_bestfit":{"yintercept":10.666666666666666,"slope":-4},"average_duration":7.75},"drop_cell":{"average":0.6666666666666666,"average_bestfit":{"yintercept":2.6666666666666665,"slope":-1},"average_duration":5.5}},"start_panel":{"successful_panel":{"average":0.3333333333333333,"average_bestfit":{"yintercept":1.3333333333333333,"slope":-0.5},"average_duration":3}},"start_hang":{"successful_hang":{"average":0.3333333333333333,"average_bestfit":{"yintercept":1.3333333333333333,"slope":-0.5},"average_duration":11}}},"updated":"2020-02-03T02:57:00.152Z","__v":0},{"event":"2020ncpem","notes":[],"_id":"5e36f8d1deab9f95d8bab9e9","team":1533,"matches":3,"data":{"power_cells":{"lower_cell":{"average":2.6666666666666665,"average_bestfit":{"yintercept":10.666666666666666,"slope":-4},"average_duration":7.75},"drop_cell":{"average":0.6666666666666666,"average_bestfit":{"yintercept":2.6666666666666665,"slope":-1},"average_duration":5.5}},"start_panel":{"successful_panel":{"average":0.3333333333333333,"average_bestfit":{"yintercept":1.3333333333333333,"slope":-0.5},"average_duration":3}},"start_hang":{"successful_hang":{"average":0.3333333333333333,"average_bestfit":{"yintercept":1.3333333333333333,"slope":-0.5},"average_duration":11}}},"updated":"2020-02-03T02:57:00.152Z","__v":0}]'))}
	if (process.env.NODE_ENV !== 'production' && processed.length === 0) {readProcessedTeams().then(docs => setProcessed(docs))};
	return (
		<div className={classes.root}>
			<DataContent template={template} events={events} processedTeams={processed} rawRuns={runs} />
		</div>
	);
};

export default connect(mapStateToProps)(DataContainer);