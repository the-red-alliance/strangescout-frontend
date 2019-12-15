import React, { useState } from 'react';
// for styles
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
// cards
import { Card, CardHeader, CardContent, CardActions } from '@material-ui/core';
// forms
import { Input, InputLabel, InputAdornment, FormControl } from '@material-ui/core';
// text and buttons
import { Typography, Button, IconButton } from '@material-ui/core';
// visibility icons
import { Visibility, VisibilityOff } from '@material-ui/icons';

// create form validators
import formValidator from '../../../utils/formValidator.js';
const validator = new formValidator([
	{
		field: 'password',
		method: 'isEmpty',
		validWhen: false,
		message: 'Password is required'
	},
]);

// create styles
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
	cardHeader: {
		paddingBottom: '0px',
	},
	cardActions: {
		display: 'flex',
		justifyContent: 'right',
		padding: '13px',
	},

	formContainer: {
		width: "100%",
		display: "grid",
		gridTemplateColumns: "1fr",
		gridTemplateRows: "1fr",
		gridGap: "20px",
	},
	row1: {
		gridRow: "1 / 2",
		gridColumn: "1 / 2",
	},

	input: {
		margin: '10px',
	},

	errorText: {
		position: 'absolute',
		bottom: -22,
	},

	spacer: {
		display: 'flex',
		flexGrow: 1,
	},
}));

export function Account(props) {
	// import classes/styles
	const classes = useStyles();

	const initialState = {
		settings: {
			password: '',
		},
		// track what fields have been touched
		touched: {},

		showPassword: false
	};
	const [state, setState] = useState(initialState);

	// generate validation object from validators
	const validation = validator.validate(state.settings);

	// update fields in state
	const handleChange = prop => event => {
		setState({ ...state, settings: {...state.settings, [prop]: event.target.value}, touched: { ...state.touched, [prop]: true } });
	};

	// toggle password visibility in state
	const handleClickShowPassword = () => {
		setState({ ...state, showPassword: !state.showPassword });
	};

	return (
		<div className={classes.root}>
			<Card className={classes.card}>
				<CardHeader className={classes.cardHeader} title={"Account Settings"} />
				<CardContent>
					<div className={classes.formContainer}>
						<FormControl className={clsx(classes.input, classes.passInput)}>
							<InputLabel>New password</InputLabel>
							<Input
							id="password"
							disabled={props.loading}
							type={state.showPassword ? 'text' : 'password' /* if `showPassword` this is a text field, else an obscured password field */}
							value={state.settings.password}
							onChange={handleChange('password')}
							endAdornment={
								<InputAdornment position="end">
									<IconButton
									id="show-password"
									aria-label="toggle password visibility"
									onClick={handleClickShowPassword}
									>
										{/* password visibility icon(s) */}
										{state.showPassword ? <Visibility /> : <VisibilityOff />}
									</IconButton>
								</InputAdornment>
							}
							/>
							{state.touched.password ?
								<Typography variant={'body2'} color={'error'} className={classes.errorText}>
									{validation.password.message}
								</Typography>
							: ''}
						</FormControl>
					</div>
				</CardContent>
				<CardActions className={classes.cardActions}>
					<span className={classes.spacer} />
					<Button
					variant={"contained"}
					color={"primary"}
					disabled={!validation.isValid || props.loading}
					onClick={() => props.saveAction(state.settings)}
					>
						Save
					</Button>
				</CardActions>
			</Card>
		</div>
	);
};
