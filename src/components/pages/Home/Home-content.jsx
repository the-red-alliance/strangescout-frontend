import React from 'react';
import { useHistory } from 'react-router-dom';
// for styles
import { makeStyles } from '@material-ui/core/styles';
// cards
import { Card, CardHeader, CardContent } from '@material-ui/core';

import { Button } from '@material-ui/core';

// create styles
const useStyles = makeStyles(theme => ({
	// root class for the page
	// centers the content within
	root: {
		display: 'flex',
		justifyContent: 'center',
	},
	// the main card class
	// no more than 350px wide, but scale down with the viewport width
	// only take up 90% of the available width (padding so card doesn't touch screen edges)
	card: {
		width: '90%',
		maxWidth: '350px',
	},
	// remove padding from the bottom of the card title and center it horizontally
	cardHeader: {
		paddingBottom: '0px',
		textAlign: 'center',
	},

	// container for rows within the card
	container: {
		width: "100%",
		display: "grid",
		gridTemplateColumns: "1fr",
		// calculate rows
		gridTemplateRows: props => {
			const { invite } = props;
			// start with a three row base
			let rows = '1fr 1fr 1fr';
			// if the user can invite we need an extra row
			if (invite) rows = rows + ' 1fr';
			return rows;
		},
		gridGap: "20px",
	},
	// row base
	// centers contents and uses the main column
	rowBase: {
		display: 'flex',
		justifyContent: 'center',
		gridColumn: "1 / 2",
	},

	button: {
		width: '90%',
		maxWidth: '200px',
		margin: '3px',
	},
}));

export function Home(props) {
	// import classes/styles
	const classes = useStyles(props);
	const { invite } = props;

	// history api for routing
	const history = useHistory();

	// redirect to a router path
		const redirect = (path) => {
		history.push(path);
	};

	return (
		<div className={classes.root}>
			<Card className={classes.card}>
				<CardHeader className={classes.cardHeader} title={"Welcome back!"} />
				<CardContent>
					<div className={classes.container}>
						{/* Button rows consist of a div with a reuseable row base and the row set separately */}
						<div className={classes.rowBase} style={{ gridRow: "1 / 2" }}>
							<Button className={classes.button} variant="contained" color="primary" onClick={() => redirect('/run')}>
								Scout a Match
							</Button>
						</div>
						<div className={classes.rowBase} style={{ gridRow: "2 / 3" }}>
							<Button className={classes.button} variant="contained" color="primary" onClick={() => redirect('/data')}>
								Data Dashboard
							</Button>
						</div>
						{/* only render the invite button if the user has invite capabilities */}
						{ invite &&
							<div className={classes.rowBase} style={{ gridRow: "3 / 4" }}>
								<Button className={classes.button} variant="contained" onClick={() => redirect('/invite')}>
									Invite a User
								</Button>
							</div>
						}
						{/* shift the set row down if the user can invite */}
						<div className={classes.rowBase} style={{ gridRow: !invite ? "3 / 4" : "4 / 5" }}>
							<Button className={classes.button} variant="contained" color="secondary" onClick={props.syncAction}>
								Sync Data
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
