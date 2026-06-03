import {staticServer} from './global-setup.js';

export default async function globalTeardown () {
	if (!staticServer.started || !staticServer.process) {
		return;
	}

	staticServer.process.kill();
	staticServer.process = null;
	staticServer.started = false;
}
