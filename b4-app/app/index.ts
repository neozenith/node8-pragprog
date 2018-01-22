import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import * as templates from './templates.ts';

document.body.innerHTML = templates.main();

const mainElement = document.body.querySelector('.b4-main');
const alertsElement = document.body.querySelector('.b4-alerts');


/**
 *  Use Window Location hash to show the specified view
 */

const showView = async () => {
	const [view, ...params] = window.location.hash.split('/');

	switch (view) {
		case '#welcome':
			mainElement.innerHTML = templates.welcome();
			break;
		default:
			//unrecognised view
			throw Error(`Unrecognised view: ${view}`);
	}
};

window.addEventListener('hashchange', showView);

showView().catch(err => window.location.hash = '#welcome');
