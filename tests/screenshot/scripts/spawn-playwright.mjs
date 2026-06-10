import {spawnSync} from 'child_process';
import path from 'path';
import {fileURLToPath} from 'url';

/* eslint-disable no-console */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..', '..', '..');
const config = path.join(__dirname, '..', 'playwright', 'playwright.config.mjs');

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

	console.log(`\n${label} finished in ${durationSec.toFixed(1)}s`);

	return result.status ?? 1;
}
