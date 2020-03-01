import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';

import { sendNotification } from '../../../store/notifications/actions';
import { sync, queryDB, readableTables, addToQueue, queueTables } from '../../../utils/storage';

import { Run } from './Run-content.jsx';
import { SetupDialog } from './Run-SetupDialog.jsx';
import { FinalizeDialog } from './Run-FinalizeDialog.jsx';

import NoEvents from '../../NoEvents.jsx';

// we need the user and game template from the store
function mapStateToProps(state) {
	return {
		user: state.user,
		template: state.template,
	};
};

export function RunContainer(props) {
	const { template, user } = props;

	const [ loaded, setLoaded ] = useState(false);
	const [ events, setEvents ] = useState([]);
	// state for mtch status
	// has the match started yet
	// is the match completed
	// has the loadout been shown if needed
	const [ matchStatus, setMatchStatus ] = useState({
		started: false,
		completed: false,
		loadoutShown: false
	});

	// dialogs open states
	// setup dialog starts open
	// endgame dialog starts closed
	const [ dialogs, setDialogs ] = useState({
		setupDialog: true,
		finalizeDialog: false,
	});

	// current state of the run
	// team number, match number, run journal, endgame fields, notes
	const [ runState, setRunState ] = useState({
		event: '',
		team: '',
		match: '',
		journal: [],
		endgameFields: {},
		notes: '',
	});

	// history api for routing
	const history = useHistory();

	// ensure we actually have a template to use, else go blank
	if (Object.entries(template).length === 0) return (<React.Fragment />);

	// redirect to the login page if the user isn't logged in
	if (process.env.NODE_ENV === 'production' && !user.loggedin) return <Redirect to={"/login"} />;

	if (!loaded) {
		if (process.env.NODE_ENV === 'production') {
			queryDB(readableTables.EVENTS).then(newEvents => {
				setEvents(newEvents);
				setLoaded(true);
			}, e => {
				console.error('Error reading events: ', e);
				setLoaded(true);
			});
		} else {
			setEvents([JSON.parse('{"matches":[],"teams":[435,2059,2642,3229,3459,4291,4561,4816,4828,5160,5190,5511,5518,5607,5762,5919,6004,6240,6496,6500,6502,6565,6908,7265,7463,7671,7763,7890,8090],"_id":"5e5a7a499e3a2100074cdbfa","city":"Holly Springs","country":"USA","district":{"abbreviation":"fnc","display_name":"FIRST North Carolina","key":"2020fnc","year":2020},"endDate":"2020-03-01T05:00:00.000Z","eventCode":"ncwak","key":"2020ncwak","name":"FNC District Wake County Event","startDate":"2020-02-28T05:00:00.000Z","year":2020,"updated":"2020-02-29T20:42:44.255Z","__v":0}')]);
			setLoaded(true);
		}
	}

	// start the match
	const startMatch = () => {
		// close the setup dialog
		setDialogs({ ...dialogs, setupDialog: false });
		// set match status to started
		setMatchStatus({ ...matchStatus, started: true });
	};

	// end the match
	const endMatch = () => {
		// set the finalize dialog to open
		setDialogs({ ...dialogs, finalizeDialog: true });
		// set the match status to completed
		setMatchStatus({ ...matchStatus, completed: true });
	};

	// submit the match
	const onSubmit = () => {
		// async store to the run queue
		addToQueue(queueTables.RUNS, runState).then(() => {
			// on success redirect to /
			history.push('/');

			// async sync data with the server
			sync(user.session.token).then(() => {
				// notification on success
				props.dispatch(sendNotification({
					variant: 'success',
					text: 'Successfully synced data!'
				}));
			}, (e) => {
				// error handling
				// log to console and notify the user
				console.error('failed to sync runs ', e);
				props.dispatch(sendNotification({
					variant: 'error',
					text: 'Failed to sync data!'
				}));
			});
		}, (e) => {
			// error handling
			// log to console and notify the user
			console.error('failed to save run ', e);
			props.dispatch(sendNotification({
				variant: 'error',
				text: 'Failed to store data!'
			}));
		});
	};

	if (loaded && events.length < 1) return <NoEvents />;

	if (loaded) return (
		<React.Fragment>
			{/*
				The actual content requires the template, a total match time,
				our matchStatus state and it's setter,
				our run state and it's setter,
				and the post match function
			*/}
			<Run
			template={template}
			totalTime={150}
			matchStatus={matchStatus}
			runState={runState}
			setRunState={setRunState}
			afterMatch={endMatch}
			/>
			<SetupDialog
			events={events}
			open={dialogs.setupDialog}
			template={template}
			startMatchAction={startMatch}
			runState={runState}
			setRunState={setRunState}
			/>
			<FinalizeDialog
			open={dialogs.finalizeDialog}
			runState={runState}
			setRunState={setRunState}
			onSubmit={onSubmit}
			/>
		</React.Fragment>
	);

	return <React.Fragment />;
};

export default connect(mapStateToProps)(RunContainer);