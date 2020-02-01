import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// routing imports
import { HashRouter as Router } from "react-router-dom";
import PageRouter from '../PageRouter';
// store imports
import { Provider } from 'react-redux';
import store from '../../store/store.js';
// import the shell
import Shell from '../Shell';
// import the loader
import Loader from './Loader';

const useStyles = makeStyles(theme => ({
	view: {
		// padding between page views and title bar
		paddingTop: '30px',
	}
}));

export function App() {
	const [ initialLoad, setInitialLoad ] = useState(false);
	// import classes/styles
	const classes = useStyles();

	return (
		<Provider store={store}>
			<Loader initialLoad={initialLoad} afterLoad={() => setInitialLoad(true)} />
			<div className="app">
				<Router>
					<Shell />
					<div className={classes.view}>
						<PageRouter ready={initialLoad} />
					</div>
				</Router>
			</div>
		</Provider>
	);
};
