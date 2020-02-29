import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardHeader, Typography } from '@material-ui/core';
import { Divider, List, ListItem, ListItemText } from '@material-ui/core';

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

export function NotesCard(props) {
	const { runs } = props;
	const classes = useStyles();

	if (runs.map(run => run.notes).filter(el => el !== null).length < 1) return <React.Fragment />;

	return (
		<Card className={classes.card}>
			<CardHeader title={'Notes'} />
			<CardContent>
				<div className={classes.listContainer}>
					{runs.map(run => {
						if (run.notes) {
							return <React.Fragment />;
						} else {
							return (
								<React.Fragment key={run.event + run.team + run.match}>
									<Divider style={{marginBottom: '15px'}} />
									<List subheader={<Typography>{'Match ' + run.match}</Typography>}>
										<ListItem>
											<ListItemText primary={run.notes} />
										</ListItem>
									</List>
								</React.Fragment>
							)
						}
					})}
				</div>
			</CardContent>
		</Card>
	);
};