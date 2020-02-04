import React from 'react';

import { AppBar, Tabs, Tab } from '@material-ui/core';

export function Selector(props) {
	const { events, processedTeams, availableTeams, selection, setSelection } = props;

	const handleEvent = (event, newValue) => {
		let newTeams = [...new Set(processedTeams.filter(pro => pro.event === newValue).map(fil => fil.team))];
		let newTeam = newTeams.includes(selection.team) ? selection.team : newTeams[0];
		setSelection({ ...selection, event: newValue, team: newTeam });
	};

	const handleTeam = (event, newValue) => {
		setSelection({...selection, team: newValue});
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
			{availableTeams.length > 0 &&
				<Tabs
				value={selection.team}
				onChange={handleTeam}
				indicatorColor="primary"
				textColor="primary"
				variant="scrollable"
				scrollButtons="auto"
				>
					{availableTeams.sort((a, b) => a - b).map(team => (
						<Tab key={team} label={team} value={team} />
					))}
				</Tabs>
			}
		</AppBar>
	)
};