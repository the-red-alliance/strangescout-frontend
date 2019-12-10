import React from 'react';
// for styles
import { makeStyles } from '@material-ui/core/styles';
// cards
import { Card, CardContent } from '@material-ui/core';

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
}));

export function Home() {
	// import classes/styles
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Card className={classes.card}>
				<CardContent>
					
				</CardContent>
			</Card>
		</div>
	);
};
