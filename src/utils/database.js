import Dexie from 'dexie';
import { post, get, put } from './requests';
import dateParser from './dateParser';

const versions = [
	{
		version: 1,
		stores: {
			runs: '&_id, team, match, updated',
			runQueue: '++localId, team, match',
			processedTeams: '&_id, team, matches, updated',
		},
	},
	{
		version: 2,
		stores: {
			runs: '&_id, team, match, updated',
			runQueue: '++localId, team, match',
			processedTeams: '&_id, team, matches, updated',
			teams: '&_id, team, updated',
			teamQueue: '++localId, team',
			events: '&_id, key, startDate'
		},
	},
];

export function clearData() {
	const db = new Dexie('strangescout');
	db.delete();
};

export function readEvents() {
	return new Promise((resolve, reject) => {
		const db = new Dexie('strangescout');
		versions.forEach(version => {
			db.version(version.version).stores(version.stores);
		});

		db.events.toArray().then(docs => {
			resolve(docs);
		}, e => {
			console.error('error reading events from local db: ', e);
			reject(e);
		});
	});
};

export function mostRecentRun() {
	return new Promise((resolve, reject) => {
		const db = new Dexie('strangescout');
		versions.forEach(version => {
			db.version(version.version).stores(version.stores);
		});

		db.runs.orderBy('updated').last().then(object => {
			if (object) {
				console.log('last updated: ', object.updated);
				resolve(object.updated);
			} else {
				console.log('could not find last updated');
				resolve();
			}
		}, (e) => {
			console.error('error finding last modified', e);
			reject();
		});
	});
};

export function fetchNewRuns(token) {
	return new Promise((resolve, reject) => {
		const db = new Dexie('strangescout');
		versions.forEach(version => {
			db.version(version.version).stores(version.stores);
		});

		mostRecentRun().then((lastUpdated) => {
			const url = lastUpdated ? window.origin + '/api/runs?updated=' + JSON.stringify(lastUpdated) : '/api/runs';
			get(
				url,
				token,
				[{name: 'Content-type', value: 'application/json'}]
			).then((result) => {
				if (result.status === 200) {
					let docs;
					try {
						docs = JSON.parse(result.response, dateParser);

						try {
							db.runs.bulkPut(docs);
							resolve();
						} catch (e) {
							console.error('failed to save docs', e);
							reject('failed to save');
						}
					} catch (e) {
						console.error('failed to parse docs', e);
						reject('failed to parse');
					}
				} else {
					console.error('failed to get runs from server', result);
					reject('failed to fetch');
				}
			});
		}, () => {
			console.error('error finding last modified');
			reject('couldn\'t find last modified');
		});
	});
};

export function fetchRemovedRuns(token) {
	return new Promise((resolve, reject) => {
		const db = new Dexie('strangescout');
		versions.forEach(version => {
			db.version(version.version).stores(version.stores);
		});

		get(
			'/api/runs/ids',
			token,
			[{name: 'Content-type', value: 'application/json'}]
		).then((result) => {
			if (result.status === 200) {
				let idList;
				try {
					// parse in list of remaining IDs
					idList = JSON.parse(result.response);

					// get current primary keys
					// (returns primary keys of all docs where team > 0, aka. all docs)
					// in theory going table -> collection -> keys will be faster than going table -> array -> keys
					db.runs.where('team').above(0).primaryKeys().then(keys => {
				//	db.runs.toArray().then(runs => {
					//	let keys = runs.map(item => item._id);
						// do we have any keys locally that aren't in the master db?
						let deletedkeys = keys.filter(n => !idList.includes(n));

						// delete if so
						try {
							db.runs.bulkDelete(deletedkeys);
							resolve();
						} catch (e) {
							console.error('failed to delete docs', e);
							reject('failed to delete');
						}
					}, (e2) => {
						console.error('failed to get keys', e2);
						reject('failed to get keys');
					});
				} catch (e) {
					console.error('failed to parse ids', e);
					reject('failed to parse ids');
				}
			} else {
				reject('failed to fetch deleted ids');
			}
		});
	});
};

export function storeLocalRun(run) {
	return new Promise((resolve, reject) => {
		const db = new Dexie('strangescout');
		versions.forEach(version => {
			db.version(version.version).stores(version.stores);
		});

		db.runQueue.put(run).then(() => {
			resolve();
		}, (e) => {
			console.error('failed to store local run', e);
			reject('failed to store run');
		});
	});
};

export function pushLocalRuns(token) {
	return new Promise((resolve, reject) => {
		const db = new Dexie('strangescout');
		versions.forEach(version => {
			db.version(version.version).stores(version.stores);
		});

		db.runQueue.toArray().then(runs => {
			if (runs.length === 0) resolve();
			let count = 0;
			runs.forEach(run => {
				post(
					window.origin + '/api/runs',
					JSON.stringify(run),
					token,
					[{name: 'Content-type', value: 'application/json'}]
				).then(result => {
					if (result.status === 202) {
						db.runQueue.delete(run.localId).then(() => {
							count = count + 1;
							if (count === runs.length) {
								resolve();
							};
						}, e => {
							console.error('failed to delete local run', e);
							reject('failed to delete local run');
						});
					} else {
						console.error('failed to POST local run', result);
						reject('failed to push runs');
					}
				}, e => {
					console.error('failed to POST local run', e);
					reject('failed to push runs');
				});
			});
		}, (e) => {
			console.error('failed to read local runs', e);
			reject('failed to read runs');
		});
	});
};

export function mostRecentProcessedTeam() {
	return new Promise((resolve, reject) => {
		const db = new Dexie('strangescout');
		versions.forEach(version => {
			db.version(version.version).stores(version.stores);
		});

		db.processedTeams.orderBy('updated').last().then(object => {
			if (object) {
				console.log('last updated: ', object.updated);
				resolve(object.updated);
			} else {
				console.log('could not find last updated processed team');
				resolve();
			}
		}, (e) => {
			console.error('error finding last modified processed team', e);
			reject();
		});
	});
};

export function fetchNewProcessedTeams(token) {
	return new Promise((resolve, reject) => {
		const db = new Dexie('strangescout');
		versions.forEach(version => {
			db.version(version.version).stores(version.stores);
		});

		mostRecentProcessedTeam().then((lastUpdated) => {
			const url = lastUpdated ? window.origin + '/api/processedTeams?updated=' + JSON.stringify(lastUpdated) : '/api/processedTeams';
			get(
				url,
				token,
				[{name: 'Content-type', value: 'application/json'}]
			).then((result) => {
				if (result.status === 200) {
					let docs;
					try {
						docs = JSON.parse(result.response, dateParser);

						try {
							db.processedTeams.bulkPut(docs);
							resolve();
						} catch (e) {
							console.error('failed to save processed docs', e);
							reject('failed to save processed');
						}
					} catch (e) {
						console.error('failed to parse processed docs', e);
						reject('failed to parse processed');
					}
				} else {
					console.error('failed to get processed teams from server', result);
					reject('failed to fetch');
				}
			});
		}, () => {
			console.error('error finding last modified processed');
			reject('couldn\'t find last modified processed');
		});
	});
};

export function fetchRemovedProcessedTeams(token) {
	return new Promise((resolve, reject) => {
		const db = new Dexie('strangescout');
		versions.forEach(version => {
			db.version(version.version).stores(version.stores);
		});

		get(
			'/api/processedTeams/ids',
			token,
			[{name: 'Content-type', value: 'application/json'}]
		).then((result) => {
			if (result.status === 200) {
				let idList;
				try {
					// parse in list of remaining IDs
					idList = JSON.parse(result.response);

					// get current primary keys
					// (returns primary keys of all docs where team > 0, aka. all docs)
					// in theory going table -> collection -> keys will be faster than going table -> array -> keys
					db.processedTeams.where('team').above(0).primaryKeys().then(keys => {
				//	db.runs.toArray().then(runs => {
					//	let keys = runs.map(item => item._id);
						// do we have any keys locally that aren't in the master db?
						let deletedkeys = keys.filter(n => !idList.includes(n));

						// delete if so
						try {
							db.processedTeams.bulkDelete(deletedkeys);
							resolve();
						} catch (e) {
							console.error('failed to delete processed docs', e);
							reject('failed to delete processed');
						}
					}, (e2) => {
						console.error('failed to get processed keys', e2);
						reject('failed to get keys processed');
					});
				} catch (e) {
					console.error('failed to parse processed ids', e);
					reject('failed to parse ids processed');
				}
			} else {
				reject('failed to fetch deleted ids processed');
			}
		});
	});
};

export function mostRecentTeam() {
	return new Promise((resolve, reject) => {
		const db = new Dexie('strangescout');
		versions.forEach(version => {
			db.version(version.version).stores(version.stores);
		});

		db.teams.orderBy('updated').last().then(object => {
			if (object) {
				console.log('last updated: ', object.updated);
				resolve(object.updated);
			} else {
				console.log('could not find last updated');
				resolve();
			}
		}, (e) => {
			console.error('error finding last modified', e);
			reject();
		});
	});
};

export function fetchNewTeams(token) {
	return new Promise((resolve, reject) => {
		const db = new Dexie('strangescout');
		versions.forEach(version => {
			db.version(version.version).stores(version.stores);
		});

		mostRecentTeam().then((lastUpdated) => {
			const url = lastUpdated ? window.origin + '/api/teams?updated=' + JSON.stringify(lastUpdated) : '/api/teams';
			get(
				url,
				token,
				[{name: 'Content-type', value: 'application/json'}]
			).then((result) => {
				if (result.status === 200) {
					let docs;
					try {
						docs = JSON.parse(result.response, dateParser);

						try {
							db.teams.bulkPut(docs);
							resolve();
						} catch (e) {
							console.error('failed to save docs', e);
							reject('failed to save');
						}
					} catch (e) {
						console.error('failed to parse docs', e);
						reject('failed to parse');
					}
				} else {
					console.error('failed to get teams from server', result);
					reject('failed to fetch');
				}
			});
		}, () => {
			console.error('error finding last modified');
			reject('couldn\'t find last modified');
		});
	});
};

export function storeLocalTeam(team) {
	return new Promise((resolve, reject) => {
		const db = new Dexie('strangescout');
		versions.forEach(version => {
			db.version(version.version).stores(version.stores);
		});

		db.teamQueue.put(team).then(() => {
			resolve();
		}, (e) => {
			console.error('failed to store local team', e);
			reject('failed to store team');
		});
	});
};

export function pushLocalTeams(token) {
	return new Promise((resolve, reject) => {
		const db = new Dexie('strangescout');
		versions.forEach(version => {
			db.version(version.version).stores(version.stores);
		});

		db.teamQueue.toArray().then(teams => {
			if (teams.length === 0) resolve();
			let count = 0;
			teams.forEach(team => {
				put(
					window.origin + '/api/teams/' + team.team,
					JSON.stringify(team),
					token,
					[{name: 'Content-type', value: 'application/json'}]
				).then(result => {
					if (result.status === 200) {
						db.teamQueue.delete(team.localId).then(() => {
							count = count + 1;
							if (count === teams.length) {
								resolve();
							};
						}, e => {
							console.error('failed to delete local team', e);
							reject('failed to delete local team');
						});
					} else {
						console.error('failed to POST local team', result);
						reject('failed to push teams');
					}
				}, e => {
					console.error('failed to POST local team', e);
					reject('failed to push teams');
				});
			});
		}, (e) => {
			console.error('failed to read local teams', e);
			reject('failed to read teams');
		});
	});
};

export function fetchEvents(token) {
	return new Promise((resolve, reject) => {
		const db = new Dexie('strangescout');
		versions.forEach(version => {
			db.version(version.version).stores(version.stores);
		});

		const url = window.origin + '/api/events';
		get(
			url,
			token,
			[{name: 'Content-type', value: 'application/json'}]
		).then((result) => {
			if (result.status === 200) {
				let docs;
				try {
					docs = JSON.parse(result.response, dateParser);

					try {
						db.events.bulkPut(docs);
						resolve();
					} catch (e) {
						console.error('failed to save docs', e);
						reject('failed to save');
					}
				} catch (e) {
					console.error('failed to parse docs', e);
					reject('failed to parse');
				}
			} else {
				console.error('failed to get events from server', result);
				reject('failed to fetch');
			}
		});
	});
};

export function syncData(token) {
	return new Promise((resolve, reject) => {
		pushLocalRuns(token).then(() => {
			fetchNewRuns(token).then(() => {
				fetchRemovedRuns(token).then(() => {

					fetchNewProcessedTeams(token).then(() => {
						fetchRemovedProcessedTeams(token).then(() => {

							pushLocalTeams(token).then(() => {
								fetchNewTeams(token).then(() => {

									fetchEvents(token).then(() => {
										resolve();
									}, fetchEventsError => {
										reject(fetchEventsError);
									});

								}, fetchTeamsError => {
									reject(fetchTeamsError);
								});
							}, pushTeamsError => {
								reject(pushTeamsError);
							});

						}, fetchRemovedProcessedError => {
							reject(fetchRemovedProcessedError);
						});
					}, fetchProcessedError => {
						reject(fetchProcessedError);
					});

				}, fetchRemovedError => {
					reject(fetchRemovedError);
				});
			}, fetchError => {
				reject(fetchError);
			});
		}, pushError => {
			reject(pushError);
		});
	});
};