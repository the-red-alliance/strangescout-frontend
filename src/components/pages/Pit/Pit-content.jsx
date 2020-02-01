import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Card, CardHeader, CardContent, CardActions, Button } from '@material-ui/core';

import { FormControl, FormHelperText } from '@material-ui/core';
import { Input, InputLabel } from '@material-ui/core';
import { Select, MenuItem } from '@material-ui/core';
import { FormControlLabel, Checkbox } from '@material-ui/core';

// create form validators from the template
import formValidator from '../../../utils/formValidator.js';
const createValidator = (template) => {
	// start with empty validators
	let newValidators = [];
	// for each item in the pit scouting section
	template.scout.pit.forEach(element => {
		// if the element IS marked required and IS NOT a boolean
		if (element.required && element.type !== 'boolean') {
			// apply this validator
			newValidators.push({
				field: element.key,
				method: 'isEmpty',
				validWhen: false,
				message: element.name + ' is required'
			});
		}
		// if the element IS required and IS a number
		if (element.required && element.type === 'number') {
			// apply this validator
			newValidators.push({
				field: element.key,
				method: 'isInt',
				validWhen: true,
				message: element.name + ' must be a number'
			});
		}
	});
	// return a validator object
	return new formValidator(newValidators);
};

// setup a validator for the team number
// this is separate from the others
const teamValidator = new formValidator([
	{
		field: 'team',
		method: 'isEmpty',
		validWhen: false,
		message: 'Team is required'
	},
	{
		field: 'team',
		method: 'isInt',
		args: [{min: 0}],
		validWhen: true,
		message: 'Team must be a number'
	}
]);

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
			// by default we will always have 1 row for the team input
			let rows = props.events.length > 0 ? "1fr 1fr" : "1fr";
			// append another row for each pit scout object
			for (let i = 0; i < props.template.scout.pit.length; i++) {
				rows = rows + " 1fr";
			};
			return rows;
		},
		gridGap: "20px",
	},

	spacer: {
		display: 'flex',
		flexGrow: 1,
	},
}));

export function Pit(props) {
	// load the submit function and template from props
	const { submit, template, events } = props;

	// create the initial state
	let initialState = {};
	// for each pit scout item
	template.scout.pit.forEach(value => {
		// if it's a boolean it defaults to false in state
		if (value.type === 'boolean') {
			initialState[value.key] = false;
		// else if it's a select default to an empty string ''
		} else if (value.type === 'select') {
			initialState[value.key] = '';
		}
	});
	// import classes/styles
	const classes = useStyles(props);
	// set a separate state for team number
	const [ team, setTeam ] = useState(undefined);
	const currentEvent = () => {
		return events.filter(event => ( event.startDate < Date.now() && event.endDate > Date.now() ))[0];
	};
	const [ event, setEvent ] = useState(currentEvent() ? currentEvent().key : '');
	// set our data state
	const [ state, setState ] = useState(initialState);
	// set a blank state to keep track of touched fields
	const [ touched, setTouched ] = useState({});
	// create our validation object from the data validator
	const validation = createValidator(template).validate(state);
	// create our validation object from the team validator
	const teamValidation = teamValidator.validate({team: team});

	// handle data changes
	const handleChange = prop => event => {
		// set the touched object
		setTouched({ ...touched, [prop]: true });
		let newvalue;
		// if the item is a number
		if (event.target.type === 'number') {
			// if there is a value, parse it to an int, else return a blank string
			newvalue = Boolean(event.target.value) ? parseInt(event.target.value) : '';
		// else if it's a checkbox
		} else if (event.target.type === 'checkbox') {
			// use the checked key instead of value
			newvalue = event.target.checked;
		} else {
			// else just set to the value
			newvalue = event.target.value;
		}
		// update the data state
		setState({ ...state, [prop]: newvalue });
	};

	// handle changes to the team field
	const handleTeam = prop => event => {
		// set the touched object
		setTouched({ ...touched, team: true });
		// if there is a value, parse it to an int, else return a blank string
		let newvalue = Boolean(event.target.value) ? parseInt(event.target.value) : '';
		// update team state
		setTeam(newvalue);
	};
	// handle changes to the event field
	const handleEvent = prop => event => {
		// set the touched object
		setTouched({ ...touched, event: true });
		// update event state
		setEvent(event.target.value);
	};

	return (
		<div className={classes.root}>
			<Card className={classes.card}>
				<CardHeader title={'Scout a Pit'}/>
				<CardContent>
					<div className={classes.container}>
						{ events.length > 0 &&
							<FormControl
							style={{
								display: 'flex',
								gridColumn: "1 / 2",
								gridRow: "1 / 2",
							}}>
								<InputLabel id="event-label">Event</InputLabel>
								<Select
									labelId="event-label"
									id="event"
									value={event}
									onChange={handleEvent('event')}
								>
									{events.map(item => {
										return (
											<MenuItem key={item.key} value={item.key}>{item.name}</MenuItem>
										);
									})}
								</Select>
							</FormControl>
						}
						<FormControl
						style={{
							display: 'flex',
							gridColumn: '1 / 2',
							gridRow: events.length > 0 ? "2 / 3" : "1 / 2",
						}}
						>
							<InputLabel>Team</InputLabel>
							<Input
							id='team'
							type='number'
							value={team}
							onChange={handleTeam('team')}
							/>
							{/* if team has been touched, it has a validation object, and there is a validation message */}
							{touched.team && teamValidation.team && teamValidation.team.message &&
									<FormHelperText>{teamValidation.team.message}</FormHelperText>
								}
						</FormControl>
						{/* map the pit scout items (for each) */}
						{template.scout.pit.map((value, i) => (
							<FormControl
							key={value.key /* when mapping each child must have a key that acts as an item id for react */}
							style={{
								display: 'flex',
								gridColumn: '1 / 2',
								// determine the row based on the item index
								gridRow: (i + (events.length > 0 ? 3 : 2)) + " / " + (i + (events.length > 0 ? 4 : 3)),
							}}
							>
								{/* switch via the item type key */}
								{(() => {
									switch (value.type) {
										// if this is a select
										case 'select': return (
											<React.Fragment>
												<InputLabel id={value.key + '-label' /* set the label id via item key */}>
													{value.name}
												</InputLabel>
												<Select
												labelId={value.key + '-label' /* link to the label via it's id */}
												id={value.key + '-select'}
												value={state[value.key]}
												onChange={handleChange(value.key)}
												>
													{/* map out the items options */}
													{value.options.map(option => (
														<MenuItem key={option.key} value={option.key}>{option.name}</MenuItem>
													))}
												</Select>
											</React.Fragment>
										);
										// if this is a number
										case 'number': return (
											<React.Fragment>
												<InputLabel>{value.name}</InputLabel>
												<Input
												id={value.key}
												type='number'
												value={state[value.key]}
												onChange={handleChange(value.key)}
												/>
											</React.Fragment>
										);
										// if this is a boolean
										case 'boolean': return (
											<FormControlLabel
											control={
												<Checkbox
												checked={state[value.key]}
												onChange={handleChange(value.key)}
												color="primary"
												/>
											}
											label={value.name}
											/>
										);
										// else be blank
										default: return (
											<React.Fragment/>
										);
									}
								})()}
								{/* if the field has been touched, it has a validation object, and there is a validation message */}
								{touched[value.key] && validation[value.key] && validation[value.key].message &&
									// display that message
									<FormHelperText>{validation[value.key].message}</FormHelperText>
								}
							</FormControl>
						))}
					</div>
				</CardContent>
				<CardActions>
					<span className={classes.spacer} />
					<Button
					variant={"contained"}
					color={"primary"}
					disabled={!validation.isValid || !teamValidation.isValid /* disable submit if both validators aren't valid */}
					onClick={() => submit(team, event, state)}
					>
						Submit
					</Button>
				</CardActions>
			</Card>
		</div>
	);
};