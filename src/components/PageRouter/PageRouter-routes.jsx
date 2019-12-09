import React from 'react';

// routing imports
import { Switch, Route } from "react-router-dom";

// import not found page
import NotFound from '../pages/NotFound';

// import login and signup pages
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';

export function PageRouter(props) {
	return(
		<Switch location={props.location}>
			<Route exact path="/login" component={Login} />
			<Route exact path="/signup" component={SignUp} />
			<Route component={NotFound} />
		</Switch>
	);
};