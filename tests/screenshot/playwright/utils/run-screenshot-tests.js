import fs from 'fs';

import {test as baseTest, expect as baseExpect} from '@playwright/test';

import {assertComponentSource, TEST_DATA_FILE} from '../paths.js';
import {getScreenshotName} from './screenshot-name.js';
import {openComponent} from './limestone-page.js';

const testIdFilter = process.env.PLAYWRIGHT_TEST_ID != null ?
	Number.parseInt(process.env.PLAYWRIGHT_TEST_ID) :
	null;
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

function shouldIncludeTest (component, testId, title, configComponent) {
	const componentFilter = resolveComponentFilter({component: configComponent});
	if (componentFilter) {
		const pattern = componentFilter.startsWith('^') ? componentFilter : `^${componentFilter}$`;
		if (!component.match(new RegExp(pattern))) {
			return false;
		}
	}
	if (testIdFilter != null && testIdFilter !== testId) {
		return false;
	}
	if (titleFilter && !title.match(new RegExp(titleFilter))) {
		return false;
	}
	return true;
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

	baseTest.describe(suiteName, () => {
		baseTest.beforeEach(async ({page}) => {
			await page.setViewportSize({width: 1920, height: 1167});
		});

		for (const screenshotTest of cases) {
			baseTest(screenshotTest.title, async ({page}) => {
				await openComponent(page, screenshotTest.params);
				await baseExpect(page).toHaveScreenshot(
					getScreenshotName(
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
