import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
		// id of input
		field: 'email',
		// type of validation
		method: 'isEmpty',
		validWhen: false,
		// error message
		message: 'Email is required'
	},
	{
		// id of input
		field: 'email',
		// type of validation
		method: 'isEmail',
		validWhen: true,
		// error message
		message: 'Not a valid email'
	},
	{
		field: 'password',
		method: 'isEmpty',
		validWhen: false,
		message: 'Password is required'
	},
	{
		field: 'code',
		method: 'isEmpty',
		validWhen: false,
		message: 'Invite code is required'
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
		gridTemplateRows: "1fr 1fr",
		gridGap: "20px",
	},
	userInput: {
		gridRow: "1 / 2",
		gridColumn: "1 / 2",
	},
	passInput: {
		gridRow: "2 / 3",
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

export function Login(props) {
	// import classes/styles
	const classes = useStyles();

	const initialState = {
		email: '',
		password: '',
		// track what fields have been touched
		touched: {},

		showPassword: false
	};
	const [state, setState] = useState(initialState);

	// generate validation object from validators
	const validation = validator.validate(state);

	// update fields in state
	const handleChange = prop => event => {
		setState({ ...state, [prop]: event.target.value, touched: { ...state.touched, [prop]: true } });
	};

	// toggle password visibility in state
	const handleClickShowPassword = () => {
		setState({ ...state, showPassword: !state.showPassword });
	};

	return (
		<div className={classes.root}>
			<Card className={classes.card}>
				<CardHeader className={classes.cardHeader} title={"Login"} />
				<CardContent>
					<div className={classes.formContainer}>
						<FormControl className={clsx(classes.input, classes.userInput)}>
							<InputLabel>Email</InputLabel>
							<Input
							id="email"
							type="text"
							value={state.email}
							onChange={handleChange('email') /* triger handleChange fn from parent */}
							/>
							{/* if `username` is present in the touched object:
							display any errors for `username` in the validation object
							else display blank ('') */}
							{state.touched.email ?
								<Typography variant={'body2'} color={'error'} className={classes.errorText}>
									{validation.email.message}
								</Typography>
							: ''}
						</FormControl>

						<FormControl className={clsx(classes.input, classes.passInput)}>
							<InputLabel>Password</InputLabel>
							<Input
							id="password"
							type={state.showPassword ? 'text' : 'password' /* if `showPassword` this is a text field, else an obscured password field */}
							value={state.password}
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
					<Link to="/signup">Don't have an account?</Link>
					<span className={classes.spacer} />
					<Button variant={"contained"} color={"primary"} disabled={!validation.isValid}>Login</Button>
				</CardActions>
			</Card>
		</div>
	);
};
