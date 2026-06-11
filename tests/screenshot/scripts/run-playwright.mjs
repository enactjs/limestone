#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Run Playwright screenshot tests (full suite or single component).
 *
 * Full suite:
 *   npm run test-playwright
 *   npm run test-playwright -- --component Button
 *   npm run test-playwright -- --spec Light
 *   npm run test-playwright -- --component Button --spec Light
 *   npm run test-playwright -- --update
 *   npm run test-playwright -- --skip-build
 *   npm run test-playwright -- --parallel 5
 *
 * Single component (positional name; INSTANCES=1, WORKERS from --parallel):
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
import {isComponentPlaywrightRun, parseComponentArgs, parsePlaywrightArgs} from './parse-cli-args.mjs';
import {spawnPlaywright} from './spawn-playwright.mjs';

function printComponentUsage () {
	console.error('Usage: npm run test-playwright:component -- <ComponentName> [options]');
	console.error('Options: --update, --skip-build, --spec <Name>, --test-id <n>, --title <regex>, --parallel <n>');
	console.error('Example: npm run test-playwright:component -- Sprite');
	console.error('Example: npm run test-playwright:component -- Sprite --update');
	console.error('Example: npm run test-playwright:component -- Sprite --skip-build');
	console.error('Example: npm run test-playwright:component -- Sprite --spec Light');
}

function buildSuiteEnv () {
	const {component, spec, update, skipBuild, parallel, testId, title} = parsePlaywrightArgs();
	const env = {};
	const filters = [];

	let resolvedComponent = component;
	let resolvedTitle = title;

	if (title != null && !component) {
		const titleParts = title.trim().split(/\s+/);

		if (titleParts.length > 1) {
			resolvedComponent = titleParts[0];
			resolvedTitle = titleParts.slice(1).join(' ');
		}
	}

	if (resolvedComponent) {
		env.PLAYWRIGHT_COMPONENT = resolvedComponent;
		filters.push(`component ~ ${resolvedComponent}`);
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

	if (resolvedTitle != null) {
		env.PLAYWRIGHT_TITLE = resolvedTitle;
		filters.push(`title ~ ${resolvedTitle}`);
	}

	if (filters.length) {
		console.log(`Playwright filters: ${filters.join(', ')}`);
	} else {
		console.log('Playwright: all components, all specs');
	}

	return {env, skipBuild, label: 'Playwright'};
}

function buildComponentEnv () {
	const {component, update, skipBuild, spec, testId, title, parallel} = parseComponentArgs();

	if (!component) {
		printComponentUsage();
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

	return {env, skipBuild, label: `Playwright (${component})`};
}

const {env, skipBuild, label} = isComponentPlaywrightRun() ?
	buildComponentEnv() :
	buildSuiteEnv();

const {skipBuild: skipBuildInSetup} = await ensureScreenshotDist({skipBuild});

if (skipBuild || skipBuildInSetup) {
	env.PLAYWRIGHT_SKIP_BUILD = '1';
}

const exitCode = spawnPlaywright({env, label});
process.exit(exitCode);
