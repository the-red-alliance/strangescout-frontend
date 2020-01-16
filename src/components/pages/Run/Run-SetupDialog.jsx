import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { FormControl, FormHelperText } from '@material-ui/core';
import { Input, InputLabel } from '@material-ui/core';
import { Select, MenuItem } from '@material-ui/core';
// text and buttons
import { Button } from '@material-ui/core';

// create form validators
import formValidator from '../../../utils/formValidator.js';
const validator = new formValidator([
	{
		
		field: 'team',
		method: 'isEmpty',
		validWhen: false,
		message: 'Team is required'
	},
	{
		
		field: 'team',
		method: 'isInt',
		args: [{max: 9999}, {min: 0}],
		validWhen: true,
		message: 'Team must be a number'
	},
	{
		
		field: 'match',
		method: 'isEmpty',
		validWhen: false,
		message: 'Match is required'
	},
	{
		
		field: 'match',
		method: 'isInt',
		validWhen: true,
		message: 'Match must be a number'
	},
	{
		
		field: 'position',
		method: 'isEmpty',
		validWhen: false,
		message: 'Position is required'
	},
]);

const useStyles = makeStyles(theme => ({
	dialog: {
		width: '90%',
		maxWidth: '350px',
	},
	dialogContent: {
		paddingBottom: '20px',
	},

	container: {
		width: "100%",
		display: "grid",
		gridTemplateColumns: "1fr",
		gridTemplateRows: "1fr 1fr 1fr 1fr",
		gridGap: "20px",
	},
	row1: {
		display: 'flex',
	//	justifyContent: 'center',
		gridColumn: "1 / 2",
		gridRow: "1 / 2",
	},
	row2: {
		display: 'flex',
	//	justifyContent: 'center',
		gridColumn: "1 / 2",
		gridRow: "2 / 3",
	},
	row3: {
		display: 'flex',
	//	justifyContent: 'center',
		gridColumn: "1 / 2",
		gridRow: "3 / 4",
	},
	row4: {
		display: 'flex',
	//	justifyContent: 'center',
		gridColumn: "1 / 2",
		gridRow: "4 / 5",
	},

	button: {
		width: '90%',
		maxWidth: '225px',
	},

	spacer: {
		display: 'flex',
		flexGrow: 1,
	},
}));

export function SetupDialog(props) {
	const classes = useStyles();
	const { open, template, startMatchAction, runState, setRunState } = props;

	// setup state
	// team, match, starting position
	// loadout is an array converted to JSON because it's set with a html select
	const initialState = {
		team: '',
		match: '',
		position: '',
		loadout: '[]',
	};
	const [state, setState] = useState(initialState);

	const [touched, setTouched] = useState({});

	// generate validation object from validators
	const validation = validator.validate(state);

	const handleChange = prop => event => {
		setTouched({ ...touched, [prop]: true });
		let newvalue;
		if (event.target.type === 'number') {
			newvalue = Boolean(event.target.value) ? parseInt(event.target.value) : '';
		} else {
			newvalue = event.target.value;
		}
		setState({ ...state, [prop]: newvalue });
	};

	const startMatch = () => {
		let newJournal = [ ...runState.journal ];

		let loadoutEvents = JSON.parse(state.loadout);
		loadoutEvents.forEach(item => newJournal.push({event: item, time: 0}));

		setRunState({
			...runState,
			team: state.team,
			match: state.match,
			position: state.position,
			journal: newJournal
		});
		startMatchAction();
	}
	
	return (
		<Dialog open={open} classes={{ paper: classes.dialog }}>
			<DialogTitle>Setup Match</DialogTitle>
			<DialogContent className={classes.dialogContent}>
				<div className={classes.container}>
					<FormControl className={classes.row1}>
						<InputLabel>Team</InputLabel>
						<Input
						id="team"
						type="number"
						min="0"
						max="9999"
						value={state.team}
						onChange={handleChange('team')}
						/>
						{touched.team && validation.team.message &&
							<FormHelperText>{validation.team.message}</FormHelperText>
						}
					</FormControl>
					<FormControl className={classes.row2} error={touched.match && validation.match.isInvalid}>
						<InputLabel>Match</InputLabel>
						<Input
						id="match"
						type="number"
						min="0"
						value={state.match}
						onChange={handleChange('match')}
						/>
						{touched.match && validation.match.message &&
							<FormHelperText>{validation.match.message}</FormHelperText>
						}
					</FormControl>
					<FormControl className={classes.row3} error={touched.position && validation.position.isInvalid}>
						<InputLabel id="robot-start-position-label">Starting Position</InputLabel>
						<Select
							labelId="robot-start-position-label"
							id="robot-start-position"
							value={state.position}
							onChange={handleChange('position')}
						>
							{template.positions.map(item => {
								return (
									<MenuItem key={item.key} value={item.key}>{item.display}</MenuItem>
								);
							})}
						</Select>
						{touched.position && validation.position.message &&
							<FormHelperText>{validation.position.message}</FormHelperText>
						}
					</FormControl>
					<FormControl className={classes.row4}>
						<InputLabel id="robot-loadout-label">Loadout</InputLabel>
						<Select
							labelId="robot-loadout-label"
							id="robot-loadout"
							value={state.loadout}
							onChange={handleChange('loadout')}
						>
							<MenuItem value={'[]'}>None</MenuItem>
							{template.loadouts.map(item => {
								// the loadout events are stringified so the select works properly
								return (
									<MenuItem key={JSON.stringify(item.events)} value={JSON.stringify(item.events)}>{item.display}</MenuItem>
								);
							})}
						</Select>
					</FormControl>
				</div>
			</DialogContent>
			<DialogActions>
				<span className={classes.spacer} />
				<Button
				variant="contained"
				color="primary"
				disabled={!validation.isValid}
				onClick={startMatch}
				>
					Match Start
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default SetupDialog;