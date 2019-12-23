import React, { useState } from 'react';
// for styles
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
// cards
import { Card, CardHeader, CardContent, CardActions } from '@material-ui/core';
// forms
import { FormControl, TextField } from '@material-ui/core';
// text and buttons
import { Typography, Button } from '@material-ui/core';

// create styles
const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	card: {
		width: '90%',
		maxWidth: '500px',
	},
	cardHeader: {
		paddingBottom: '0px',
	},
	cardActions: {
		display: 'flex',
		justifyContent: 'right',
		padding: '13px',
	},

	container: {
		width: "100%",
		display: "grid",
		gridTemplateColumns: "1fr",
		gridTemplateRows: props => {
			let rows = "1fr";
			
			return rows;
		},
		gridGap: "10px",
		marginBottom: '10px',
	},
	row1: {
		gridRow: "1 / 2",
		gridColumn: "1 / 2",
	},

	input: {
		marginBottom: '10px',
	},

	errorText: {
		position: 'absolute',
		bottom: -22,
	},

	spacer: {
		display: 'flex',
		flexGrow: 1,
	},
}));

export function Admin(props) {
	const initialState = {
		template: props.template ? JSON.stringify(props.template, (key, val) => {
			if (key === '_id') {
				return undefined;
			} else if (key === '__v') {
				return undefined;
			} else return val;
		}, 4) : '',
	};
	const [state, setState] = useState(initialState);

	// import classes/styles
	const classes = useStyles({props: props, state: state});

	// update fields in state
	const handleChange = prop => event => {
		setState({ ...state, [prop]: event.target.value });
	};

	const templateIsValid = () => {
		try {
			JSON.parse(state.template);
			return true;
		} catch {
			return false;
		}
	};

	return (
		<div className={classes.root}>
			<Card className={classes.card}>
				<CardHeader className={classes.cardHeader} title={"Admin Panel"} />
				<CardContent>
					<div className={classes.container}>
						<FormControl className={clsx(classes.row1, classes.input)}>
							<TextField
							id="template"
							label="Game Template"
							multiline
							rows="20"
							margin="normal"
							value={state.template}
							onChange={handleChange('template')}
							/>
							{!templateIsValid() ?
								<Typography variant={'body2'} color={'error'} className={classes.errorText}>
									Template is not a valid JSON string!
								</Typography>
							: ''}
						</FormControl>
					</div>
				</CardContent>
				<CardActions className={classes.cardActions}>
					<span className={classes.spacer} />
					<Button
					variant={"contained"}
					color={"primary"}
					disabled={!templateIsValid()}
					onClick={() => {props.onSubmit(JSON.parse(state.template))}}
					>
						Submit
					</Button>
				</CardActions>
			</Card>
		</div>
	);
};
