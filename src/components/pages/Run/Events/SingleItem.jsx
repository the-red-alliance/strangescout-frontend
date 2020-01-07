import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Dialog, DialogContent } from '@material-ui/core';
import { Button } from '@material-ui/core';

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
			let rows = "1fr";
			if (props.canHold) rows = rows + " 1fr";
			let i;
			for (i = 0; i < props.children.length; i++) {
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

function ChildDialog(props) {
	const { open, children, canHold, onChild, onUndo, onHold } = props;

	// lets us use the old styles
	const classes = useStyles({ canHold: canHold, children: children });

	return (
		<Dialog open={open} classes={{ paper: classes.dialog }}>
			<DialogContent className={classes.dialogContent}>
				<div className={classes.container}>
					{children.map((child, i) => {
						return (
							<div
							key={child.key}
							style={{
								display: 'flex',
								justifyContent: 'center',
								gridColumn: "1 / 2",
								gridRow: (i + 1) + " / " + (i + 2),
							}}
							>
								<Button
								variant="contained"
								className={classes.button}
								onClick={() => onChild(child.key, child.display)}
								>
									{child.display}
								</Button>
							</div>
						);
					})}
					{ canHold &&
						<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							gridColumn: "1 / 2",
							gridRow: (children.length + 1) + " / " + (children.length + 2),
						}}
						>
							<Button
							variant="contained"
							color="primary"
							className={classes.button}
							onClick={onHold}
							disabled={children.length < 1}
							>
								Hold
							</Button>
						</div>
					}
					<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						gridColumn: "1 / 2",
						gridRow: (children.length + (canHold ? 2 : 1)) + " / " + (children.length + (canHold ? 3 : 2)),
					}}
					>
						<Button
						variant="contained"
						color="secondary"
						className={classes.button}
						onClick={onUndo}
						disabled={children.length < 1}
						>
							Undo
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export function SingleItem(props) {
	const { event, totalTime, remainingTime, renderState, setRenderState, runState, setRunState } = props;

	const children = event ? event.children : [];
	const canHold = event ? event.canHold : false;

	const classes = useStyles({ canHold: canHold, children: children });

	const [ open, setOpen ] = useState(false);
	const [ localLastUndo, setLocalLastUndo ] = useState(null);

	if (localLastUndo !== renderState.lastUndo) {
		setLocalLastUndo(renderState.lastUndo);
		if (children.filter(v => v.key === renderState.lastUndo.event).length > 0) {
			setOpen(true);
		}
	}

	const onTop = () => {
		let newRunState = { ...runState };
		let newRenderState = { ...renderState };

		newRunState.journal.push({
			event: event.key,
			time: totalTime - remainingTime
		});
		newRenderState.readableEventLog.push(event.display);
		
		setOpen(true);
		setRunState(newRunState);
		setRenderState(newRenderState);
	};
	
	const onChild = (key, display) => {
		let newRunState = { ...runState };
		let newRenderState = { ...renderState };

		newRunState.journal.push({
			event: key,
			time: totalTime - remainingTime
		});
		newRenderState.readableEventLog.push(display);
		
		setOpen(false);
		setRunState(newRunState);
		setRenderState(newRenderState);
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
		setOpen(false);
	};

	return (
		<React.Fragment>
			<ChildDialog open={open} children={children} canHold={canHold} onChild={onChild} onUndo={onUndo} />
			<Button
			variant="contained"
			color="primary"
			className={classes.button}
			onClick={onTop}
			disabled={
				!(totalTime - remainingTime >= event.activeTime)
				||
				(remainingTime === 0 && event.endDisable)
				||
				(!event.ignoreHold && Boolean(renderState.holding) && renderState.holding !== event.key)
			}
			>
				{event.display}
			</Button>
		</React.Fragment>
	);
};

export default SingleItem;