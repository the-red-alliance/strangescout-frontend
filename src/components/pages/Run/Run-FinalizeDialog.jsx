import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { TextField } from '@material-ui/core';
// text and buttons
import { Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	dialog: {
		width: '90%',
		maxWidth: '350px',
	},
	dialogTitle: {
		paddingBottom: '0px',
	},
	dialogContent: {
		paddingBottom: '20px',
	},

	formControl: {
		marginTop: '0px',
		marginBottom: '0px',
		width: '100%',
	},

	container: {
		width: "100%",
	},

	spacer: {
		display: 'flex',
		flexGrow: 1,
	},
}));

export function FinalizeDialog(props) {
	const classes = useStyles();
	const { open, onSubmit, runState, setRunState } = props;

	const handleChange = prop => event => {
		let newvalue;
		if (event.target.type === 'number') {
			newvalue = Boolean(event.target.value) ? parseInt(event.target.value) : '';
		} else {
			newvalue = event.target.value;
		}
		setRunState({ ...runState, [prop]: newvalue });
	};

	
	
	return (
		<Dialog open={open} classes={{ paper: classes.dialog }}>
			<DialogTitle className={classes.dialogTitle}>Finish Match</DialogTitle>
			<DialogContent className={classes.dialogContent}>
				<div className={classes.container}>
					<FormControl className={classes.formControl}>
						<TextField
						id="notes"
						label="Notes"
						multiline
						rows="4"
						margin="normal"
						value={runState.notes}
						onChange={handleChange('notes')}
						/>
					</FormControl>
				</div>
			</DialogContent>
			<DialogActions>
				<span className={classes.spacer} />
				<Button
				variant="contained"
				color="primary"
				onClick={onSubmit}
				>
					Submit
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default FinalizeDialog;