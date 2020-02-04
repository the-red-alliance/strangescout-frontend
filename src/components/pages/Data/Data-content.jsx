import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardHeader, Typography } from '@material-ui/core';

import { Selector } from './Selector.jsx';
import { DataCard } from './DataCard.jsx';

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
	},
	container: {
		paddingTop: '20px',
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'center',
	},
}));

export function DataContent(props) {
	const classes = useStyles();
	const { template, events, processedTeams } = props;

	let startedEvents = events.filter(event => event.startDate < Date.now()).sort((a, b) => a.startDate - b.startDate);
	let availableTeams = processedTeams.filter(processed => processed.event === startedEvents[startedEvents.length - 1].key).sort((a, b) => a.team - b.team).map(pro => pro.team);

	let initialSelection = {event: startedEvents.length > 0 ? startedEvents[startedEvents.length - 1].key : events.sort((a, b) => a.startDate - b.startDate)[0].key, team: availableTeams[0]};
	const [ selection, setSelection ] = useState(initialSelection);

	const teams = [...new Set(processedTeams.filter(pro => pro.event === selection.event).map(fil => fil.team))];
	const selectedObj = processedTeams.filter(obj => (obj.team === selection.team && obj.event === selection.event))[0];

	return (
		<div className={classes.root}>
			<Selector events={events} selection={selection} setSelection={setSelection} processedTeams={processedTeams} availableTeams={teams} />
			<div className={classes.container}>
				{/* Handle no teams at event and no data for team at event */}
				{teams.length < 1 &&
					<Typography variant='h6'>No teams available!</Typography>
				}
				{selectedObj && !selectedObj.data &&
					<Typography variant='h6'>No data available!</Typography>
				}

				{/* if an object matches the selection AND that object has a dataset */}
				{selectedObj && selectedObj.data && Object.keys(selectedObj.data).map(key => (
					<DataCard key={key} template={template} topKey={key} />
				))}
			</div>
		</div>
	);
};
