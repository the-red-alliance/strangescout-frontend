import Dexie from 'dexie';
import { post, get } from './requests';
import dateParser from './dateParser';

/**
 * Dexie versions
 */
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
	{
		version: 3,
		stores: {
			runs: '&_id, event, team, match, updated',
			runQueue: '++localId, event, team, match',
			processedTeams: '&_id, event, team, matches, updated',
			teams: '&_id, event, team, updated',
			teamQueue: '++localId, event, team',
			events: '&_id, key, startDate, updated',
			matches: '&_id, match, event, updated',
			motionworks: '&_id, event, team, match, updated'
		},
	},
];

// Readable tables enum
export const readableTables = {
	RUNS: 'runs',
	PROCESSED_TEAMS: 'processedTeams',
	TEAMS: 'teams',
	EVENTS: 'events',
//	MOTIONWORKS: 'motionworks'
};
// Readable tables fetch URLs
export const readableBaseURLs = new Map([
	[ readableTables.RUNS, window.origin + '/api/runs' ],
	[ readableTables.PROCESSED_TEAMS, window.origin + '/api/processedTeams' ],
	[ readableTables.TEAMS, window.origin + '/api/teams' ],
	[ readableTables.EVENTS, window.origin + '/api/events' ],
	[ readableTables.MOTIONWORKS, window.origin + '/api/motionworks' ]
]);

// Queues enum
export const queueTables = {
	RUNS: 'runQueue',
	TEAMS: 'teamQueue'
};
// Queues push URLs
export const queueBaseURLs = new Map([
	[ queueTables.RUNS, window.origin + '/api/runs' ],
	[ queueTables.TEAMS, window.origin + '/api/teams' ]
]);

// enum for tables which can have docs deleted
export const deletableTables = {
	RUNS: 'runs',
	PROCESSED_TEAMS: 'processedTeams',
	TEAMS: 'teams'
};
// deletable tables IDs URLs
export const deletableBaseURLs = new Map([
	[ deletableTables.RUNS, window.origin + '/api/runs/ids' ],
	[ deletableTables.PROCESSED_TEAMS, window.origin + '/api/processedTeams/ids' ],
	[ deletableTables.TEAMS, window.origin + '/api/teams/ids' ]
]);

/**
 * Clear the stored database
 */
export function clearData() {
	const db = new Dexie('strangescout');
	db.delete();
};

/**
 * Resolve an array of documents from the selected table matching an optional query
 * @param {string} selectedTable A string identifier of the table to query
 * @param {{}} query A Dexie `where()` query object
 */
export const queryDB = (selectedTable, query) => new Promise((resolve, reject) => {
	// load databases
	const db = new Dexie('strangescout');
	versions.forEach(version => {
		db.version(version.version).stores(version.stores);
	});

	// switch through the selected table
	// compare against readableTables enum defined above
	switch (selectedTable) {
		case readableTables.RUNS:
		case readableTables.PROCESSED_TEAMS:
		case readableTables.TEAMS:
		case readableTables.MOTIONWORKS:
		case readableTables.EVENTS:
			// if we've selected a valid table
			// if a query IS defined
			if (query) {
				// Query validation
				// checks to make sure all keys in the query exist somewhere in the database definition
				// for each key specified in the query
				Object.keys(query).forEach(key => {
					// set the key available check to false by default
					// gets set to true if the query key exists somewhere in the database versions
					let keyAvailable = false;
					// for each version in the database
					versions.forEach((version, i) => {
						// replace whitespace in the key definition string for the selected table in the selected event,
						// then split that no-whitespace string at the commas to separate the keys,
						// then check if the query key is in the versions table definition
						// if the key is available, set the keyAvailable check to true
						if (version.stores[selectedTable] && version.stores[selectedTable].replace(/\s/g, "").split(',').includes(key)) keyAvailable = true;
						// if we're on the last version, then if the key hasn't been found in any database version
						if (i === versions.length - 1 && !keyAvailable) {
							// log an error and reject the promise
							console.error('Invalid query: ', query, '\nOn table: ' + selectedTable);
							reject('invalid query');
							return;
						}
					});
				});
				
				// find docs matching the given query in the selected table
				db[selectedTable].where(query).toArray().then(docs => {
					// resolve the docs
					resolve(docs);
				}, e => {
					// error and reject on a query error
					console.error('error reading from: ' + selectedTable + '\nQuery: ', query, e);
					reject(e);
				});
			} else {
				// else if there's no query, find all docs in the selected table
				db[selectedTable].toArray().then(docs => {
					// resolve the docs
					resolve(docs);
				}, e => {
					// error and reject
					console.error('error reading from: ' + selectedTable, e);
					reject(e);
				});
			}
			break;
		default:
			// default to fail if we haven't selected an available table
			console.error(selectedTable, 'is not a valid readable table!\nValid tables: ', readableTables);
			reject('not a valid table');
	}

	return;
});

/**
 * Resolve the updated date of the most recently updated doc in a table
 * @param {string} selectedTable A string identifier of the table to query
 */
export const mostRecent = (selectedTable) => new Promise((resolve, reject) => {
	// load databases
	const db = new Dexie('strangescout');
	versions.forEach(version => {
		db.version(version.version).stores(version.stores);
	});

	// switch through the selected table
	// compare against readableTables enum defined above
	switch (selectedTable) {
		case readableTables.RUNS:
		case readableTables.PROCESSED_TEAMS:
		case readableTables.TEAMS:
		case readableTables.MOTIONWORKS:
		case readableTables.EVENTS:
			// if we've selected a table that supports the updated field
			// (currently all readable tables)
			
			// order the table by the updated key, then select the last doc
			db[selectedTable].orderBy('updated').last().then(object => {
				// if a doc was found
				if (object) {
					// log and resolve a date
					console.log('last updated in ' + selectedTable + ': ', object.updated);
					resolve(object.updated);
				} else {
					// else succeed but don't return a date
					console.log('could not find last updated');
					resolve();
				}
			}, (e) => {
				// on a database error, log and reject
				console.error('error finding last modified in ' + selectedTable, e);
				reject();
			});
			break;
		default:
			// default to fail if we haven't selected an available table
			console.error(selectedTable, 'is not a valid readable table!\nValid tables: ', readableTables);
			reject('not a valid table');
	}

	return;
});

/**
 * Add a doc to a queue
 * @param {string} selectedQueue A string identifier of the queue to push to
 * @param {{}} doc The document to push to the queue
 */
export const addToQueue = (selectedQueue, doc) => new Promise((resolve, reject) => {
	// load database versions
	const db = new Dexie('strangescout');
	versions.forEach(version => {
		db.version(version.version).stores(version.stores);
	});

	// switch through the selected queue table
	// compare against queueTables enum defined above
	switch (selectedQueue) {
		case queueTables.RUNS:
		case queueTables.TEAMS:
			// if a valid queue
			// put the document into the queue table
			db[selectedQueue].put(doc).then(() => {
				// then resolve
				resolve();
			}, (e) => {
				// fail on a write error
				console.error('failed to store doc to queue\nQueue: ' + selectedQueue, 'Doc: ', doc, e);
				reject('failed to store doc');
			});
			break;
		default:
			// fail if not a valid queue
			console.error(selectedQueue, 'is not a valid queue table!\nValid queues: ', queueTables);
			reject('not a valid queue');
	}

	return;
});

/**
 * Push a specified queue to the server
 * 
 * (POSTs each doc to an endpoint associated with the queue)
 * @param {string} selectedQueue A string identifier of the queue to push
 * @param {string} token The user's JWT token
 */
export const pushQueue = (selectedQueue, token) => new Promise((resolve, reject) => {
	// load database versions
	const db = new Dexie('strangescout');
	versions.forEach(version => {
		db.version(version.version).stores(version.stores);
	});
	
	// switch through the selected queue table
	// compare against queueTables enum defined above
	switch (selectedQueue) {
		case queueTables.RUNS:
		case queueTables.TEAMS:
			db[selectedQueue].toArray().then(docs => {
				if (docs.length === 0) resolve();
				let count = 0;
				docs.forEach(doc => {
					post(
						queueBaseURLs.get(selectedQueue),
						JSON.stringify(doc),
						token,
						[{name: 'Content-type', value: 'application/json'}]
					).then(result => {
						if (199 < result.status < 300) {
							db[selectedQueue].delete(doc.localId).then(() => {
								count = count + 1;
								if (count === docs.length) {
									resolve();
								};
							}, e => {
								console.error('failed to delete queue doc', e);
								reject('failed to delete queue doc');
							});
						} else {
							console.error('failed to POST queue doc', result);
							reject('failed to push queue');
						}
					}, e => {
						console.error('failed to POST queue doc', e);
						reject('failed to push queue');
					});
				});
			}, e => {
				console.error('failed to read queue ' + selectedQueue, e);
				reject('failed to read queue ' + selectedQueue);
			});
			break;
		default:
			// fail if not a valid queue
			console.error(selectedQueue, 'is not a valid queue table!\nValid queues: ', queueTables);
			reject('not a valid queue');
	}

	return;
});

/**
 * Check the API for new documents for a table
 * @param {string} selectedTable A string identifier of the table to check for new documents
 * @param {string} token The user's JWT token
 */
export const fetchUpdates = (selectedTable, token) => new Promise((resolve, reject) => {
	// load database versions
	const db = new Dexie('strangescout');
	versions.forEach(version => {
		db.version(version.version).stores(version.stores);
	});

	// switch through the selected table
	// compare against readableTables enum defined above
	switch (selectedTable) {
		case readableTables.RUNS:
		case readableTables.PROCESSED_TEAMS:
		case readableTables.TEAMS:
		case readableTables.MOTIONWORKS:
		case readableTables.EVENTS:
			mostRecent(selectedTable).then(updatedDate => {
				let url = readableBaseURLs.get(selectedTable);
				if (updatedDate) url = url + '?updated=' + JSON.stringify(updatedDate);

				get(
					url,
					token,
					[{name: 'Content-type', value: 'application/json'}]
				).then(result => {
					if (result.status === 200) {
						let docs;
						try {
							docs = JSON.parse(result.response, dateParser);
	
							try {
								db[selectedTable].bulkPut(docs);
								resolve();
							} catch (e) {
								console.error('failed to save docs to ' + selectedTable, e);
								reject('failed to save');
							}
						} catch (e) {
							console.error('failed to parse docs for ' + selectedTable, e);
							reject('failed to parse');
						}
					} else {
						console.error('failed to GET from server', result);
						reject('failed to fetch');
					}
				});
			}, e => {
				console.error('Error finding most recent doc in table ' + selectedTable, e);
				reject(e);
			});
			break;
		default:
			// default to fail if we haven't selected an available table
			console.error(selectedTable, ' is not a valid fetchable table!\nValid tables: ', readableTables);
			reject('not a valid table');
	}

	return;
});

/**
 * Check the API for the IDs of all existing documents and remove any local docs not available remotely
 * @param {string} selectedTable A string identifier of the table to check for deleted documents
 * @param {string} token The user's JWT token
 */
export const fetchDeletes = (selectedTable, token) => new Promise((resolve, reject) => {
	// load database versions
	const db = new Dexie('strangescout');
	versions.forEach(version => {
		db.version(version.version).stores(version.stores);
	});

	// switch through the selected table
	// compare against deletableTables enum defined above
	switch (selectedTable) {
		case deletableTables.RUNS:
		case deletableTables.TEAMS:
		case deletableTables.PROCESSED_TEAMS:
			get(
				deletableBaseURLs.get(selectedTable),
				token,
				[{name: 'Content-type', value: 'application/json'}]
			).then(result => {
				if (result.status === 200) {
					let idList;
					try {
						// parse in list of remaining IDs
						idList = JSON.parse(result.response);
						// get current primary keys
						db[selectedTable].toCollection().primaryKeys().then(keys => {
							// do we have any keys locally that aren't in the master db?
							let deletedKeys = keys.filter(n => !idList.includes(n));
							// delete if so
							try {
								db[selectedTable].bulkDelete(deletedKeys);
								resolve();
							} catch (e) {
								console.error('failed to delete docs for ' + selectedTable, e);
								reject('failed to delete docs for ' + selectedTable);
							}
						}, e2 => {
							console.error('failed to get keys for ' + selectedTable, e2);
							reject('failed to get keys for ' + selectedTable);
						});
					} catch (e) {
						console.error('failed to parse ids for ' + selectedTable, e);
						reject('failed to parse ids for ' + selectedTable);
					}
				} else {
					reject('failed to fetch deleted ids for ' + selectedTable);
				}
			});
			break;
		default:
			// fail if not a deletable table
			console.error(selectedTable, 'is not a valid deletable table!\nValid tables: ', deletableTables);
			reject('not a valid table');
	}

	return;
});

/**
 * Push all queues, fetch all readables, update all deletes
 * @param {string} token The user's JWT token
 */
export const sync = (token) => new Promise((resolve, reject) => {
	let failed = null;
	let queueCounter = 0;
	let readableCounter = 0;
	let deletableCounter = 0;

	// for each queue
	Object.keys(queueTables).forEach(queueKey => {
		const queue = queueTables[queueKey];
		// push the queue
		pushQueue(queue, token).then(() => {
			// on success
			// increment the queue counter
			queueCounter = queueCounter + 1;
			// if this was the last queue and we haven't failed yet
			if (queueCounter === Object.keys(queueTables).length) {
				if (failed) {
					// error and fail
					console.error('Failed while syncing queues: ', failed);
					reject(failed);
				} else {
					// for each readable table
					Object.keys(readableTables).forEach(readableKey => {
						const readable = readableTables[readableKey];
						fetchUpdates(readable, token).then(() => {
							// on success
							// increment the readable counter
							readableCounter = readableCounter + 1;
							// if this was the last readable and we haven't failed yet
							if (readableCounter === Object.keys(readableTables).length) {
								if (failed) {
									// error and fail
									console.error('Failed while syncing readables: ', failed);
									reject(failed);
								} else {
									Object.keys(deletableTables).forEach(deletableKey => {
										const deletable = deletableTables[deletableKey];
										fetchDeletes(deletable, token).then(() => {
											// on success
											// increment the deletable counter
											deletableCounter = deletableCounter + 1;
											if (deletableCounter === Object.keys(deletableTables).length) {
												if (failed) {
													// error and fail
													console.error('Failed while syncing deletables: ', failed);
													reject(failed);
												} else {
													resolve();
												}
											}
										}, e => {
											// on failure
											// increment the deletable counter
											deletableCounter = deletableCounter + 1;
											// set failed
											failed = e;
											// if this was the last deletable
											if (deletableCounter === Object.keys(deletableTables).length) {
												// error and fail
												console.error('Failed while syncing deletables: ', e);
												reject(e);
											}
										});
									});
								}
							}
						}, e => {
							// on failure
							// increment the readable counter
							readableCounter = readableCounter + 1;
							// set failed
							failed = e;
							// if this was the last readable
							if (readableCounter === Object.keys(readableTables).length) {
								// error and fail
								console.error('Failed while syncing readables: ', e);
								reject(e);
							}
						});
					});
				}
			}
		}, e => {
			// on failure
			// increment the queue counter
			queueCounter = queueCounter + 1;
			// set failed
			failed = e;
			// if this was the last queue
			if (queueCounter === Object.keys(queueTables).length) {
				// error and fail
				console.error('Failed while syncing queues: ', e);
				reject(e);
			}
		});
	});
});