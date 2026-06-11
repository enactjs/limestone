import {spawnSync} from 'child_process';
import path from 'path';
import {fileURLToPath} from 'url';

/* eslint-disable no-console */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..', '..', '..');
const config = path.join(__dirname, '..', 'playwright', 'playwright.config.mjs');

function formatDuration (durationSec) {
	const hours = Math.floor(durationSec / 3600);
	const minutes = Math.floor((durationSec % 3600) / 60);
	const seconds = durationSec % 60;

	const parts = [];
	if (hours > 0) parts.push(`${hours}h`);
	if (hours > 0 || minutes > 0) parts.push(`${minutes}m`);
	parts.push(`${seconds.toFixed(1)}s`);
	return parts.join(' ');
}

/**
 * Run Playwright with optional env overrides and print wall-clock duration.
 */
export function spawnPlaywright ({playwrightArgs = [], env = {}, label = 'Playwright'}) {
	const start = Date.now();
	const result = spawnSync(
		process.platform === 'win32' ? 'npx.cmd' : 'npx',
		['playwright', 'test', '--config', config, ...playwrightArgs],
		{
			cwd: repoRoot,
			stdio: 'inherit',
			env: {...process.env, ...env},
			shell: process.platform === 'win32'
		}
	);
	const durationSec = (Date.now() - start) / 1000;

	console.log(`\n${label} finished in ${formatDuration(durationSec)}`);

	return result.status ?? 1;
}
