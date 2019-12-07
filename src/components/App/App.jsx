/*
App component
*/

import React from 'react';

// routing imports
import {
	HashRouter as Router,
	Switch,
	Route
} from "react-router-dom";

// store imports
import { Provider } from 'react-redux';
import store from '../../store/store.js';

import { makeStyles } from '@material-ui/core/styles';

// import the shell
import Shell from '../Shell';

// import not found page
import NotFound from '../pages/NotFound';

// import login and signup pages
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';

const useStyles = makeStyles(theme => ({
	view: {
		// padding between page views and title bar
		paddingTop: '30px',
	}
}));

export function App() {
	// import classes/styles
	const classes = useStyles();

	return (
		
		<Provider store={store}>
			<div className="app">
				<Router>
					<Shell />
					<div className={classes.view}>
						<Switch>
							<Route exact path="/login">
								<Login />
							</Route>
							<Route exact path="/signup">
								<SignUp />
							</Route>
							<Route>
								<NotFound />
							</Route>
						</Switch>
					</div>
				</Router>
			</div>
		</Provider>
	);
};
