import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
	},
	container: {
		textAlign: 'center',
		margin: '0px 10px 0px 10px',
	},
}));

export default function NoEvents() {
	const classes = useStyles();
	
	return (
		<div className={classes.root}>
			<div className={classes.container}>
				<div>
					<Typography variant='h5'>No Events Available!</Typography>
				</div>
				<div>
					<Typography variant='body1'>Please sync data, or contact your scouting administrator if the problem persists.</Typography>
				</div>
			</div>
		</div>
	);
}