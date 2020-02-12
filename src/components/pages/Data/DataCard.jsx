import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardHeader } from '@material-ui/core';
import { Divider, List, ListItem, ListItemText } from '@material-ui/core';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import { string2color } from '../../../utils/string2color';

const useStyles = makeStyles(theme => ({
	card: {
		margin: '10px',
		maxWidth: '500px',
		width: '100%',
	},
	listContainer: {
		alignItems: 'center',
		paddingLeft: '15px',
		paddingRight: '15px'
	},
}));

export function DataCard(props) {
	const { template, processedObject, teamsRuns, topKey } = props;
	const classes = useStyles();

	const topItem = template.scout.run.filter(item => item.key === topKey)[0];
	const title = topItem.analysisDisplay ? topItem.analysisDisplay : topItem.display;

	const availableChildren = Object.keys(processedObject.data[topKey]);

	let initialData = [];

	if (topItem.children) {
		teamsRuns.forEach(run => {
			let datapoint = { name: 'Match ' + run.match };
			availableChildren.forEach(childKey => {
				let tally = run.journal.filter(journal => journal.event === childKey).length;
				datapoint[childKey] = tally;
			});

			initialData.push(datapoint);
		});
	}

	const [ data ] = useState(initialData);

	return (
		<Card className={classes.card}>
			<CardHeader title={title} />
			<CardContent>
				<ResponsiveContainer width='100%' height={300}>
					<BarChart
					data={data}
					margin={{
						top: 20, right: 20, bottom: 20, left: 20,
					}}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" />
						<YAxis />
						<Tooltip />
						<Legend />
						{availableChildren.map(childKey => (
							<Bar
							key={childKey + '-bar'}
							dataKey={childKey}
							name={
								template.scout.run.filter(r => r.key === topKey)[0].children.filter(c => c.key === childKey)[0].display ?
								template.scout.run.filter(r => r.key === topKey)[0].children.filter(c => c.key === childKey)[0].display :
								childKey
							}
							fill={'#' + string2color(childKey)}
							/>
						))}
					</BarChart>
				</ResponsiveContainer>
				<div className={classes.listContainer}>
					{Object.keys(processedObject.data[topKey]).map(key => (
						<React.Fragment key={key}>
							<Divider style={{marginBottom: '10px'}} />
							<List subheader={topItem.children.filter(child => child.key === key)[0].display}>
								{Object.keys(processedObject.data[topKey][key]).sort((k1, k2) => {
									let possibilities = ['average', 'average_duration', 'average_bestfit'];
									let k1i = possibilities.indexOf(k1);
									let k2i = possibilities.indexOf(k2);
									return k1i - k2i;
								}).map(l2key => {
									switch (l2key) {
										case 'average':
											return (
												<ListItem key={l2key}>
													<ListItemText primary={'Average Cycles: ' + Math.round(processedObject.data[topKey][key][l2key]*100)/100} />
												</ListItem>
											)
										case 'average_duration':
											return (
												<ListItem key={l2key}>
													<ListItemText primary={'Average Duration: ' + Math.round(processedObject.data[topKey][key][l2key]*100)/100 + ' seconds'} />
												</ListItem>
											)
										case 'average_bestfit':
											return (
												<ListItem key={l2key}>
													<ListItemText primary={'Event Trend Slope: ' + Math.round(processedObject.data[topKey][key][l2key].slope*100)/100} />
												</ListItem>
											)
										default:
											return <React.Fragment key={l2key} />
									}
								})}
							</List>
						</React.Fragment>
					))}
				</div>
			</CardContent>
		</Card>
	);
};