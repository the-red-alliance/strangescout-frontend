import React from 'react';
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

export function ChildDialog(props) {
	const { open, currentEvent, onChild, onUndo, onHold } = props;
	const children = currentEvent ? currentEvent.children : [];
	const canHold = currentEvent ? currentEvent.canHold : false;

	// lets us use the old styles
	const classes = useStyles({ canHold: canHold, children: children });

	const handleClick = child => {
		onChild(child.key, child.display);
	};

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
								onClick={() => handleClick(child)}
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
							onClick={() => onHold(currentEvent.key)}
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

export default ChildDialog;