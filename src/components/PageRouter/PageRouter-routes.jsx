import React from 'react';

// routing imports
import { Switch, Route } from "react-router-dom";

// import not found page
import NotFound from '../pages/NotFound';

// import pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';

export function PageRouter(props) {
	return(
		<Switch location={props.location}>
			<Route exact path="/" component={Home} />
			<Route exact path="/login" component={Login} />
			<Route exact path="/signup" component={SignUp} />
			<Route component={NotFound} />
		</Switch>
	);
};