import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	averageChartCard: {
		maxWidth: '350px',
		width: '100%',
	},
	averageChartCardContent: {
		height: '200px',
	},
}));

export function DataAll(props) {
	const classes = useStyles();

	return (
		<Card className={classes.averageChartCard}>
			<CardContent className={classes.averageChartCardContent}>
			</CardContent>
		</Card>
	);
};
