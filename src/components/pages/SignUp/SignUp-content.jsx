import React from 'react';
// for styles
import { makeStyles } from '@material-ui/core/styles';
// cards
import { Card, CardHeader, CardContent, CardActions } from '@material-ui/core';
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
		maxWidth: '350px',
	}
}));

export function SignUp(props) {
	// import classes/styles
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Card className={classes.card}>
				<CardHeader title={"Sign Up"} />
				<CardContent>
					{props.code}
				</CardContent>
				<CardActions>

				</CardActions>
			</Card>
		</div>
	);
};
