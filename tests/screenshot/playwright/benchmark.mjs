#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Compare Playwright vs WebdriverIO runtime for one component (all its screenshot cases).
 *
 * Usage:
 *   npm run benchmark-screenshots -- Sprite
 *   npm run benchmark-screenshots -- Sprite --build
 *   npm run benchmark-screenshots -- Chip --parallel 5
 *   (reuses tests/screenshot/dist when built; pass --build to rebuild)
 */
import {spawn} from 'child_process';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

import {assertComponentSource, SCREENSHOT_VIEW_INDEX} from './paths.js';
import {parseComponentArgs} from '../scripts/parse-cli-args.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..', '..', '..');

const {component, withBuild, parallel} = parseComponentArgs();

if (!component) {
	console.error('Usage: npm run benchmark-screenshots -- <ComponentName> [--build] [--parallel <n>]');
	console.error('Example: npm run benchmark-screenshots -- Sprite');
	console.error('Example: npm run benchmark-screenshots -- Sprite --build');
	console.error('Example: npm run benchmark-screenshots -- Chip --parallel 5');
	process.exit(1);
}

assertComponentSource(component);

const distIndex = SCREENSHOT_VIEW_INDEX;
const skipBuild = !withBuild && fs.existsSync(distIndex);

function runCommand (label, command, commandArgs, env = {}) {
	return new Promise((resolve, reject) => {
		const start = Date.now();
		const child = spawn(command, commandArgs, {
			cwd: repoRoot,
			env: {...process.env, ...env},
			shell: true,
			stdio: 'inherit'
		});

		child.on('close', code => {
			const durationMs = Date.now() - start;
			if (code === 0) {
				resolve({label, durationMs});
			} else {
				reject(new Error(`${label} failed with exit code ${code} after ${(durationMs / 1000).toFixed(1)}s`));
			}
		});
	});
}

async function main () {
	const parallelLabel = parallel === 1 ?
		'1 worker / 1 browser (sequential)' :
		`parallel ${parallel} (PW: workers=${parallel}, instances=1; WDIO: --parallel ${parallel}, --instances 1)`;

	console.log(`\nBenchmark: ${component} (all cases, ${parallelLabel})`);
	if (skipBuild) {
		console.log('Using existing tests/screenshot/dist (pass --build to rebuild)\n');
	} else {
		console.log('Will build tests/screenshot/dist before run\n');
	}

	const parallelArg = ['--parallel', String(parallel)];

	const playwright = await runCommand(
		'Playwright',
		'node',
		['tests/screenshot/scripts/run-playwright.mjs', component, ...parallelArg],
		skipBuild ? {PLAYWRIGHT_SKIP_BUILD: '1'} : {}
	);

	const wdioArgv = ['tests/screenshot/scripts/run-component-wdio.mjs', component, ...parallelArg];
	if (skipBuild) {
		wdioArgv.push('--skip-build');
	}

	const wdio = await runCommand(
		'WebdriverIO',
		'node',
		wdioArgv,
		{}
	);

	const pwSec = playwright.durationMs / 1000;
	const wdioSec = wdio.durationMs / 1000;
	const delta = wdioSec - pwSec;
	let winner = 'tie';

	if (delta > 0) {
		winner = 'Playwright faster';
	} else if (delta < 0) {
		winner = 'WDIO faster';
	}

	console.log('\n--- Results ---');
	console.log(`Component:    ${component}`);
	console.log(`Parallelism:  ${parallel}`);
	console.log(`Playwright:   ${pwSec.toFixed(1)}s`);
	console.log(`WebdriverIO:  ${wdioSec.toFixed(1)}s`);
	console.log(`Difference:   ${Math.abs(delta).toFixed(1)}s (${winner})\n`);
}

main().catch(err => {
	console.error(err.message);
	process.exit(1);
});
