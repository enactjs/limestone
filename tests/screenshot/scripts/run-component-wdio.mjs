#!/usr/bin/env node

/**

 * Run WDIO screenshot tests for one component (Default shard, instances 1).

 *

 * Usage:

 *   npm run test-ss:component -- Sprite

 *   npm run test-ss:component -- Sprite --skip-build

 */

import {spawnSync} from 'child_process';

import fs from 'fs';

import path from 'path';

import {fileURLToPath} from 'url';



const __dirname = path.dirname(fileURLToPath(import.meta.url));

const repoRoot = path.join(__dirname, '..', '..', '..');



const args = process.argv.slice(2).filter(a => a !== '--');

const component = args.find(a => !a.startsWith('--'));

const skipBuild = args.includes('--skip-build');



if (!component) {

	console.error('Usage: npm run test-ss:component -- <ComponentName> [--skip-build]');

	console.error('Example: npm run test-ss:component -- Sprite');

	process.exit(1);

}



const screenshotSource = path.join(repoRoot, 'tests', 'screenshot', 'apps', 'components', `${component}.js`);

if (!fs.existsSync(screenshotSource)) {

	console.error(`Missing ${screenshotSource}`);

	process.exit(1);

}



const spec = path.join(repoRoot, 'tests', 'screenshot', 'specs', 'neutral', 'Default-specs.js');

console.log(`WDIO screenshots: ${component} (${spec})`);



const wdioArgs = [

	'run', 'test-ss',

	'--',

	'--component', `^${component}$`,

	'--instances', '1',

	'--spec', spec

];



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

