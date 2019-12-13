export const CREATE_NOTIFICATION = 'CREATE_NOTIFICATION';
export const CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION';
export const DELETE_NOTIFICATION = 'DELETE_NOTIFICATION';

let timeout;

export function sendNotification(notification) {
	// reset any lingering timeouts from a notification clear
	clearTimeout(timeout);
	return { type: CREATE_NOTIFICATION, notification: notification };
};

export function closeNotification() {
	return { type: CLOSE_NOTIFICATION };
};

export function deleteNotification() {
	return { type: DELETE_NOTIFICATION };
};

export function clearNotification() {
	return (dispatch) => {
		// clear timeout,
		// set notification to closed,
		// then delete it fully after a delay
		clearTimeout(timeout);
		dispatch(closeNotification());
		timeout = setTimeout(() => dispatch(deleteNotification()), 1000);
	};
};