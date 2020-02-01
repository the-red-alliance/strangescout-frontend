export const SET_EVENTS = 'SET_EVENTS';
export const CLEAR_EVENTS = 'CLEAR_EVENTS';

export function setEvents(events) {
	return { type: SET_EVENTS, events: events };
};

export function clearEvents() {
	return { type: CLEAR_EVENTS };
};
