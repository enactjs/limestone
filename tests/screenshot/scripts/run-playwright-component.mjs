#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Run Playwright screenshot tests for one component (all cases; INSTANCES=1, WORKERS from --parallel).
 *
 * Usage:
 *   npm run test-playwright:component -- Sprite
 *   npm run test-playwright:component -- Sprite --update
 *   npm run test-playwright:component -- Sprite --test-id 0
 *   npm run test-playwright:component -- Sprite --title <regex>
 *   npm run test-playwright:component -- Sprite --parallel 5
 */
import {spawnSync} from 'child_process';
import path from 'path';
import {fileURLToPath} from 'url';

import {assertComponentSource} from '../playwright/paths.js';
import {parseComponentArgs} from './parse-component-args.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..', '..', '..');
const playwrightRoot = path.join(__dirname, '..', 'playwright');
const config = path.join(playwrightRoot, 'playwright.config.mjs');
const spec = 'specs/neutral/Default-spec.js';

const {component, update, testId, title, parallel} = parseComponentArgs();

if (!component) {
	console.error('Usage: npm run test-playwright:component -- <ComponentName> [options]');
	console.error('Options: --update, --test-id <n>, --title <regex>, --parallel <n>');
	console.error('Example: npm run test-playwright:component -- Sprite');
	console.error('Example: npm run test-playwright:component -- Sprite --update');
	console.error('Example: npm run test-playwright:component -- Sprite --test-id 0');
	console.error('Example: npm run test-playwright:component -- Sprite --parallel 5');
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
	PLAYWRIGHT_WORKERS: String(parallel)
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
