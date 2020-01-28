import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Card, CardHeader, CardContent } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	card: {
		width: '90%',
		maxWidth: '350px',
	},
	container: {
		width: "100%",
		display: "grid",
		gridTemplateColumns: "1fr",
		gridTemplateRows: props => {
			// by default we will always have 1 row for the undo button
			let rows = "1fr";
			// append another row for each scout object
			for (let i = 0; i < props.template.scout.pit.length; i++) {
				rows = rows + " 1fr";
			};
			return rows;
		},
		gridGap: "20px",
	},
}));

export function Pit(props) {
	const { template } = props;
	// import classes/styles
	const classes = useStyles(props);
	const [ state, setState ]=useState({})

	return (
		<div className={classes.root}>
			<Card className={classes.card}>
				<CardHeader title={'Scout a Pit'}/>
				<CardContent>
					<div className={classes.container}>
						{template.scout.pit.map((value, i) => (
							<div
							key={value.key}
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								gridColumn: "1 / 2",
								gridRow: (i + 1) + " / " + (i + 2),
							}}
							>
								{(() => {
									switch (value.type) {
										
										default: return (
											<React.Fragment/>
										);
									}
								})()}
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};