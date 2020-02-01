import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Card, CardHeader, CardContent, CardActions, Button } from '@material-ui/core';

import { FormControl, FormHelperText } from '@material-ui/core';
import { Input, InputLabel } from '@material-ui/core';
import { Select, MenuItem } from '@material-ui/core';
import { FormControlLabel, Checkbox } from '@material-ui/core';

// create form validators
import formValidator from '../../../utils/formValidator.js';
const createValidator = (template) => {
	let newValidators = [];
	template.scout.pit.forEach(element => {
		if (element.required && element.type !== 'boolean') {
			newValidators.push({
				field: element.key,
				method: 'isEmpty',
				validWhen: false,
				message: element.name + ' is required'
			});
		}
		if (element.required && element.type === 'number') {
			newValidators.push({
				field: element.key,
				method: 'isInt',
				validWhen: true,
				message: element.name + ' must be a number'
			});
		}
	});
	return new formValidator(newValidators);
};

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

	spacer: {
		display: 'flex',
		flexGrow: 1,
	},
}));

export function Pit(props) {
	const { submit, template } = props;
	let initialState = {};
	template.scout.pit.forEach(value => {
		if (value.type === 'boolean') {
			initialState[value.key] = false;
		} else if (value.type === 'select') {
			initialState[value.key] = '';
		}
	});
	// import classes/styles
	const classes = useStyles(props);
	const [ team, setTeam ] = useState('');
	const [ state, setState ] = useState(initialState);
	const [ touched, setTouched ] = useState({});
	const validation = createValidator(template).validate(state);
	const teamValidation = teamValidator.validate({team: team});

	const handleChange = prop => event => {
		setTouched({ ...touched, [prop]: true });
		let newvalue;
		if (event.target.type === 'number') {
			newvalue = Boolean(event.target.value) ? parseInt(event.target.value) : '';
		} else if (event.target.type === 'checkbox') {
			newvalue = event.target.checked;
		} else {
			newvalue = event.target.value;
		}
		setState({ ...state, [prop]: newvalue });
	};

	const handleTeam = prop => event => {
		setTouched({ ...touched, team: true });
		let newvalue = Boolean(event.target.value) ? parseInt(event.target.value) : '';
		setTeam(newvalue);
	};

	return (
		<div className={classes.root}>
			<Card className={classes.card}>
				<CardHeader title={'Scout a Pit'}/>
				<CardContent>
					<div className={classes.container}>
						<FormControl
						style={{
							display: 'flex',
							gridColumn: '1 / 2',
							gridRow: "1 / 2",
						}}
						>
							<InputLabel>Team</InputLabel>
							<Input
							id='team'
							type='number'
							value={team}
							onChange={handleTeam('team')}
							/>
							{touched.team && teamValidation.team && teamValidation.team.message &&
									<FormHelperText>{teamValidation.team.message}</FormHelperText>
								}
						</FormControl>
						{template.scout.pit.map((value, i) => (
							<FormControl
							key={value.key}
							style={{
								display: 'flex',
								gridColumn: '1 / 2',
								gridRow: (i + 2) + " / " + (i + 3),
							}}
							>
								{(() => {
									switch (value.type) {
										case 'select': return (
											<React.Fragment>
												<InputLabel id={value.key + '-label'}>{value.name}</InputLabel>
												<Select
												labelId={value.key + '-label'}
												id={value.key + '-select'}
												value={state[value.key]}
												onChange={handleChange(value.key)}
												>
													{value.options.map(option => (
														<MenuItem key={option.key} value={option.key}>{option.name}</MenuItem>
													))}
												</Select>
											</React.Fragment>
										);
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
										default: return (
											<React.Fragment/>
										);
									}
								})()}
								{touched[value.key] && validation[value.key] && validation[value.key].message &&
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
					disabled={!validation.isValid || !teamValidation.isValid}
					onClick={() => submit(team, state)}
					>
						Submit
					</Button>
				</CardActions>
			</Card>
		</div>
	);
};