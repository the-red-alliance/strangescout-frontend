import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	text: {
		marginLeft: '30px',
	},
}));

export function NotFound() {
	// import classes/styles
	const classes = useStyles();

	return (
		<Typography variant={"h5"} className={classes.text}>
			Page not found!
		</Typography>
	);
};