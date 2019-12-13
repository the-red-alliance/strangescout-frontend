import React, { useState } from 'react';
import { Link, useHistory } from "react-router-dom";
// for styles
import { makeStyles } from '@material-ui/core/styles';
// toolbar imports
import { AppBar, Toolbar } from '@material-ui/core';
// drawer imports
// text and buttons
import { Typography, Button, IconButton } from '@material-ui/core';
// menu and items
import { Menu, MenuItem } from '@material-ui/core';
// icons
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

// create styles
const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		textTransform: 'none',
	},

	spacer: {
		flexGrow: 1,
	},

	drawerContents: {
		width: 175,
	},
}));

export function Shell(props) {
	// import classes/styles
	const classes = useStyles();
	// history api for routing
	const history = useHistory();
	// state for drawer and user menu
	const [state, setState] = useState({menuAnchorEl: null});
	// boolean for menu state
	const menuOpen = Boolean(state.menuAnchorEl);

	// handler to set menu anchor
	const handleMenu = event => {
		setState({...state, menuAnchorEl: event.currentTarget});
	};
	// handler to clear menu anchor
	const handleClose = () => {
		setState({...state, menuAnchorEl: null});
	};
	
	return (
		<div className={classes.root}>
			<AppBar position="static">
				<Toolbar>
					<Button variant="text" color="inherit" component={Link} to="/" className={classes.title}>
						<Typography variant="h5" color="inherit">
							StrangeScout
						</Typography>
					</Button>
					<span className={classes.spacer} />
					<div>
						<IconButton
						aria-label="account"
						aria-controls="menu-appbar"
						aria-haspopup="true"
						onClick={handleMenu}
						color="inherit"
						>
							<AccountCircleIcon />
						</IconButton>
						<Menu
						id="menu-appbar"
						anchorEl={state.menuAnchorEl}
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						keepMounted
						transformOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						open={menuOpen}
						onClose={handleClose}
						>
							{props.loggedin ?
							[
								<MenuItem key={"settings"} onClick={() => {history.push('/account'); handleClose();}}>Settings</MenuItem>,
								<MenuItem key={"logout"} onClick={() => {props.logoutAction(); handleClose();}}>Logout</MenuItem>
							].map(item => item)
							:
							[
								<MenuItem key={"login"} onClick={() => {history.push('/login'); handleClose();}}>Login</MenuItem>,
								<MenuItem key={"signup"} onClick={() => {history.push('/signup'); handleClose();}}>Sign Up</MenuItem>
							].map(item => item)
							}
						</Menu>
					</div>
				</Toolbar>
			</AppBar>
		</div>
	);
};
