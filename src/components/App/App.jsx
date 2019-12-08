/*
App component
*/

import React from 'react';

// routing imports
import { HashRouter as Router } from "react-router-dom";
import PageRouter from './PageRouter';

// store imports
import { Provider } from 'react-redux';
import store from '../../store/store.js';

import { makeStyles } from '@material-ui/core/styles';

// import the shell
import Shell from '../Shell';

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
						<PageRouter />
					</div>
				</Router>
			</div>
		</Provider>
	);
};
