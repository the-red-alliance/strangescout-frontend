import React from 'react';

// routing imports
import { Switch, Route } from "react-router-dom";

// import not found page
import NotFound from '../pages/NotFound';

// import pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import Invite from '../pages/Invite';
import Account from '../pages/Account';
import Run from '../pages/Run';
import Data from '../pages/Data';

export function PageRouter(props) {
	return(
		<Switch location={props.location}>
			{ props.ready &&
				[
					<Route exact key="/" path="/" component={Home} />,
					<Route exact key="/login" path="/login" component={Login} />,
					<Route exact key="/signup" path="/signup" component={SignUp} />,
					<Route exact key="/invite" path="/invite" component={Invite} />,
					<Route exact key="/account" path="/account" component={Account} />,
					<Route exact key="/run" path="/run" component={Run} />,
					<Route exact key="/data" path="/data" component={Data} />,
					<Route key="notfound" component={NotFound} />
				].map(item => item)
			}
		</Switch>
	);
};