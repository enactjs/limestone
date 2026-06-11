import fs from 'fs';
import path from 'path';

import {test as baseTest, expect as baseExpect} from '@playwright/test';

import {assertComponentSource, TEST_DATA_FILE} from '../paths.js';
import {getScreenshotPathSegments} from './screenshot-name.js';
import {openComponent} from './limestone-page.js';
import {recordShard} from './shard-registry.js';

const forceUpdate = process.env.PLAYWRIGHT_FORCE_UPDATE === '1';
const componentExactMatch = process.env.PLAYWRIGHT_COMPONENT_EXACT === '1';

function parseTestIdFilter () {
	const raw = process.env.PLAYWRIGHT_TEST_ID;

	if (raw == null) {
		return null;
	}

	const trimmed = raw.trim();

	if (!/^\d+$/.test(trimmed)) {
		throw new Error(
			`Invalid PLAYWRIGHT_TEST_ID "${raw}": must be a non-negative integer (e.g. --test-id 3).`
		);
	}

	return Number.parseInt(trimmed);
}

const testIdFilter = parseTestIdFilter();
const titleFilter = process.env.PLAYWRIGHT_TITLE;
const maxInstances = process.env.PLAYWRIGHT_INSTANCES ?
	Number.parseInt(process.env.PLAYWRIGHT_INSTANCES) :
	5;

function loadTestData () {
	return JSON.parse(fs.readFileSync(TEST_DATA_FILE, 'utf8'));
}

function resolveComponentFilter (config) {
	return config.component || process.env.PLAYWRIGHT_COMPONENT || null;
}

function matchesTitleFilter (title, filter) {
	const terms = filter.trim().split(/\s+/).filter(Boolean);

	return terms.every(term => {
		try {
			return new RegExp(term, 'i').test(title);
		} catch {
			return title.toLowerCase().includes(term.toLowerCase());
		}
	});
}

function shouldIncludeTest (component, testId, title, configComponent) {
	const componentFilter = resolveComponentFilter({component: configComponent});
	if (componentFilter) {
		if (componentExactMatch) {
			const pattern = componentFilter.startsWith('^') ? componentFilter : `^${componentFilter}$`;
			if (!component.match(new RegExp(pattern))) {
				return false;
			}
		} else if (!component.includes(componentFilter)) {
			return false;
		}
	}
	if (testIdFilter != null && testIdFilter !== testId) {
		return false;
	}
	if (titleFilter && !matchesTitleFilter(title, titleFilter)) {
		return false;
	}
	return true;
}

function resolveSnapshotPath (testInfo, segments) {
	return testInfo.snapshotPath(...segments, {kind: 'screenshot'});
}

/**
 * WDIO autoSaveBaseline: create missing baselines without --update.
 * PLAYWRIGHT_FORCE_UPDATE (--update) always overwrites existing baselines.
 * Snapshot path: snapshots/<Component>/<TestName>/<case>.png (same as WDIO).
 */
async function assertPageScreenshot (page, testInfo, segments, options) {
	const filePath = resolveSnapshotPath(testInfo, segments);

	if (forceUpdate || !fs.existsSync(filePath)) {
		fs.mkdirSync(path.dirname(filePath), {recursive: true});
		await page.screenshot({
			animations: 'disabled',
			caret: 'hide',
			type: 'png',
			path: filePath
		});
		return;
	}

	await baseExpect(page).toHaveScreenshot(segments, options);
}

/**
 * Cases from tests/screenshot/apps/components/*.js (built into tests/screenshot/dist).
 */
function getScreenshotTests ({testName, skin, highContrast, concurrency, component: configComponent, maxWorkers = maxInstances}) {
	if (concurrency && concurrency > maxWorkers) {
		return [];
	}

	if (configComponent) {
		assertComponentSource(configComponent);
	}

	const testCases = loadTestData();
	const tests = [];

	for (const component in testCases) {
		testCases[component].forEach((testCase, testId) => {
			if (concurrency && testId % maxWorkers !== concurrency - 1) {
				return;
			}
			if (!shouldIncludeTest(component, testId, testCase.title, configComponent)) {
				return;
			}

			tests.push({
				title: `${component}~/${testName}~/${testCase.title}~/${testId}`,
				params: {component, testId, skin, highContrast, caseTitle: testCase.title}
			});
		});
	}

	return tests;
}

export function registerScreenshotTests (config) {
	const component = resolveComponentFilter(config);
	let suiteName = config.testName;

	if (component) {
		suiteName = `${config.testName} — ${component}`;
	} else if (config.concurrency) {
		suiteName = `${config.testName} (shard ${config.concurrency})`;
	}
	const cases = getScreenshotTests(config);
	recordShard(config, maxInstances);

	baseTest.describe(suiteName, () => {
		baseTest.beforeEach(async ({page}) => {
			await page.setViewportSize({width: 1920, height: 1080});
		});

		for (const screenshotTest of cases) {
			baseTest(screenshotTest.title, async ({page}, testInfo) => {
				await openComponent(page, screenshotTest.params);
				await assertPageScreenshot(
					page,
					testInfo,
					getScreenshotPathSegments(
						screenshotTest.params.component,
						config.testName,
						screenshotTest.params.caseTitle
					),
					{
						animations: 'disabled',
						caret: 'hide',
						maxDiffPixelRatio: 0
					}
				);
			});
		}
	});
}
