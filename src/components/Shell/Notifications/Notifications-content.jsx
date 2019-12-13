import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import { amber, green } from '@material-ui/core/colors';

import { Snackbar, SnackbarContent } from '@material-ui/core';
import { Typography } from '@material-ui/core';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';

const variantIcon = {
	success: CheckCircleIcon,
	warning: WarningIcon,
	error: ErrorIcon,
	info: InfoIcon,
};

const useStyles = makeStyles(theme => ({
	success: {
		backgroundColor: green[600],
	},
	error: {
		backgroundColor: theme.palette.error.dark,
	},
	info: {
		backgroundColor: theme.palette.primary.main,
	},
	warning: {
		backgroundColor: amber[700],
	},
	icon: {
		fontSize: 25,
	},
	iconVariant: {
		opacity: 0.9,
		marginRight: theme.spacing(1),
	},
	message: {
		display: 'flex',
		alignItems: 'center',
	},
	messageText: {
		fontSize: 16,
		marginTop: 2,
	}
}));

export function Notifications(props) {
	const classes = useStyles();
	const { open, handleClose, onClose, text, variant, ...other } = props;
	const Icon = variantIcon[variant];

	return (
		<Snackbar
		anchorOrigin={{
			vertical: 'bottom',
			horizontal: 'left',
		}}
		open={open}
		autoHideDuration={5000}
		onClose={handleClose}
		>
			<SnackbarContent
			className={clsx(classes[variant])}
			aria-describedby="client-snackbar"
			message={
				<span id="client-snackbar" className={classes.message}>
					{ variant && // prevents an error in the console (component renders but icon is undefined because no `variant` prop is given)
						<Icon className={clsx(classes.icon, classes.iconVariant)} />
					}
					<Typography className={classes.messageText}>{text}</Typography>
				</span>
			}
			{...other}
			/>
		</Snackbar>
	);
};