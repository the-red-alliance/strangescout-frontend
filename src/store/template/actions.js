import { get } from '../../utils/requests';
import { sendNotification } from '../notifications/actions';

export const SET_TEMPLATE = 'SET_TEMPLATE';
export const UNSET_TEMPLATE = 'UNSET_TEMPLATE';

export function setTemplate(template) {
	return { type: SET_TEMPLATE, template: template };
};

export function unsetTemplate() {
	return { type: UNSET_TEMPLATE };
};

export function loadTemplate(token) {
	const onFail = (dispatch) => {
		console.warn('falling back to stored template');
		// clear for cleanup
		dispatch(unsetTemplate());
		// try loading template from storage
		let templateString = localStorage.getItem('template');
		if (templateString) {
			let template;
			try {
				// attempt parsing and setting the template
				template = JSON.parse(templateString);
				dispatch(setTemplate(template));
			} catch (e) {
				console.error('error setting stored template', e);
				dispatch(unsetTemplate());
				dispatch(sendNotification({
					variant: 'error',
					text: 'Error loading data template!'
				}));
			}
		} else {
			console.error('no stored template found');
			// if not found fail
			dispatch(unsetTemplate());
			dispatch(sendNotification({
				variant: 'error',
				text: 'Error loading data template!'
			}));
		}
	};

	return (dispatch) => {
		dispatch(unsetTemplate());
		get(
			window.origin + '/api/template',
			token,
			[{name: 'Content-type', value: 'application/json'}]
		).then(result => {
			if (result.status === 200) {
				try {
					let template = JSON.parse(result.response);
					let templateString = JSON.stringify(template)
					localStorage.setItem('template', templateString);
					dispatch(setTemplate(template));
				} catch (e) {
					console.error('error parsing template received from server', e);
					onFail(dispatch);
				}
			} else {
				console.error('error requesting template from server', result);
				onFail(dispatch);
			}
		}, e => {
			console.error('error sending template get request to server', e);
			onFail(dispatch);
		});
	};
};

export function deleteTemplate() {
	return (dispatch) => {
		dispatch(unsetTemplate());
		localStorage.removeItem('template');
	};
};