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
		gridTemplateRows: props => props.events.length > 0 ? "1fr 1fr 1fr 1fr" : "1fr 1fr 1fr",
		gridGap: "20px",
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
	const classes = useStyles(props);
	const { events, open, template, startMatchAction, runState, setRunState } = props;

	const currentEvent = () => {
		// if there aren't any events quit
		if (events.length < 1) return;
		// get all started events
		const startedEvents = events.filter(event => event.startDate < Date.now()).sort((a, b) => a.startDate - b.startDate);
		// if there aren't any started events or we only have one event overall, return the first event
		if (startedEvents.length === 0 || events.length === 1) return events[0];
		// else return the most recent
		return startedEvents[startedEvents.length - 1];
	};

	// setup state
	// team, match, starting position
	// loadout is an array converted to JSON because it's set with a html select
	const initialState = {
		event: currentEvent() ? currentEvent().key : '',
		team: '',
		match: '',
		loadout: '[]',
	};
	const [state, setState] = useState(initialState);

	const [touched, setTouched] = useState({});

	// generate validation object from validators
	const validation = validator.validate(state);

	const selectedEvent = events.filter(event => event.key === state.event).length > 0 ? events.filter(event => event.key === state.event)[0] : null;

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
			event: events.length > 0 ? state.event : '',
			team: state.team,
			match: state.match,
			journal: newJournal
		});
		startMatchAction();
	}
	
	return (
		<Dialog open={open} classes={{ paper: classes.dialog }}>
			<DialogTitle>Setup Match</DialogTitle>
			<DialogContent className={classes.dialogContent}>
				<div className={classes.container}>
					<FormControl
					style={{
						display: 'flex',
						gridColumn: "1 / 2",
						gridRow: "1 / 2",
					}}>
						<InputLabel id="event-label">Event</InputLabel>
						<Select
							labelid="event-label"
							id="event"
							value={state.event}
							onChange={handleChange('event')}
						>
							{events.map(item => {
								return (
									<MenuItem key={item.key} value={item.key}>{item.name}</MenuItem>
								);
							})}
						</Select>
					</FormControl>
					<FormControl 
					error={touched.team && validation.team.isInvalid}
					style={{
						display: 'flex',
						gridColumn: "1 / 2",
						gridRow: "2 / 3",
					}}>
						<InputLabel id='team-label'>Team Number</InputLabel>
						{(selectedEvent && selectedEvent.teams && selectedEvent.teams.length > 0) ?
							<Select
							labelid="team-label"
							id="team"
							value={state.team}
							onChange={handleChange('team')}
							>
								{selectedEvent.teams.map(item => {
									return (
										<MenuItem key={item} value={item}>{item}</MenuItem>
									);
								})}
							</Select>
						:
							<Input
							id="team"
							labelid='team-label'
							type="number"
							inputProps={{
								inputMode: "numeric",
								pattern: "[0-9]*",
								min: 0,
							}}
							value={state.team}
							onChange={handleChange('team')}
							/>
						}
						{touched.team && validation.team.message &&
							<FormHelperText>{validation.team.message}</FormHelperText>
						}
					</FormControl>
					<FormControl error={touched.match && validation.match.isInvalid}
					style={{
						display: 'flex',
						gridColumn: "1 / 2",
						gridRow: "3 / 4",
					}}>
						<InputLabel>Match Number</InputLabel>
						<Input
						id="match"
						type="number"
						inputProps={{
							inputMode: "numeric",
							pattern: "[0-9]*",
							min: 0,
						}}
						value={state.match}
						onChange={handleChange('match')}
						/>
						{touched.match && validation.match.message &&
							<FormHelperText>{validation.match.message}</FormHelperText>
						}
					</FormControl>
					<FormControl
					style={{
						display: 'flex',
						gridColumn: "1 / 2",
						gridRow: "4 / 5",
					}}>
						<InputLabel id="robot-loadout-label">Loadout</InputLabel>
						<Select
							labelid="robot-loadout-label"
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