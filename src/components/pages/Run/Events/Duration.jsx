import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	button: {
		width: '90%',
		maxWidth: '225px',
	}
}));

export function SingleItem(props) {
	const { event, totalTime, remainingTime, renderState, setRenderState, runState, setRunState } = props;

	const classes = useStyles();
	const [ active, setActive ] = useState(false);
	const [ localLastUndo, setLocalLastUndo ] = useState(null);

	// if there's been a new undo we haven't handled
	if (localLastUndo !== renderState.lastUndo) {
		// update our local undo tracking
		setLocalLastUndo(renderState.lastUndo);
		// if the undo was for our end event
		if (renderState.lastUndo.event === event.endKey) {
			// set the duration active
			setActive(true);
		// else if the undo was for our start event
		} else if (renderState.lastUndo.event === event.key) {
			// set the duration inactive
			setActive(false);
		}
	}

	const onClick = () => {
		let newRunState = { ...runState };
		let newRenderState = { ...renderState };

		let journalEvent = {
			event: event.startKey,
			time: totalTime - remainingTime
		};
		let readableEvent = event.startDisplay;

		if (active) {
			journalEvent.event = event.endKey;
			readableEvent = event.endDisplay;
		}
		newRunState.journal.push(journalEvent);
		newRenderState.readableEventLog.push(readableEvent);
		
		setRunState(newRunState);
		setRenderState(newRenderState);
		setActive(!active);
	};

	return (
		<Button
		variant="contained"
		color="primary"
		className={classes.button}
		onClick={onClick}
		disabled={
			!(totalTime - remainingTime >= event.activeTime)
			||
			(remainingTime === 0 && event.endDisable)
			||
			(!event.ignoreHold && Boolean(renderState.holding))
		}
		>
			{ !active ? event.startDisplay : event.endDisplay }
		</Button>
	);
};

export default SingleItem;