import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardHeader, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	card: {
		margin: '10px',
		maxWidth: '500px',
		width: '100%',
	},
}));

export function DataCard(props) {
	const { template, processedObject, teamsRuns, topKey, childKey } = props;
	const classes = useStyles();

	const topItem = template.scout.run.filter(item => item.key === topKey)[0];
	const title = topItem.analysisDisplay ? topItem.analysisDisplay : topItem.display;

	return (
		<Card className={classes.card}>
			<CardHeader title={title} />
		</Card>
	);
};