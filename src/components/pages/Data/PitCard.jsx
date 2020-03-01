/*
 * Renders a pit card
 * Data Dashboard > Event > Team > Pit Card
 * 
 * Takes:
 * - game template
 * - event key
 * - team number
 * - the current value of the pit scout
 * - a submit function
 * 
 * Card includes:
 * - generated form based on the given template to scout a pit
 */

import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardHeader, CardActions, Button } from '@material-ui/core';
import { FormControl, FormControlLabel, FormHelperText, InputLabel, Select, MenuItem, Input, Checkbox, TextField } from '@material-ui/core';

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

const useStyles = makeStyles(theme => ({
	card: {
		margin: '10px',
		maxWidth: '350px',
		width: '100%',
	},
	spacer: {
		flexGrow: 1
	},
	container: {
		width: "100%",
		display: "grid",
		gridTemplateColumns: "1fr",
		gridTemplateRows: props => {
			let newRows = '';
			console.log(newRows)
			for (let i = 0; i < props.template.scout.pit.length; i++) {
				newRows = newRows + "1fr ";
			}
			newRows = newRows + "2.5fr"
			console.log(newRows)
			return newRows;
		},
		gridGap: "20px",
	}
}));

export function PitCard(props) {
	const { template, event, team, readPit, submit } = props;
	// import classes/styles
	const classes = useStyles(props);

	// create the initial state
	let initialState = {};
	template.scout.pit.forEach(value => {
		// if it's a boolean it defaults to false in state
		if (value.type === 'boolean') {
			initialState[value.key] = false;
		// else if it's a select default to an empty string ''
		} else if (value.type === 'select') {
			initialState[value.key] = '';
		} else if (value.type === 'number') {
			initialState[value.key] = '';
		}
		initialState.notes = '';
	});
	// set our data state
	const [ state, setState ] = useState(initialState);
	// set a blank state to keep track of touched fields
	const [ touched, setTouched ] = useState({});
	const [ currentTeam, setCurrentTeam ] = useState(0);

	if (Object.keys(template).length < 1) return <React.Fragment />;

	// create our validation object from the data validator
	const validation = createValidator(template).validate(state);

	if (team !== currentTeam) {
		if (readPit) {
			setState({ ...readPit.data });
		} else {
			setState(initialState);
		}
		setCurrentTeam(team);
	}

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

	return (
		<Card className={classes.card}>
			<CardHeader title={'Team ' + team} />
			<CardContent>
				<div className={classes.container}>
					{/* map the pit scout items (for each) */}
					{template.scout.pit.map((value, i) => (
						<FormControl
						key={value.key /* when mapping each child must have a key that acts as an item id for react */}
						style={{
							display: 'flex',
							gridColumn: '1 / 2',
							// determine the row based on the item index
							gridRow: (i + 1) + " / " + (i + 2),
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
											labelid={value.key + '-label' /* link to the label via it's id */}
											id={value.key + '-select'}
											value={state[value.key] ? state[value.key] : ''}
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
											inputProps={{
												inputMode: "numeric",
												pattern: "[0-9]*",
												min: 0,
											}}
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
					<FormControl
					style={{
						display: 'flex',
						gridColumn: '1 / 2',
						// determine the row based on the item index
						gridRow: (template.scout.pit.length + 1) + " / " + (template.scout.pit.length + 2),
					}}
					>
						<InputLabel id={'notes-label' /* set the label id via item key */}>
							Notes
						</InputLabel>
						<TextField
						labelid={'notes-label' /* link to the label via it's id */}
						id={'notes-area'}
						value={state.notes ? state.notes : ''}
						onChange={handleChange('notes')}
						multiline
						rows="5"
						/>
					</FormControl>
				</div>
			</CardContent>
			<CardActions>
				<span className={classes.spacer} />
				<Button
				variant={"contained"}
				color={"primary"}
				disabled={!validation.isValid}
				onClick={() => submit(event, team, state)}
				>
					Save
				</Button>
			</CardActions>
		</Card>
	);
};