import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardHeader } from '@material-ui/core';

import { BarWithTrendChart } from './Charts/BarWithTrendChart.jsx';

const useStyles = makeStyles(theme => ({
	cardContainer: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	chartCard: {
		margin: '15px',
		maxWidth: '350px',
		width: '100%',
	},
	chartCardContent: {
		height: '200px',
	},
}));

export function DataSingle(props) {
	const classes = useStyles();
	const { template, teamData } = props;

	console.log(teamData)

	let formattedData = {};
	Object.keys(teamData.data).forEach(key => {
		const filteredRunEvents = template.scout.run.filter(value => value.key === key);
		if (filteredRunEvents.length === 1) {
			if (filteredRunEvents[0].children) {
				Object.keys(teamData.data[key]).forEach(subkey => {
					const bestFitEndpoints = [
						{
							x: 1,
							y: teamData.data[key][subkey].average_bestfit.yintercept + teamData.data[key][subkey].average_bestfit.slope
						},
						{
							x: teamData.runs.length,
							y: (teamData.runs.length * teamData.data[key][subkey].average_bestfit.slope) + teamData.data[key][subkey].average_bestfit.yintercept
						}
					];
					formattedData[subkey] = {
						xypoints: [],
						bestFit: { ...teamData.data[key][subkey].average_bestfit, endpoints: bestFitEndpoints },
					};

					teamData.runs.forEach((run, i) => {
						const count = run.journal.filter(eventValue => eventValue.event === subkey).length;
						formattedData[subkey].xypoints.push({x: i + 1, y: count});
					});
				});
			} else {
				/**
				formattedData[filteredRunEvents[0].key] = {
					xypoints: [],
					bestFit: teamData.data[key].average_bestfit,
				}; */
			}
		}
	});
	console.log(formattedData)

	return (
		<React.Fragment>
			{Object.keys(formattedData).map(key => (
				<Card className={classes.chartCard} key={key}>
					<CardHeader title={key} />
						<CardContent className={classes.chartCardContent}>
						<BarWithTrendChart xtitle="Robot Run" ytitle="Count" dataSet={formattedData[key].xypoints} bestFit={formattedData[key].bestFit} />
					</CardContent>
				</Card>
			))}
		</React.Fragment>
	);
};
