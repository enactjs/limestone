#!/usr/bin/env node
/**
 * Compare Playwright vs WebdriverIO runtime for one component (all its screenshot cases).
 *
 * Usage:
 *   npm run benchmark-screenshots -- Sprite
 *   npm run benchmark-screenshots -- Sprite --build
 */
import {spawn} from 'child_process';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

import {assertComponentSource, SCREENSHOT_DIST} from './paths.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..', '..', '..');

const args = process.argv.slice(2).filter(a => a !== '--');
const component = args.find(a => !a.startsWith('--'));
const withBuild = args.includes('--build');

if (!component) {
	console.error('Usage: npm run benchmark-screenshots -- <ComponentName> [--build]');
	console.error('Example: npm run benchmark-screenshots -- Sprite');
	process.exit(1);
}

assertComponentSource(component);

const distIndex = path.join(SCREENSHOT_DIST, 'Limestone-View', 'index.html');
const skipBuild = !withBuild && fs.existsSync(distIndex);

function runCommand (label, command, args, env = {}) {
	return new Promise((resolve, reject) => {
		const start = Date.now();
		const child = spawn(command, args, {
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
	console.log(`\nBenchmark: ${component} (all cases, 1 worker / instances 1)`);
	if (skipBuild) {
		console.log('Using existing tests/screenshot/dist (pass --build to rebuild)\n');
	} else {
		console.log('Will build tests/screenshot/dist before run\n');
	}

	const playwright = await runCommand(
		'Playwright',
		'node',
		['tests/screenshot/scripts/run-playwright-component.mjs', component],
		skipBuild ? {PLAYWRIGHT_SKIP_BUILD: '1'} : {}
	);

	const wdioArgv = ['tests/screenshot/scripts/run-component-wdio.mjs', component];
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

	console.log('\n--- Results ---');
	console.log(`Component:    ${component}`);
	console.log(`Playwright:   ${pwSec.toFixed(1)}s`);
	console.log(`WebdriverIO:  ${wdioSec.toFixed(1)}s`);
	console.log(`Difference:   ${Math.abs(delta).toFixed(1)}s (${delta > 0 ? 'Playwright faster' : delta < 0 ? 'WDIO faster' : 'tie'})\n`);
}

main().catch(err => {
	console.error(err.message);
	process.exit(1);
});
