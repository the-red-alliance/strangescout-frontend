import React from 'react';

// animation imports
import posed, { PoseGroup } from 'react-pose';

import { PageRouter as PageRouterContent } from './PageRouter-routes.jsx';

const RouteContainer = posed.div({
	enter: { opacity: 1, duration: 150, beforeChildren: true },
	exit: { opacity: 0, duration: 150 }
});

export function PageRouter(props) {
	console.log(props)
	return(
		<PoseGroup>
			<RouteContainer key={props.location.pathname}>
				<PageRouterContent {...props} />
			</RouteContainer>
		</PoseGroup>
	);
};