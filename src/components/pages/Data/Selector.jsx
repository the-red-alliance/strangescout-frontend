import React from 'react';

import { AppBar, Tabs, Tab } from '@material-ui/core';

export function Selector(props) {
	const { events, teams, selection, selectEvent, selectTeam } = props;

	const handleEvent = (event, newValue) => {
		selectEvent(newValue);
	};

	const handleTeam = (event, newValue) => {
		selectTeam(newValue);
	};

	return (
		<AppBar position="static" color="default">
			<Tabs
			value={selection.event}
			onChange={handleEvent}
			indicatorColor="primary"
			textColor="primary"
			variant="scrollable"
			scrollButtons="auto"
			>
				{events.sort((a, b) => a.startDate - b.startDate).map(event => (
					<Tab key={event.key} label={event.name} value={event.key} />
				))}
			</Tabs>
			{teams.length > 0 &&
				<Tabs
				value={selection.team}
				onChange={handleTeam}
				indicatorColor="primary"
				textColor="primary"
				variant="scrollable"
				scrollButtons="auto"
				>
					{teams.sort((a, b) => a - b).map(team => (
						<Tab key={team} label={team} value={team} />
					))}
				</Tabs>
			}
		</AppBar>
	)
};