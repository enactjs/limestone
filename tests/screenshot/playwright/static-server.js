import {spawn, spawnSync} from 'child_process';

import {PLAYWRIGHT_BASE_URL, PLAYWRIGHT_PORT, SCREENSHOT_DIST} from './paths.js';

const distPath = SCREENSHOT_DIST;
const port = PLAYWRIGHT_PORT;
const healthCheckUrl = `${PLAYWRIGHT_BASE_URL}/Limestone-View/index.html`;

/** Set when global-setup starts `serve` for ?request metadata (stopped before tests). */
export const staticServer = {
	process: null,
	started: false
};

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

/** Free the Playwright port when a previous run left `serve` listening or wedged. */
export function killProcessOnPort (listenPort = port) {
	if (process.platform === 'win32') {
		const result = spawnSync('netstat', ['-ano'], {encoding: 'utf8', shell: true});
		if (result.status !== 0) {
			return;
		}

		for (const line of result.stdout.split('\n')) {
			if (!line.includes(`:${listenPort}`) || !line.includes('LISTENING')) {
				continue;
			}

			const pid = line.trim().split(/\s+/).at(-1);
			if (pid && /^\d+$/.test(pid)) {
				spawnSync('taskkill', ['/T', '/F', '/PID', pid], {stdio: 'ignore', shell: true});
			}
		}
		return;
	}

	const result = spawnSync('lsof', ['-ti', `:${listenPort}`], {encoding: 'utf8'});
	if (result.status !== 0 || !result.stdout.trim()) {
		return;
	}

	for (const pid of result.stdout.trim().split('\n')) {
		if (/^\d+$/.test(pid)) {
			spawnSync('kill', ['-9', pid], {stdio: 'ignore'});
		}
	}
}

export function stopStaticServer () {
	if (!staticServer.started || !staticServer.process) {
		return;
	}

	killProcessTree(staticServer.process);
	staticServer.process = null;
	staticServer.started = false;
	killProcessOnPort(port);
}

async function fetchWithTimeout (url, timeoutMs = 5000) {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), timeoutMs);

	try {
		return await fetch(url, {signal: controller.signal});
	} finally {
		clearTimeout(timeout);
	}
}

async function isServerHealthy () {
	try {
		const response = await fetchWithTimeout(healthCheckUrl);
		return response.ok;
	} catch {
		return false;
	}
}

function startStaticServer () {
	const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
	staticServer.process = spawn(command, ['--yes', 'serve', distPath, '-l', port], {
		stdio: 'pipe',
		shell: process.platform === 'win32'
	});
	staticServer.started = true;
}

async function waitForServer (url, timeout = 120000) {
	const start = Date.now();

	while (Date.now() - start < timeout) {
		try {
			const response = await fetchWithTimeout(url, 5000);
			if (response.ok) {
				return;
			}
		} catch {
			// retry until the static server is ready
		}
		await new Promise(resolve => setTimeout(resolve, 500));
	}

	throw new Error(`Static server at ${url} did not start within ${timeout}ms`);
}

export async function ensureStaticServer () {
	if (await isServerHealthy()) {
		return;
	}

	stopStaticServer();
	startStaticServer();
	await waitForServer(healthCheckUrl);
}
