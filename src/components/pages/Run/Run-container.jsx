import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';

import { sendNotification } from '../../../store/notifications/actions';
import { storeLocalRun, syncData } from '../../../utils/database';

import { Run } from './Run-content.jsx';
import { SetupDialog } from './Run-SetupDialog.jsx';
import { FinalizeDialog } from './Run-FinalizeDialog.jsx';

// we need the user and game template from the store
function mapStateToProps(state) {
	return {
		user: state.user,
		template: state.template,
		events: state.events,
	};
};

export function RunContainer(props) {
	const { template, user, events } = props;
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
		storeLocalRun(runState).then(() => {
			// on success redirect to /
			history.push('/');

			// async sync data with the server
			syncData(user.session.token).then(() => {
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

	return (
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
};

export default connect(mapStateToProps)(RunContainer);