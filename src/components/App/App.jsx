/*
App component
*/

import React from 'react';

// store imports
import { Provider } from 'react-redux';
import store from '../../store/store.js';

import Shell from '../Shell';

export function App() {
	return (
		<Provider store={store}>
			<div className="app">
				<Shell />
			</div>
		</Provider>
	);
};
