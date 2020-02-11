import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardHeader } from '@material-ui/core';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import { string2color } from '../../../utils/string2color';

const useStyles = makeStyles(theme => ({
	card: {
		margin: '10px',
		maxWidth: '500px',
		width: '100%',
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
			</CardContent>
		</Card>
	);
};