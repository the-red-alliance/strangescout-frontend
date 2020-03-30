import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardHeader, Typography } from '@material-ui/core';

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

const normalizeData = data => {
	const fieldDimensions = {
		width: 54,
		height: 27,
	};

	let newData = [];
	data.forEach(dataObj => {
		if (dataObj.alliance === 'red') {
			newData.push(dataObj);
		} else {
			let newDataObj = { ...dataObj };
			newDataObj.positions = [];

			dataObj.positions.forEach(position => {
				let newPosition = { time: position.time };
				newPosition.x = ((fieldDimensions.width / 2) - position.x) + (fieldDimensions.width / 2);
				newPosition.y = ((fieldDimensions.height / 2) - position.y) + (fieldDimensions.height / 2);

				newDataObj.positions.push(newPosition);
			});

			newData.push(newDataObj);
		}
	});
	
	return newData.map(motion => motion.positions).flat();
};

export function HeatmapCard(props) {
	const { fieldImg, data } = props;
	const classes = useStyles();

	return (
		<Card className={classes.card}>
			<CardHeader style={{ paddingBottom: '0px' }} title={'Heatmap'} />
			<CardContent>
				<Typography style={{ marginBottom: '10px' }}>
					(Normalized to the red alliance)
				</Typography>
				<Heatmap data={normalizeData(data)} fieldImgUrl={fieldImg} />
			</CardContent>
		</Card>
	);
};