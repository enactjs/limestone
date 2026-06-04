#!/usr/bin/env node
/**
 * Run WDIO screenshot tests for one component (Default shard, instances 1 = all cases).
 *
 * Usage:
 *   npm run test-ss:component -- Sprite
 *   npm run test-ss:component -- Sprite --skip-build
 *   npm run test-ss:component -- Sprite --parallel 5
 */
import {spawnSync} from 'child_process';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..', '..', '..');

const args = process.argv.slice(2).filter(a => a !== '--');

function flagValue (name) {
	const index = args.indexOf(name);
	return index === -1 ? null : args[index + 1];
}

const component = args.find(a => !a.startsWith('--'));
const skipBuild = args.includes('--skip-build');
const parallel = Math.max(1, Number.parseInt(flagValue('--parallel') ?? '1', 10) || 1);

if (!component) {
	console.error('Usage: npm run test-ss:component -- <ComponentName> [--skip-build] [--parallel <n>]');
	console.error('Example: npm run test-ss:component -- Sprite');
	console.error('Example: npm run test-ss:component -- Sprite --skip-build');
	console.error('Example: npm run test-ss:component -- Sprite --parallel 5');
	process.exit(1);
}

const screenshotSource = path.join(repoRoot, 'tests', 'screenshot', 'apps', 'components', `${component}.js`);
if (!fs.existsSync(screenshotSource)) {
	console.error(`Missing ${screenshotSource}`);
	process.exit(1);
}

const spec = path.join(repoRoot, 'tests', 'screenshot', 'specs', 'neutral', 'Default-specs.js');

console.log(`WDIO screenshots: ${component} (${spec}, parallel=${parallel})`);

const wdioArgs = [
	'run', 'test-ss',
	'--',
	'--component', `^${component}$`,
	'--instances', '1',
	'--spec', spec
];

wdioArgs.push('--parallel', String(parallel));

if (skipBuild) {
	wdioArgs.push('--skip-build');
}

const result = spawnSync(
	'npm',
	wdioArgs,
	{
		cwd: repoRoot,
		stdio: 'inherit',
		shell: true
	}
);

process.exit(result.status ?? 1);
