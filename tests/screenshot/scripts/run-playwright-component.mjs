#!/usr/bin/env node
/**
 * Run Playwright screenshot tests for one component (all cases, single shard).
 *
 * Usage:
 *   npm run test-playwright:component -- Sprite
 *   npm run test-playwright:component -- Sprite --update
 *   npm run test-playwright:component -- Sprite --test-id 0
 */
import {spawnSync} from 'child_process';
import path from 'path';
import {fileURLToPath} from 'url';

import {assertComponentSource} from '../playwright/paths.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..', '..', '..');
const playwrightRoot = path.join(__dirname, '..', 'playwright');
const config = path.join(playwrightRoot, 'playwright.config.mjs');
const spec = 'specs/neutral/Default-spec.js';

const args = process.argv.slice(2).filter(a => a !== '--');

function flagValue (name) {
	const index = args.indexOf(name);
	return index === -1 ? null : args[index + 1];
}

const component = args.find(a => !a.startsWith('--') && args.indexOf(a) === args.findIndex(x => !x.startsWith('--')));
const update = args.includes('--update');
const testId = flagValue('--test-id');
const title = flagValue('--title');

if (!component) {
	console.error('Usage: npm run test-playwright:component -- <ComponentName> [options]');
	console.error('Options: --update, --test-id <n>, --title <regex>');
	console.error('Example: npm run test-playwright:component -- Sprite --update');
	process.exit(1);
}

assertComponentSource(component);

const playwrightArgs = [
	'test',
	'--config', config,
	spec
];

if (update) {
	playwrightArgs.push('--update-snapshots');
}

const env = {
	...process.env,
	PLAYWRIGHT_COMPONENT: component,
	PLAYWRIGHT_INSTANCES: '1',
	PLAYWRIGHT_WORKERS: '1'
};

if (testId != null) {
	env.PLAYWRIGHT_TEST_ID = testId;
}
if (title != null) {
	env.PLAYWRIGHT_TITLE = title;
}

const result = spawnSync(
	process.platform === 'win32' ? 'npx.cmd' : 'npx',
	['playwright', ...playwrightArgs],
	{
		cwd: repoRoot,
		stdio: 'inherit',
		env,
		shell: process.platform === 'win32'
	}
);

process.exit(result.status ?? 1);
