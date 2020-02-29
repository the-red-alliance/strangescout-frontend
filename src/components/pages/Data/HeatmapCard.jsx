import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardHeader } from '@material-ui/core';

import { Heatmap } from '../../Heatmap.jsx';

const useStyles = makeStyles(theme => ({
	// card styles
	card: {
		// fill to a max width of 500px but scale down on smaller screens
		margin: '10px',
		maxWidth: '600px',
		width: '100%',
	},
	// container for processed data lists
	listContainer: {
		// center the lists in the card with some padding so they're not edge to edge
		alignItems: 'center',
		paddingLeft: '15px',
		paddingRight: '15px'
	},
}));

export function HeatmapCard(props) {
	const { fieldImg, data } = props;
	const classes = useStyles();

	return (
		<Card className={classes.card}>
			<CardHeader title={'Heatmap'} />
			<CardContent>
				<Heatmap data={data} fieldImgUrl={fieldImg} />
			</CardContent>
		</Card>
	);
};