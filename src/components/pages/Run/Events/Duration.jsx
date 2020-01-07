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

	if (localLastUndo !== renderState.lastUndo) {
		setLocalLastUndo(renderState.lastUndo);
		if (renderState.lastUndo.event === event.endKey) {
			setActive(true);
		} else if (renderState.lastUndo.event === event.key) {
			setActive(false);
		}
	}

	const onClick = () => {
		let newRunState = { ...runState };
		let newRenderState = { ...renderState };

		let journalEvent = {
			event: event.key,
			time: totalTime - remainingTime
		};
		let readableEvent = event.display;

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
			{ !active ? event.display : event.endDisplay }
		</Button>
	);
};

export default SingleItem;