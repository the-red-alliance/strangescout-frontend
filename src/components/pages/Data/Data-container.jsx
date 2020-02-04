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
	const [ processedSet, setProcessedSet ] = useState(false);
	const [ runs, setRuns ] = useState([]);

	// redirect to the login page if the user isn't logged in
	// this has to be put after hook calls or else react errors
	if (process.env.NODE_ENV === 'production' && !props.user.loggedin) return <Redirect to={"/login"} />;

	if (!processedSet) {readProcessedTeams().then(docs => {console.log(docs);setProcessedSet(true);setProcessed(docs)})};

	return (
		<div className={classes.root}>
			<DataContent template={template} events={events} processedTeams={processed} rawRuns={runs} />
		</div>
	);
};

export default connect(mapStateToProps)(DataContainer);