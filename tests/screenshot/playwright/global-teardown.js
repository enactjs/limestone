import {spawnSync} from 'child_process';

import {staticServer} from './global-setup.js';
import {validateShardCoverage} from './utils/shard-registry.js';

function killProcessTree (childProcess) {
	if (process.platform === 'win32') {
		spawnSync('taskkill', ['/T', '/F', '/PID', String(childProcess.pid)], {
			stdio: 'ignore',
			shell: true
		});
		return;
	}

	childProcess.kill();
}

export default async function globalTeardown () {
	validateShardCoverage();

	if (!staticServer.started || !staticServer.process) {
		return;
	}

	killProcessTree(staticServer.process);
	staticServer.process = null;
	staticServer.started = false;
}
