#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Run Playwright screenshot tests with optional component/spec filters.
 *
 * Usage:
 *   npm run test-playwright
 *   npm run test-playwright -- --component Button
 *   npm run test-playwright -- --spec Light
 *   npm run test-playwright -- --component Button --spec Light
 *   npm run test-playwright -- --update
 *   npm run test-playwright -- --skip-build
 *   npm run test-playwright -- --parallel 5
 */
import {ensureScreenshotDist} from './ensure-screenshot-dist.mjs';
import {parsePlaywrightArgs} from './parse-playwright-args.mjs';
import {spawnPlaywright} from './spawn-playwright.mjs';

const {component, spec, update, skipBuild, parallel, testId, title} = parsePlaywrightArgs();
const env = {};
const filters = [];

if (component) {
	env.PLAYWRIGHT_COMPONENT = component;
	filters.push(`component ~ ${component}`);
}

if (spec) {
	env.PLAYWRIGHT_SPEC = spec;
	filters.push(`spec ~ ${spec}`);
}

if (update) {
	env.PLAYWRIGHT_FORCE_UPDATE = '1';
}

if (parallel != null) {
	env.PLAYWRIGHT_WORKERS = String(parallel);
}

if (testId != null) {
	env.PLAYWRIGHT_TEST_ID = testId;
}

if (title != null) {
	env.PLAYWRIGHT_TITLE = title;
}

if (filters.length) {
	console.log(`Playwright filters: ${filters.join(', ')}`);
} else {
	console.log('Playwright: all components, all specs');
}

const {skipBuild: skipBuildInSetup} = await ensureScreenshotDist({skipBuild});

if (skipBuild || skipBuildInSetup) {
	env.PLAYWRIGHT_SKIP_BUILD = '1';
}

const exitCode = spawnPlaywright({env});
process.exit(exitCode);
