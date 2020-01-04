import React from 'react';
import { useHistory } from 'react-router-dom';
// for styles
import { makeStyles } from '@material-ui/core/styles';
// cards
import { Card, CardHeader, CardContent } from '@material-ui/core';

import { Button } from '@material-ui/core';

// create styles
const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		justifyContent: 'center',
	},
	card: {
		width: '90%',
		maxWidth: '350px',
	},
	cardHeader: {
		paddingBottom: '0px',
		textAlign: 'center',
	},

	container: {
		width: "100%",
		display: "grid",
		gridTemplateColumns: "1fr",
		gridTemplateRows: props => {
			const { admin, invite } = props;
			let rows = '1fr 1fr 1fr';
			if (admin) rows = rows + ' 1fr';
			if (invite) rows = rows + ' 1fr';
			return rows;
		},
		gridGap: "20px",
	},
	row1: {
		gridRow: "1 / 2",
		gridColumn: "1 / 2",
		display: 'flex',
		justifyContent: 'center',
	},
	row2: {
		gridRow: "2 / 3",
		gridColumn: "1 / 2",
		display: 'flex',
		justifyContent: 'center',
	},
	row3: {
		gridRow: "3 / 4",
		gridColumn: "1 / 2",
		display: 'flex',
		justifyContent: 'center',
	},
	row4: {
		gridRow: "4 / 5",
		gridColumn: "1 / 2",
		display: 'flex',
		justifyContent: 'center',
	},
	row5: {
		gridRow: "5 / 6",
		gridColumn: "1 / 2",
		display: 'flex',
		justifyContent: 'center',
	},

	syncButton: {
		gridRow: props => {
			const { admin, invite } = props;
			let index = 3;
			if (admin) index = index + 1;
			if (invite) index = index + 1;
			return `${index} / ${index + 1}`;
		},
		gridColumn: "1 / 2",
		display: 'flex',
		justifyContent: 'center',
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
	const { invite, admin } = props;

	// history api for routing
	const history = useHistory();

	const redirect = (path) => {
		history.push(path);
	};

	return (
		<div className={classes.root}>
			<Card className={classes.card}>
				<CardHeader className={classes.cardHeader} title={"Welcome back!"} />
				<CardContent>
					<div className={classes.container}>
						<div className={classes.row1}>
							<Button className={classes.button} variant="contained" color="primary" onClick={() => redirect('/run')}>
								Scout a Match
							</Button>
						</div>
						<div className={classes.row2}>
							<Button className={classes.button} variant="contained" color="primary" onClick={() => redirect('/data')}>
								Data Dashboard
							</Button>
						</div>
						{ invite &&
							<div className={classes.row3}>
								<Button className={classes.button} variant="contained" onClick={() => redirect('/invite')}>
									Invite a User
								</Button>
							</div>
						}
						{ admin &&
							<div className={invite ? classes.row4 : classes.row3}>
								<Button className={classes.button} variant="contained" color="secondary" onClick={() => redirect('/admin')}>
									Admin Panel
								</Button>
							</div>
						}
						<div className={classes.syncButton}>
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
