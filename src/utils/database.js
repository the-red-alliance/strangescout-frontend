import Dexie from 'dexie';
import { post, get } from './requests';
import dateParser from './dateParser';

const versions = [
	{
		version: 1,
		stores: {
			runs: '&_id, team, match, updated',
			localRuns: '++localId, team, match',
		},
	},
];

export function clearRuns() {
	const db = new Dexie('strangescout');
	db.delete();
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

		db.localRuns.put(run).then(() => {
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

		db.localRuns.toArray().then(runs => {
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
						db.localRuns.delete(run.localId).then(() => {
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

export function syncRuns(token) {
	return new Promise((resolve, reject) => {
		pushLocalRuns(token).then(() => {
			fetchNewRuns(token).then(() => {
				fetchRemovedRuns(token).then(() => {
					resolve();
				}, error => {
					reject(error);
				});
			}, error => {
				reject(error);
			});
		}, error => {
			reject(error);
		});
	});
};