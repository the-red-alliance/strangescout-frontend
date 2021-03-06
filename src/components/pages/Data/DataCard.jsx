/*
 * Renders a data card
 * Data Dashboard > Event > Team > Game Element
 * 
 * Takes:
 * - game template
 * - the teams processed data object
 * - the teams runs
 * - the top key for the game element
 * 
 * Card includes:
 * - bar chart with a bar per match quantifying each child of the top key element
 * - server-processed data for each child event (typically the teams event-wide averages)
 */

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardHeader, Typography } from '@material-ui/core';
import { Divider, List, ListItem, ListItemText } from '@material-ui/core';

import { ResponsiveContainer, BarChart, PieChart, Pie, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// small script to calculate a hex color from a string
// used to pick colors for visualizations
import { string2color } from '../../../utils/string2color';

const useStyles = makeStyles(theme => ({
	// card styles
	card: {
		// fill to a max width of 500px but scale down on smaller screens
		margin: '10px',
		maxWidth: '500px',
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

/* http://recharts.org/en-US/examples/PieChartWithCustomizedLabel */
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
	cx, cy, midAngle, innerRadius, outerRadius, percent, index,
}) => {
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
	const x = cx + radius * Math.cos(-midAngle * RADIAN);
	const y = cy + radius * Math.sin(-midAngle * RADIAN);

	return (
		<text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
			{`${(percent * 100).toFixed(0)}%`}
		</text>
	);
};

export function DataCard(props) {
	const { template, processedObject, teamsRuns, topKey } = props;
	const classes = useStyles();

	if (Object.keys(template).length < 1) return <React.Fragment />;

	// find the top item by iterating through the game template in search of `topKey`
	const topItem = template.scout.run.filter(item => item.key === topKey)[0];
	// set the title to the `analysisDisplay` if it exists, else default to the normal display value
	const title = topItem.analysisDisplay ? topItem.analysisDisplay : topItem.display;

	// get a list of available child keys from the processed data object matching our top key
	const availableChildren = Object.keys(processedObject.data[topKey]);

	// initialize our chart data object
	let data = [];

	if (!topItem.singleUse) {
		// if the top item in the template has children:
		if (topItem.type !== 'duration' && topItem.children) {
			// for each run/match the team has done:
			teamsRuns.forEach(run => {
				// start a new datapoint with the name `Match <match_number>`
				let datapoint = { name: 'Match ' + run.match };
				// for each available child in the processed data:
				availableChildren.forEach(childKey => {
					// tally up all occurences in the current match's journal
					let tally = run.journal.filter(journal => journal.event === childKey).length;
					// set the tally into the new datapoint
					datapoint[childKey] = tally;
				});

				// push the final datapoint into our data array
				data.push(datapoint);
			});
		} else if (topItem.type === 'duration') {
			// for each run/match the team has done:
			teamsRuns.forEach(run => {
				// start a new datapoint with the name `Match <match_number>`
				let datapoint = { name: 'Match ' + run.match };
				// load journal
				let journal = [ ...run.journal ].filter(journalItem => ([ topItem.startKey, topItem.endKey ].includes(journalItem.event)));
				let indexes = [];
				if (journal.length > 0) {
					if (journal[journal.length - 1].event === topItem.startKey){
						journal.push({event: topItem.endKey, time: template.gameInfo.duration});
					}
				}
				
				// for each journal event
				journal.forEach((value, index) => {
					// if the journal event matches the current child we're tracking
					if (value.event === topItem.endKey) {
						// push it's index to our indexes array
						indexes.push(index);
					}
				});
				// initialize total time counter
				let totalTime = 0;
				// for each tracked index (each occurrence)
				indexes.forEach(indexValue => {
					// the difference in timestamp between our tracked child and the event before it (the start/get event)
					// is added to the total time counter
					totalTime = totalTime + ( journal[indexValue].time - journal[indexValue-1].time );
				});
				datapoint['Duration'] = totalTime;

				// push the final datapoint into our data array
				data.push(datapoint);
			});
		}
	} else {
		if (topItem.type === 'single_item') {
			let total = 0;

			Object.keys(processedObject.data[topKey]).forEach(childKey => {
				// for each child of the top level
				let datapoint = {
					name: template.scout.run.filter(r => r.key === topKey)[0].children.filter(c => c.key === childKey)[0].display ?
					      template.scout.run.filter(r => r.key === topKey)[0].children.filter(c => c.key === childKey)[0].display :
					      childKey,
					value: processedObject.data[topKey][childKey].average
				};
				data.push(datapoint);
				total = total + processedObject.data[topKey][childKey].average;
			});

			if (total < 1) {
				data.push({
					name: 'None',
					value: 1 - total
				});
			}
		}
	}

	// the above data processing only occurs once and won't be changed for the cards lifetime,
	// so we don't have to worry about using state for it as no rerenders will be required

	return (
		<Card className={classes.card}>
			<CardHeader title={title} />
			<CardContent>
				{/* ResponsiveContainer creates a chart that can scale to the full width of the parent container, in this case our card */}
				<ResponsiveContainer width='100%' height={300}>
					{/* Create a bar chart, pass it our data, and set some margins */}
					{!topItem.singleUse ?
						<BarChart
						data={data}
						margin={{
							top: 0, right: 20, bottom: 20, left: 20,
						}}
						>
							{/* Render a grid onto our chart using dashed lines */}
							<CartesianGrid strokeDasharray="3 3" />
							{/* Render an X-axis and use the key `name` from datapoints as the point names */}
							<XAxis dataKey="name" />
							<YAxis />
							{/* Render a tooltip allowing the user to hover over a bar to get exact numbers */}
							<Tooltip />
							<Legend />
							{/*
								For each of the available child keys in the processed objects:
								- Render a bar on the chart:
									- `key` is required by map
									- `dataKey` is a string specifying which value in the datapoint to use
									- `name` sets the name of the datapoints/bars
										If the element has display text use it, otherwise default to the underlying key
									- `fill` sets the fill color of the bar
										Set by converting the key to a hex color code

							*/}
							{availableChildren.map(childKey => {
								if (topItem.type === 'duration') {
									return (
										<Bar
										key={'Duration-bar'}
										dataKey={'Duration'}
										name={'Duration'}
										fill={'#' + string2color('Duration')}
										/>
									)
								} else {
									return (
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
									)
								}
							})}
						</BarChart>
					:
						<PieChart
						margin={{
							top: 0, right: 20, bottom: 20, left: 20,
						}}
						>
							<Pie
							dataKey="value"
							isAnimationActive={false}
							data={data}
							labelLine={false}
							label={renderCustomizedLabel}
							>
								{
									data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.name === 'None' ? '#CCCCCC' : '#' + string2color(entry.name)} />)
								}
							</Pie>
							<Legend />
						</PieChart>
					}
				</ResponsiveContainer>
				<div className={classes.listContainer}>
					{topItem.type === 'duration' &&
						<React.Fragment>
							{/* Render a divider with some margin to help visually distinguish sections */}
							<Divider style={{marginBottom: '15px'}} />
							{/* Render a list with header set to the display name of the child of the top element that this list is for */}
							<List className={classes.list}>
								{/*
									For each key of the processed objects under the child key
									- sort them by a predetermined order
									- then map by the keys to a switch case
								*/}
								{Object.keys(processedObject.data[topKey]).sort((k1, k2) => {
									let possibilities = ['average_total_duration'];
									let k1i = possibilities.indexOf(k1);
									let k2i = possibilities.indexOf(k2);
									return k1i - k2i;
								}).map(key => {
									// switch/case through the key to render a list item for each processed data point
									// default to blank to ignore unknown datapoints
									switch (key) {
										case 'average_total_duration':
											return (
												<ListItem key={key}>
													<ListItemText primary={'Average Duration: ' + Math.round(processedObject.data[topKey][key]*100)/100 + ' seconds'} />
												</ListItem>
											)
										default:
											return <React.Fragment key={key} />
									}
								})}
							</List>
						</React.Fragment>
					}
					{/*
						For each of the child keys under the element in the processed object:
							- Map to a fragment to contain a data list
					*/}
					{topItem.type !== 'duration' && Object.keys(processedObject.data[topKey]).map(key => (
						<React.Fragment key={key}>
							{/* Render a divider with some margin to help visually distinguish sections */}
							<Divider style={{marginBottom: '15px'}} />
							{/* Render a list with header set to the display name of the child of the top element that this list is for */}
							<List className={classes.list} subheader={<Typography>{topItem.children.filter(child => child.key === key)[0].display}</Typography>}>
								{/*
									For each key of the processed objects under the child key
									- sort them by a predetermined order
									- then map by the keys to a switch case
								*/}
								{Object.keys(processedObject.data[topKey][key]).sort((k1, k2) => {
									let possibilities = ['average', 'average_duration', 'average_bestfit'];
									let k1i = possibilities.indexOf(k1);
									let k2i = possibilities.indexOf(k2);
									return k1i - k2i;
								}).map(l2key => {
									// switch/case through the key to render a list item for each processed data point
									// default to blank to ignore unknown datapoints
									switch (l2key) {
										case 'average':
											if (!topItem.singleUse) {
												return (
													<ListItem key={l2key}>
														<ListItemText primary={'Average Cycles: ' + Math.round(processedObject.data[topKey][key][l2key]*100)/100} />
													</ListItem>
												)
											} else {
												return (
													<React.Fragment key={l2key} />
												)
											}
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