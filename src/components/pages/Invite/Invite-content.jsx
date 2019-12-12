import React, { useState } from 'react';
// for styles
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
// cards
import { Card, CardHeader, CardContent, CardActions } from '@material-ui/core';
// forms
import { Input, InputLabel, FormControl, FormControlLabel } from '@material-ui/core';
// text and buttons
import { Typography, Button, Checkbox } from '@material-ui/core';

// create form validators
import formValidator from '../../../utils/formValidator.js';
const validator = new formValidator([
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
		// id of input
		field: 'duration',
		// type of validation
		method: 'isInt',
		validWhen: true,
		// error message
		message: 'Must be a whole number'
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

	container: {
		width: "100%",
		display: "grid",
		gridTemplateColumns: "1fr",
		gridTemplateRows: props => {
			let rows = "1fr 1fr 1fr 1fr";
			if (props.single) rows = rows + ' 1fr';
			if (props.props.admin) rows = rows + ' 1fr';
			if (props.expires) rows = rows + ' 1fr';
			return rows;
		},
		gridGap: "10px",
		marginBottom: '10px',
	},
	row1: {
		gridRow: "1 / 2",
		gridColumn: "1 / 2",
	},
	row2: {
		gridRow: "2 / 3",
		gridColumn: "1 / 2",
	},
	row3: {
		gridRow: "3 / 4",
		gridColumn: "1 / 2",
	},
	row4: {
		gridRow: "4 / 5",
		gridColumn: "1 / 2",
	},
	row5: {
		gridRow: "5 / 6",
		gridColumn: "1 / 2",
	},
	row6: {
		gridRow: "6 / 7",
		gridColumn: "1 / 2",
	},
	row7: {
		gridRow: "7 / 8",
		gridColumn: "1 / 2",
	},

	input: {
		marginBottom: '10px',
	},

	errorText: {
		position: 'absolute',
		bottom: -22,
	},
}));

export function Invite(props) {
	const initialState = {
		email: '',
		duration: undefined,
		single: false,
		invite: false,
		admin: false,
	};
	const [state, setState] = useState(initialState);
	const [expires, setExpires] = useState(false);
	const [single, setSingle] = useState(false);

	// import classes/styles
	const classes = useStyles({props: props, state: state, expires: expires, single: single});

	// generate validation object from validators
	const validation = validator.validate(state);

	// update fields in state
	const handleChange = prop => event => {
		setState({ ...state, [prop]: event.target.type === 'number' ? parseInt(event.target.value) : event.target.value });
	};

	const toggleChecked = key => {
		setState({ ...state, [key]: !state[key] });
	};

	const toggleSingle = () => {
		setSingle(!single);
	};

	const toggleExpires = () => {
		if (expires) {
			setExpires(false);
			setState({...state, duration: 0});
		} else {
			setExpires(true);
			setState({...state, duration: 1});
		};
	};

	const reset = () => {
		setState(initialState);
		setExpires(false);
		setSingle(false);
		props.resetAction();
	}

	return (
		<div className={classes.root}>
			<Card className={classes.card}>
				<CardHeader className={classes.cardHeader} title={"Invite"} />
				<CardContent>
					{ !props.invite.invite.code ?
						<div className={classes.container}>
							<FormControlLabel className={clsx(classes.row1)}
							control={<Checkbox checked={single} onChange={() => {toggleSingle()}} />}
							label="Invite a single user"
							/>
							{ single &&
								<FormControl className={clsx(classes.row2, classes.input)}>
									<InputLabel>Invited Email</InputLabel>
									<Input
									id="email"
									type="text"
									value={state.email}
									onChange={handleChange('email') /* triger handleChange fn from parent */}
									/>
									{/* if `username` is present in the touched object:
									display any errors for `username` in the validation object
									else display blank ('') */}
									{state.email ?
										<Typography variant={'body2'} color={'error'} className={classes.errorText}>
											{validation.email.message}
										</Typography>
									: ''}
								</FormControl>
							}
							<FormControlLabel className={clsx(single ? classes.row3 : classes.row2)}
							control={<Checkbox checked={state.invite} onChange={() => {toggleChecked('invite')}} />}
							label="Invited user can invite new users"
							/>
							{ props.admin &&
								<FormControlLabel className={clsx(single ? classes.row4 : classes.row3)}
								control={<Checkbox checked={state.admin} onChange={() => {toggleChecked('admin')}} />}
								label="Invited user is an admin"
								/>
							}
							<FormControlLabel
							className={clsx(() => {
								let index = 3;
								if (props.admin) index = index + 1;
								if (state.single) index = index + 1;
								return classes['row'+index];
							})}
							control={<Checkbox checked={state.single} onChange={() => {toggleChecked('single')}} />}
							label="Invite is single-use"
							/>
							<FormControlLabel
							className={clsx(() => {
								let index = 4;
								if (props.admin) index = index + 1;
								if (single) index = index + 1;
								return classes['row'+index];
							})}
							control={<Checkbox checked={expires} onChange={toggleExpires} />}
							label="Invite expires"
							/>
							{ expires &&
								<FormControl className={clsx(() => {
									let index = 4;
									if (props.admin) index = index + 1;
									if (single) index = index + 1;
									return classes['row'+index];
								}, classes.input)}>
									<InputLabel>Invite Duration (hours)</InputLabel>
									<Input
									id="duration"
									type="number"
									value={state.duration}
									onChange={handleChange('duration') /* triger handleChange fn from parent */}
									/>
									<Typography variant={'body2'} color={'error'} className={classes.errorText}>
										{validation.duration.message}
									</Typography>
								</FormControl>
							}
						</div>
					:
						<Typography>Invite Code: {props.invite.invite.code}</Typography>
					}
				</CardContent>
				<CardActions className={classes.cardActions}>
					{ !props.invite.invite.code ?
						<Button
						variant={"contained"}
						color={"primary"}
						disabled={((single && validation.email.isInvalid) || (expires && validation.duration.isInvalid))}
						onClick={() => {props.inviteAction(state)}}
						>
							Create Invite
						</Button>
					:
						<Button
						variant={"contained"}
						onClick={reset}
						>
							New Invite
						</Button>
					}
				</CardActions>
			</Card>
		</div>
	);
};
