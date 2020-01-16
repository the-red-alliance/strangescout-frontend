import React, { useState } from 'react';
import { usePreciseTimer } from '../../../utils/usePreciseTimer';
import { makeStyles } from '@material-ui/core/styles';

import { Card, CardHeader, CardContent, CardActions } from '@material-ui/core';
import { Button } from '@material-ui/core';

import SingleItem from './Events/SingleItem';
import MultiItem from './Events/MultiItem';
import Duration from './Events/Duration';

// create styles
const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	card: {
		width: '90%',
		maxWidth: '350px',
	},

	container: {
		width: "100%",
		display: "grid",
		gridTemplateColumns: "1fr",
		gridTemplateRows: props => {
			// by default we will always have 1 row for the undo button
			let rows = "1fr";
			// append another row for each scout object
			for (let i = 0; i < props.template.scout.run.length; i++) {
				rows = rows + " 1fr";
			};
			return rows;
		},
		gridGap: "20px",
	},

	button: {
		width: '90%',
		maxWidth: '225px',
	},

	spacer: {
		display: 'flex',
		flexGrow: 1,
	},
}));

export function Run(props) {
	const classes = useStyles(props);
	// get the game template, total match time, match status, run state and setter, and post match function
	const { template, totalTime, matchStatus, runState, setRunState, afterMatch } = props;

	// page state
	// readable event log for the `last event` display
	// string for the currently held item
	// a boolean for whether or not the loadout has been processed
	// a key for the last item to have been undone
	const initialState = {
		readableEventLog: [],
		holding: '',
		loadoutShown: false,
		lastUndo: null,

	};
	const [ state, setState ] = useState(initialState);
	// set a timer state from the totalTime prop
	const [ remainingTime, setRemainingTime ] = useState(totalTime);

	// timer hook
	usePreciseTimer((elapsedSeconds) => {
		if (Math.abs(elapsedSeconds - 1) / 1 > 0.1) console.warn('timer drift - elapsed: ' + elapsedSeconds);
		setRemainingTime(remainingTime - 1);
	}, 1000, matchStatus.started && remainingTime > 0);

	// formatted last event text
	const lastEventDisplay = state.readableEventLog.length > 0 ? 'Last Event: ' + state.readableEventLog[state.readableEventLog.length - 1] : 'No Events';

	// undo an event from a neutral state
	const undo = () => {
		if (runState.journal.length < 1) return;

		let newState = {
			...state,
			lastUndo: runState.journal[runState.journal.length - 1],
		};

		let newRunState = {
			...runState,
			journal: [
				...runState.journal
			],
		};
		newRunState.journal.pop();
		newState.readableEventLog.pop();

		setState(newState);
		setRunState(newRunState);
	};

	// display event from loadout if necessary
	if (!state.loadoutShown && matchStatus.started) {
		let newState = { ...state, loadoutShown: true };

		if (runState.journal.length === 1) {

			let lastEventKey = runState.journal[0].event;
			let matchingTopEvents = template.scout.run.filter(event => (event.key === lastEventKey));

			if (matchingTopEvents.length === 1) {
				newState.readableEventLog.push(matchingTopEvents[0].display);

				setState(newState);
			}
		}

		setState(newState);
	}

	return (
		<div className={classes.root}>
			<Card className={classes.card}>
				<CardHeader
				style={{ textAlign: 'center' }}
				title={remainingTime > 0 ? remainingTime + ' Seconds Remaining' : 'Time\'s Up!'}
				subheader={lastEventDisplay}
				/>
				<CardContent>
					<div className={classes.container}>
						{template.scout.run.map((event, i) => (
							<div
							key={event.key}
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								gridColumn: "1 / 2",
								gridRow: (i + 1) + " / " + (i + 2),
							}}
							>
								{(() => {
									switch (event.type) {
										case 'single_item': return (
											<SingleItem
											event={event}
											totalTime={totalTime}
											remainingTime={remainingTime}
											renderState={state}
											setRenderState={setState}
											runState={runState}
											setRunState={setRunState}
											matchStatus={matchStatus}
											/>
										);
										case 'multi_item': return (
											<MultiItem
											event={event}
											totalTime={totalTime}
											remainingTime={remainingTime}
											renderState={state}
											setRenderState={setState}
											runState={runState}
											setRunState={setRunState}
											matchStatus={matchStatus}
											/>
										);
										case 'duration': return (
											<Duration
											event={event}
											totalTime={totalTime}
											remainingTime={remainingTime}
											renderState={state}
											setRenderState={setState}
											runState={runState}
											setRunState={setRunState}
											matchStatus={matchStatus}
											/>
										);
										default: return (
											<Button
											variant="contained"
											className={classes.button}
											disabled={true}
											>
												{event.display}
											</Button>
										);
									}
								})()}
							</div>
						))}
						<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							gridColumn: "1 / 2",
							gridRow: (template.scout.run.length + 1) + " / " + (template.scout.run.length + 2),
						}}
						>
							<Button
							variant="contained"
							color="secondary"
							className={classes.button}
							onClick={undo}
							disabled={runState.journal.length < 1}
							>
								Undo
							</Button>
						</div>
					</div>
				</CardContent>
				<CardActions>
					<span className={classes.spacer} />
					<Button
					variant={"contained"}
					color={"primary"}
					disabled={remainingTime > 0}
					onClick={afterMatch}
					>
						Next
					</Button>
				</CardActions>
			</Card>
		</div>
	);
};
