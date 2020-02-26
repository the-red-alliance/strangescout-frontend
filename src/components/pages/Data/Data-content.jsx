import React from 'react';

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
}));

export function DataContent(props) {
	const classes = useStyles();
	const { template, events, processedTeam, runs, pit, updatePit, selection, selectEvent, selectTeam, currentEvent } = props;

	if (!currentEvent || Object.keys(currentEvent).length < 1) return <React.Fragment />;

	return (
		<div className={classes.root}>
			<Selector events={events} selection={selection} selectEvent={selectEvent} selectTeam={selectTeam} teams={currentEvent.teams} />
			<div className={classes.container}>
				{/* Handle no teams at event and no data for team at event */}
				{!currentEvent.teams || currentEvent.teams.length < 1 &&
					<Typography variant='h6'>No teams available!</Typography>
				}
				
				{ currentEvent.teams.length > 1 &&
					<PitCard template={template} event={selection.event} team={selection.team} submit={updatePit} readPit={pit} />
				}

				{/* if an object matches the selection AND that object has a dataset */}
				{processedTeam && processedTeam.data && Object.keys(processedTeam.data).map(key => (
					<DataCard key={key} className={classes.dataCard} template={template} topKey={key} processedObject={processedTeam} teamsRuns={runs} />
				))}
			</div>
		</div>
	);
};
