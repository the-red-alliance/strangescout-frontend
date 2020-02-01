// redux store (global application state)

import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from "redux-thunk";

import userReducer from './user/reducer';
import notificationReducer from './notifications/reducer';
import templateReducer from './template/reducer';
import eventsReducer from './events/reducer';

// combine reducers to one root reducer
const rootReducer = combineReducers({
	user: userReducer,
	notification: notificationReducer,
	template: templateReducer,
	events: eventsReducer,
});

// use enable redux dev tools if available
const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

// define middlewares
const middleware = [thunk]

// create store with middleware
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middleware)));

export default store;
