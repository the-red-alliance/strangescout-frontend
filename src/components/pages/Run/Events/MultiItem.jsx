import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Dialog, DialogContent, Typography } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { Line } from 'rc-progress';

const useStyles = makeStyles(theme => ({
	dialog: {
		width: '90%',
		maxWidth: '300px',
	},
	dialogContent: {
		paddingBottom: '20px',
	},

	container: {
		width: "100%",
		display: "grid",
		gridTemplateColumns: "1fr",
		gridTemplateRows: props => {
			// by default we need three rows
			// get event, hold, and undo
			let rows = "1.65fr 1fr 1fr 1fr";
			for (let i = 0; i < props.children.length; i++) {
				rows = rows + " 1fr";
			};
			return rows;
		},
		gridGap: "20px",
	},

	progressContainer: {
		width: '90%',
		marginTop: '5px',
	},

	button: {
		width: '90%',
		maxWidth: '225px',
	}
}));

function ChildDialog(props) {
	const { event, open, onGet, onChild, onUndo, onHold, held, journalLength } = props;
	const { children } = event;
	// lets us use the old styles
	const classes = useStyles({ children: event.children });

	return (
		<Dialog open={open} classes={{ paper: classes.dialog }}>
			<DialogContent className={classes.dialogContent}>
				<div className={classes.container}>
					<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						gridColumn: "1 / 2",
						gridRow: "1 / 2",
					}}
					>
						<div className={classes.progressContainer}>
							<div>
								<Line percent={(held / event.max) * 100} strokeWidth="4" />
							</div>
							<div style={{textAlign: 'center', marginTop: 5}}>
								<Typography>Holding {held} of {event.max}</Typography>
							</div>
						</div>
					</div>
					<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						gridColumn: "1 / 2",
						gridRow: "2 / 3",
					}}
					>
						<Button
						variant="contained"
						color="primary"
						className={classes.button}
						onClick={onGet}
						disabled={held >= event.max}
						>
							{event.get.display}
						</Button>
					</div>
					{children.map((child, i) => {
						return (
							<div
							key={child.key}
							style={{
								display: 'flex',
								justifyContent: 'center',
								gridColumn: "1 / 2",
								gridRow: (i + 3) + " / " + (i + 4),
							}}
							>
								<Button
								variant="contained"
								className={classes.button}
								onClick={() => onChild(child.key, child.display)}
								disabled={held < 1}
								>
									{child.display}
								</Button>
							</div>
						);
					})}
					<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						gridColumn: "1 / 2",
						gridRow: (children.length + 3) + " / " + (children.length + 4),
					}}
					>
						<Button
						variant="contained"
						color="primary"
						className={classes.button}
						onClick={onHold}
						disabled={children.length < 1}
						>
							Close
						</Button>
					</div>
					<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						gridColumn: "1 / 2",
						gridRow: (children.length + 4) + " / " + (children.length + 5),
					}}
					>
						<Button
						variant="contained"
						color="secondary"
						className={classes.button}
						onClick={onUndo}
						disabled={children.length < 1 || journalLength < 1}
						>
							Undo
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export function MultiItem(props) {
	const { event, totalTime, remainingTime, renderState, setRenderState, runState, setRunState, matchStatus } = props;

	const children = event ? event.children : [];

	const classes = useStyles({ children: children });

	const [ open, setOpen ] = useState(false);
	const [ localLastUndo, setLocalLastUndo ] = useState(null);
	const [ held, setHeld ] = useState(0);
	const [ loadoutHandled, setLoadoutHandled ] = useState(false);

	if (matchStatus.started && !loadoutHandled) {
		let newHeld = 0;
		runState.journal.forEach(loadoutEvent => {
			if (loadoutEvent.event === event.get.key) {
				if (newHeld < event.max) newHeld = newHeld + 1;
			} else if (event.children.filter(v => v.key === loadoutEvent.event)) {
				if (newHeld > 0) newHeld = newHeld - 1;
			}
		});
		setLoadoutHandled(true);
		setHeld(newHeld);
	}

	if (localLastUndo !== renderState.lastUndo) {
		setLocalLastUndo(renderState.lastUndo);
		if (children.filter(v => v.key === renderState.lastUndo.event).length > 0) {
			setHeld(held < event.max ? held + 1 : held);
		} else if (event.get.key === renderState.lastUndo.event) {
			setHeld(held > 0 ? held - 1 : held);
		}
	}

	const onGet = () => {
		let newRunState = { ...runState };
		let newRenderState = { ...renderState };

		newRunState.journal.push({
			event: event.get.key,
			time: totalTime - remainingTime
		});
		newRenderState.readableEventLog.push(event.get.display);

		setRunState(newRunState);
		setRenderState(newRenderState);
		setHeld(held + 1);
	};
	
	const onChild = (key, display) => {
		let newRunState = { ...runState };
		let newRenderState = { ...renderState };

		newRunState.journal.push({
			event: key,
			time: totalTime - remainingTime
		});
		newRenderState.readableEventLog.push(display);

		setRunState(newRunState);
		setRenderState(newRenderState);
		setHeld(held - 1);
	};

	const onUndo = () => {
		if (runState.journal.length < 1) return;

		let newRenderState = {
			...renderState,
			lastUndo: runState.journal[runState.journal.length - 1],
		};

		let newRunState = {
			...runState,
			journal: [
				...runState.journal
			],
		};

		newRunState.journal.pop();
		newRenderState.readableEventLog.pop();

		setRenderState(newRenderState);
		setRunState(newRunState);
	};

	return (
		<React.Fragment>
			<ChildDialog event={event} open={open} onGet={onGet} onChild={onChild} onHold={() => setOpen(false)} onUndo={onUndo} held={held} journalLength={runState.journal.length} />
			<Button
			variant="contained"
			color="primary"
			className={classes.button}
			onClick={() => setOpen(true)}
			disabled={
				!(totalTime - remainingTime >= event.activeTime)
				||
				(remainingTime === 0 && event.endDisable)
			}
			>
				{event.display}
			</Button>
		</React.Fragment>
	);
};

export default MultiItem;