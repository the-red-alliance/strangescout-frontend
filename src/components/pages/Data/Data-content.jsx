import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import { Selector } from './Selector.jsx';
import { DataCard } from './DataCard.jsx';
import { PitCard } from './PitCard.jsx';

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
	},
	container: {
		paddingTop: '20px',
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'center',
		alignItems: 'start',
	},
	dataCard: {
	},
}));

export function DataContent(props) {
	const classes = useStyles();
	const { template, events, processedTeams, rawRuns, updatePit, pits } = props;

	let startedEvents = events.filter(event => event.startDate < Date.now()).sort((a, b) => a.startDate - b.startDate);
	
	let initialSelection = {event: '', team: null};

	if (events.length > 1) {
		// set the initially selected event
		//     if any events have started, only include teams from the most recently started event
		//     else sort events from earliest to latest, and pick the earliest
		initialSelection.event = startedEvents.length > 0 ? startedEvents[startedEvents.length - 1].key : events.sort((a, b) => a.startDate - b.startDate)[0].key;
		
		let availableTeams = events.filter(event => event.key === initialSelection.event)[0].teams ? events.filter(event => event.key === initialSelection.event)[0].teams.sort((a, b) => a - b) : [];
		initialSelection.team = availableTeams.length > 0 ? availableTeams[0] : null;
	}
	
	const [ selection, setSelection ] = useState(initialSelection);

	const teams = events.filter(event => event.key === selection.event)[0].teams ? events.filter(event => event.key === selection.event)[0].teams : [];
	const selectedObj = processedTeams.filter(obj => (obj.team === selection.team && obj.event === selection.event))[0];
	const selectedRuns = rawRuns.filter(obj => (obj.team === selection.team && obj.event === selection.event));
	const selectedPit = pits.filter(pit => (pit.team === selection.team && pit.event === selection.event))[0];

	return (
		<div className={classes.root}>
			<Selector events={events} selection={selection} setSelection={setSelection} availableTeams={teams} />
			<div className={classes.container}>
				{/* Handle no teams at event and no data for team at event */}
				{teams.length < 1 &&
					<Typography variant='h6'>No teams available!</Typography>
				}
				
				{ teams.length > 1 &&
					<PitCard template={template} event={selection.event} team={selection.team} submit={updatePit} readPit={selectedPit} />
				}

				{/* if an object matches the selection AND that object has a dataset */}
				{selectedObj && selectedObj.data && Object.keys(selectedObj.data).map(key => (
					<DataCard key={key} className={classes.dataCard} template={template} topKey={key} processedObject={selectedObj} teamsRuns={selectedRuns} />
				))}
			</div>
		</div>
	);
};
