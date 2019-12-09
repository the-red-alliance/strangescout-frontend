import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
// for styles
import { makeStyles } from '@material-ui/core/styles';
// toolbar imports
import { AppBar, Toolbar } from '@material-ui/core';
// drawer imports
import { Drawer, Divider, List } from '@material-ui/core';
import DrawerItem from './DrawerItem';
// text and buttons
import { Typography, IconButton } from '@material-ui/core';
// menu and items
import { Menu, MenuItem } from '@material-ui/core';
// icons
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
// drawer icons
import HomeIcon from '@material-ui/icons/HomeRounded';

// create styles
const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
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
	const [state, setState] = useState({drawer: false, menuAnchorEl: null});
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

	const menuButton = () => event => {
		// ignore tab and shift keys (to tab through options)
		if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
			return;
		}
		// set drawer state
		setState({...state, drawer: !state.drawer});
	};

	// drawer contents
	const drawerList = (
		<React.Fragment>
			<List>
				<DrawerItem to={"/"} primary="Home" icon={<HomeIcon />} />
				<Divider variant="middle" />
			</List>
		</React.Fragment>
	);

	return (
		<div className={classes.root}>
			<AppBar position="static">
				<Toolbar>
					<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={menuButton()}>
						<MenuIcon />
					</IconButton>
					<Typography variant="h5" className={classes.title}>
						StrangeScout
					</Typography>
					
						<div>
							<IconButton
								aria-label="account of current user"
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
									<MenuItem key={"profile"} onClick={handleClose}>Profile</MenuItem>,
									<MenuItem key={"account"} onClick={handleClose}>My account</MenuItem>,
									<MenuItem key={"logout"} onClick={handleClose}>Logout</MenuItem>
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
			{/* menu drawer toggled by state */}
			<Drawer id="menudrawer" open={state.drawer} onClose={menuButton()}>
				<div
				className={classes.drawerContents}
				role="presentation"
				onClick={menuButton()}
				onKeyDown={menuButton()}
				>
					{/* use our drawer list defined earlier ^ */}
					{drawerList}
				</div>
			</Drawer>
		</div>
	);
};
