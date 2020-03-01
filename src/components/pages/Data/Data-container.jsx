import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import { DataContent } from './Data-content.jsx';

import { sync, addToQueue, queueTables, queryDB, readableTables } from '../../../utils/storage';
import { sendNotification } from '../../../store/notifications/actions';

import NoEvents from '../../NoEvents';

const useStyles = makeStyles(theme => ({
	root: {
		// center everything
		display: 'flex',
		justifyContent: 'center',
	},
	content: {
		// set the content width so we have some padding
		// regardless of if the drawer is visible
		width: '90%',
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'center',
	},
}));

// map store to prop
function mapStateToProps(state) {
	return {
		user: state.user,
		template: state.template,
	};
};

function DataContainer(props) {
	const { user, template } = props;
	const classes = useStyles();

	const [ loaded, setLoaded ] = useState(false);

	const [ events, setEvents ] = useState([]);
	const [ selection, setSelection ] = useState({});
	const [ selectedEvent, setSelectedEvent ] = useState({});

	const [ runs, setRuns ] = useState([]);
	const [ pit, setPit ] = useState({});
	const [ processedTeam, setProcessedTeam ] = useState({});
	const [ motionworks, setMotionworks ] = useState([]);

	const [ fieldImg, setFieldImg ] = useState('');

	useEffect(() => {
		if (process.env.NODE_ENV === 'production') {
			if (selection.event && selection.team) {
				queryDB(readableTables.RUNS, { event: selection.event, team: selection.team }).then(newRuns => {
					queryDB(readableTables.PROCESSED_TEAMS, { event: selection.event, team: selection.team }).then(newProcessed => {
						queryDB(readableTables.TEAMS, { event: selection.event, team: selection.team }).then(newTeams => {
							queryDB(readableTables.MOTIONWORKS, { event: selection.event, team: selection.team }).then(readMotionworks => {
								setRuns(newRuns);
								setProcessedTeam(newProcessed[0]);
								setPit(newTeams[0]);
								setMotionworks(readMotionworks.map(motion => motion.positions).flat());
							});
						});
					});
				});
			}
		} else {
			setRuns([]);
			setProcessedTeam({});
			setPit({});
			setMotionworks([]);
		}
	}, [selection]);

	// redirect to the login page if the user isn't logged in
	// this has to be put after hook calls or else react errors
	if (process.env.NODE_ENV === 'production' && !user.loggedin) return <Redirect to={"/login"} />;

	/**
	 * Update a team's pit doc
	 * @param {string} event The event key
	 * @param {number} team The team number
	 * @param {{}} data The new team doc
	 */
	const updatePit = (event, team, data) => {
		// store the team doc to local db
		addToQueue(queueTables.TEAMS, {team: team, event: event, data: data}).then(() => {
			// on successful store
			// async sync data with the server
			sync(user.session.token).then(() => {
				// notification on success
				props.dispatch(sendNotification({
					variant: 'success',
					text: 'Updated data!'
				}));
			}, e => {
				// error handling
				// log to console and notify the user
				console.error('failed to sync pits ', e);
				props.dispatch(sendNotification({
					variant: 'error',
					text: 'Failed to sync data!'
				}));
			});
		}, e => {
			// error handling
			// log to console and notify the user
			console.error('failed to save pit ', e);
			props.dispatch(sendNotification({
				variant: 'error',
				text: 'Failed to store data!'
			}));
		});
	};

	/**
	 * Select an event and set team if the current team isn't in the event
	 * @param {string} event the event code
	 */
	const selectEvent = (eventKey) => {
		// narrow down to events with this key (should be one and only one)
		const filteredEvents = events.filter(event => event.key === eventKey);
		// if we didn't find any events just quit
		if (filteredEvents.length < 1) return;

		// select the first match (again, should only be one)
		const event = filteredEvents[0];
		// if the event doesn't have any teams quit
		if (event.teams.length < 1) return;

		// if this event has the team we have selected, keep it, else pick the first team listed
		const team = event.teams.includes(selection.team) ? selection.team : event.teams[0];
		// set the selected event
		setSelectedEvent(event);
		// set our selection
		setSelection({ ...selection, event: eventKey, team: team });
	};
	/**
	 * Select a team if it's available
	 * @param {number} team the team number
	 */
	const selectTeam = (team) => {
		// if the current event has this team, set it, else default to the first team in the event
		const newTeam = selectedEvent.teams.includes(team) ? team : selectEvent.teams[0];
		if (!selectedEvent.teams.includes(team)) console.warn('current event doesn\'t have team ' + team + '\nDefaulting to team ' + newTeam);

		// set our selection
		setSelection({ ...selection, team: newTeam });
	};

	/**
	 * Get the currently occuring event from an array of events
	 * 
	 * Returns the most recent event if there isn't an active event, or the first if none have passed
	 * @param {[]} events array of events to get the current event from
	 */
	const getCurrentEvent = (givenEvents) => {
		// if there aren't any events quit
		if (givenEvents.length < 1) return;
		// get all started events
		const startedEvents = givenEvents.filter(event => event.startDate < Date.now()).sort((a, b) => a.startDate - b.startDate);
		// if there aren't any started events or we only have one event overall, return the first event
		if (startedEvents.length === 0 || givenEvents.length === 1) return givenEvents[0];
		// else return the most recent
		return startedEvents[startedEvents.length - 1];
	};

	if (!loaded) {
		if (process.env.NODE_ENV === 'production') {
			queryDB(readableTables.EVENTS).then(newEvents => {
				setFieldImg(localStorage.getItem('fieldImg'));
				setEvents(newEvents);
				// select the current event from our newly read events
				selectEvent(getCurrentEvent(newEvents).key);
				setLoaded(true);
			});
		} else {
			const dummyEvent = JSON.parse('{"matches":[],"teams":[435,1225,1533,2640,2655,2682,3196,3336,3506,3661,3737,3822,4290,4534,4541,4795,4935,6177,6214,6512,6729,7265,7270,7443,7463,7715,8030,8304,8315],"_id":"5e52e57649c9c556f7c1cde2","city":"Pembroke","country":"USA","district":{"abbreviation":"fnc","display_name":"FIRST North Carolina","key":"2020fnc","year":2020},"endDate":"2020-03-08T05:00:00.000Z","eventCode":"ncpem","key":"2020ncpem","name":"FNC District UNC Pembroke Event","startDate":"2020-03-06T05:00:00.000Z","year":2020,"updated":"2020-02-26T03:07:22.982Z","__v":0}');
			setEvents([dummyEvent]);
			setSelectedEvent(dummyEvent);
			setSelection({ ...selection, event: dummyEvent.key, team: dummyEvent.teams[0] });
			setLoaded(true);
		}
	}

	if (!loaded || Object.keys(template).length < 1) return <React.Fragment />;

	if (events.length < 1) return <NoEvents />;

	return (
		<div className={classes.root}>
			{true &&
				<DataContent
				template={template}
				events={events}

				processedTeam={processedTeam}
				runs={runs.sort((a, b) => a.match - b.match)}
				motionworks={motionworks}
				pit={pit}

				updatePit={updatePit}
				selectEvent={selectEvent}
				selectTeam={selectTeam}

				selection={selection}
				currentEvent={selectedEvent}

				fieldImg={fieldImg}
				/>
			}
		</div>
	);
};

export default connect(mapStateToProps)(DataContainer);