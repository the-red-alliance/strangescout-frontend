import React, { useState } from 'react';
import { usePreciseTimer } from '../../../utils/usePreciseTimer';
import { makeStyles } from '@material-ui/core/styles';

import { Card, CardHeader, CardContent } from '@material-ui/core';
import { Button } from '@material-ui/core';

import { ChildDialog } from './Run-ChildDialog.jsx';

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
			let rows = "1fr";
			let i;
			for (i = 0; i < props.template.scout.run.length; i++) {
				rows = rows + " 1fr";
			};
			return rows;
		},
		gridGap: "20px",
	},

	button: {
		width: '90%',
		maxWidth: '225px',
	}
}));

export function Run(props) {
	const classes = useStyles(props);
	const { template } = props;

	// page state
	const initialState = {
		readableEventLog: [],
		currentEvent: undefined,
		timerActive: true,
		remaining: 150,
	};
	const [ state, setState ] = useState(initialState);

	// separate child open state
	// we need to close child dialog first then delay for animation times then clear the content
	// if they're in the same state the delay reads state from when it was started,
	// resulting in an empty dialog re-opening
	const [ childOpen, setChildOpen ] = useState(false);

	// scouted run state
	const initialRunState = {
		journal: [],
	};
	const [ runState, setRunState ] = useState(initialRunState);

	// timer hook
	usePreciseTimer((elapsedSeconds) => {
		if (Math.abs(elapsedSeconds - 1) / 1 > 0.1) console.warn('timer drift - elapsed: ' + elapsedSeconds);
		setState({ ...state, remaining: state.remaining - 1 });
	}, 1000, state.timerActive && state.remaining > 0);

	// add an event to the journal
	const addEvent = (key, display, data, currentEvent) => {
		let newRunState = { ...runState };
		let newState = { ...state };

		newRunState.journal.push({
			event: key,
			data: data ? data : undefined
		});

		newState.readableEventLog.push(display);
		if (!Boolean(currentEvent)) {
			setTimeout(() => {
				setState({ ...state, currentEvent: undefined });
			}, 200);
		} else {
			newState.currentEvent = currentEvent;
		}
		setChildOpen(Boolean(currentEvent));

		setRunState(newRunState);
		setState(newState);
	};

	// undo an event
	const undoEvent = () => {
		if (runState.journal.length < 1) return;

		let newState = {
			...state,
			currentEvent: undefined,
		};

		let newChildOpen = false;

		let newRunState = {
			...runState,
			journal: [
				...runState.journal
			],
		};
		newRunState.journal.pop();
		newState.readableEventLog.pop();
		
		if (newRunState.journal.length > 0) {
			let lastEventKey = newRunState.journal[newRunState.journal.length - 1].event;
			let matchingTopEvents = template.scout.run.filter(event => (event.key === lastEventKey));

			if (matchingTopEvents.length === 1) {
				newState.currentEvent = matchingTopEvents[0];
				newChildOpen = true;
			}
		}

		setChildOpen(newChildOpen);
		setState(newState);
		setRunState(newRunState);
	};

	// formatted last event text
	const lastEventDisplay = state.readableEventLog.length > 0 ? 'Last Event: ' + state.readableEventLog[state.readableEventLog.length - 1] : 'No Events';

	return (
		<div className={classes.root}>
			<Card className={classes.card}>
				<CardHeader
				style={{ textAlign: 'center' }}
				title={state.remaining > 0 ? state.remaining + ' Seconds Remaining' : 'Time\'s Up!'}
				subheader={lastEventDisplay}
				/>
				<CardContent>
					<div className={classes.container}>
						{template.scout.run.map((event, i) => {
							return (
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
									<Button
									variant="contained"
									color="primary"
									className={classes.button}
									onClick={() => {
										addEvent(event.key, event.display, null, event);
									}}
									disabled={!(150 - state.remaining >= event.activeTime) || (state.remaining === 0 && event.endDisable)}
									>
										{event.display}
									</Button>
								</div>
							);
						})}
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
							onClick={undoEvent}
							disabled={runState.journal.length < 1}
							>
								Undo
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
			<ChildDialog
			open={childOpen}
			onChild={addEvent}
			onUndo={undoEvent}
			currentEvent={state.currentEvent}
			/>
		</div>
	);
};
