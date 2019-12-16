import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';

import { sendNotification } from '../../../store/notifications/actions';
import { storeLocalRun, syncRuns } from '../../../utils/database';

import { Run } from './Run-content.jsx';
import { SetupDialog } from './Run-SetupDialog.jsx';
import { FinalizeDialog } from './Run-FinalizeDialog.jsx';

function mapStateToProps(state) {
	return {
		user: state.user,
		notification: state.notification,
		template: state.template,
	};
};

export function RunContainer(props) {
	const [ matchStatus, setMatchStatus ] = useState({
		started: false,
		completed: false,
		loadoutShown: false
	});

	const [ dialogs, setDialogs ] = useState({
		setupDialog: true,
		finalizeDialog: false,
	});

	const [ runState, setRunState ] = useState({
		team: '',
		match: '',
		position: '',
		journal: [],
		notes: '',
	});

	// history api for routing
	const history = useHistory();

	// ensure we actually have a template to use, else go blank
	if (Object.entries(props.template).length === 0) return (<React.Fragment />);

	// redirect to the login page if the user isn't logged in
	if (process.env.NODE_ENV === 'production' && !props.user.loggedin) return <Redirect to={"/login"} />;

	const startMatch = () => {
		setDialogs({ ...dialogs, setupDialog: false });
		setMatchStatus({ ...matchStatus, started: true });
	};

	const endMatch = () => {
		setDialogs({ ...dialogs, finalizeDialog: true });
		setMatchStatus({ ...matchStatus, completed: true });
	};

	const onSubmit = () => {
		storeLocalRun(runState).then(() => {
			history.push('/');

			syncRuns(props.user.session.token).then(() => {
				props.dispatch(sendNotification({
					variant: 'success',
					text: 'Successfully synced data!'
				}));
			}, (e) => {
				console.error('failed to sync runs ', e);
				props.dispatch(sendNotification({
					variant: 'error',
					text: 'Failed to sync data!'
				}));
			});
		}, (e) => {
			console.error('failed to save run ', e);
			props.dispatch(sendNotification({
				variant: 'error',
				text: 'Failed to store data!'
			}));
		});
	};

	return (
		<React.Fragment>
			<Run
			template={props.template}
			totalTime={150}
			matchStatus={matchStatus}
			setMatchStatus={setMatchStatus}
			runState={runState}
			setRunState={setRunState}
			afterMatch={endMatch}
			/>
			<SetupDialog
			open={dialogs.setupDialog}
			template={props.template}
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