#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Run Playwright screenshot tests for one component (all cases; INSTANCES=1, WORKERS from --parallel).
 *
 * Usage:
 *   npm run test-playwright:component -- Sprite
 *   npm run test-playwright:component -- Sprite --update
 *   npm run test-playwright:component -- Sprite --skip-build
 *   npm run test-playwright:component -- Sprite --spec Light
 *   npm run test-playwright:component -- Sprite --test-id 0
 *   npm run test-playwright:component -- Sprite --title <regex>
 *   npm run test-playwright:component -- Sprite --parallel 5
 */
import {assertComponentSource} from '../playwright/paths.js';
import {ensureScreenshotDist} from './ensure-screenshot-dist.mjs';
import {parseComponentArgs} from './parse-component-args.mjs';
import {spawnPlaywright} from './spawn-playwright.mjs';

const {component, update, skipBuild, spec, testId, title, parallel} = parseComponentArgs();

if (!component) {
	console.error('Usage: npm run test-playwright:component -- <ComponentName> [options]');
	console.error('Options: --update, --skip-build, --spec <Name>, --test-id <n>, --title <regex>, --parallel <n>');
	console.error('Example: npm run test-playwright:component -- Sprite');
	console.error('Example: npm run test-playwright:component -- Sprite --update');
	console.error('Example: npm run test-playwright:component -- Sprite --skip-build');
	console.error('Example: npm run test-playwright:component -- Sprite --spec Light');
	process.exit(1);
}

assertComponentSource(component);

const env = {
	PLAYWRIGHT_COMPONENT: component,
	PLAYWRIGHT_COMPONENT_EXACT: '1',
	PLAYWRIGHT_INSTANCES: '1',
	PLAYWRIGHT_WORKERS: String(parallel)
};

if (update) {
	env.PLAYWRIGHT_FORCE_UPDATE = '1';
}

if (spec) {
	env.PLAYWRIGHT_SPEC = spec;
}

if (testId != null) {
	env.PLAYWRIGHT_TEST_ID = testId;
}

if (title != null) {
	env.PLAYWRIGHT_TITLE = title;
}

const filters = [`component ${component}`];
if (spec) {
	filters.push(`spec ~ ${spec}`);
}
console.log(`Playwright: ${filters.join(', ')}`);

const {skipBuild: skipBuildInSetup} = await ensureScreenshotDist({skipBuild});

if (skipBuild || skipBuildInSetup) {
	env.PLAYWRIGHT_SKIP_BUILD = '1';
}

const exitCode = spawnPlaywright({
	env,
	label: `Playwright (${component})`
});
process.exit(exitCode);
