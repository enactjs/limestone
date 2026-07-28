/* global ENACT_PACK_ISOMORPHIC */
import {hydrate, render} from 'preact';

import App from './App';

const appElement = (<App />);

// In a browser environment, render instead of exporting
if (typeof window !== 'undefined') {
	if (ENACT_PACK_ISOMORPHIC) {
		hydrate(appElement, document.getElementById('root'));
	} else {
		render(appElement, document.getElementById('root'));
	}
}

export default appElement;
