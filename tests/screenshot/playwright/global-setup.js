import fs from 'fs';

import buildApps from '@enact/ui-test-utils/build-apps';
import {chromium} from '@playwright/test';

import {PLAYWRIGHT_BASE_URL, SCREENSHOT_VIEW_INDEX, TEST_DATA_FILE, assertScreenshotDist} from './paths.js';
import {ensureStaticServer, stopStaticServer} from './static-server.js';
import {clearShardRegistry} from './utils/shard-registry.js';

const baseURL = PLAYWRIGHT_BASE_URL;
const testDataFile = TEST_DATA_FILE;

function shouldRefreshTestData () {
	if (process.env.PLAYWRIGHT_REFRESH_TEST_DATA === '1') {
		return true;
	}
	if (!fs.existsSync(testDataFile)) {
		return true;
	}
	const distIndex = SCREENSHOT_VIEW_INDEX;
	if (!fs.existsSync(distIndex)) {
		return true;
	}
	return fs.statSync(distIndex).mtimeMs > fs.statSync(testDataFile).mtimeMs;
}

export default async function globalSetup () {
	clearShardRegistry();

	if (!process.env.PLAYWRIGHT_SKIP_BUILD) {
		await buildApps('screenshot');
	}

	assertScreenshotDist();

	if (!shouldRefreshTestData()) {
		return;
	}

	// Playwright lifecycle: globalSetup → webServer (playwright.config.mjs) → tests → teardown.
	// We start serve here only to fetch ?request metadata into .test-data.json, then stop our
	// process so webServer can own the port for the full run (reuseExistingServer when not CI).
	await ensureStaticServer();

	try {
		const pwBrowser = await chromium.launch({
			channel: 'chrome',
			headless: true
		});

		try {
			const page = await pwBrowser.newPage();
			const requestUrl = `${baseURL}/Limestone-View/?request`;
			await page.goto(requestUrl, {waitUntil: 'load'});
			await page.waitForFunction(() => window.__TEST_DATA != null, null, {timeout: 30000});
			const testData = await page.evaluate(() => window.__TEST_DATA);

			if (testData == null) {
				throw new Error(
					`No window.__TEST_DATA at ${requestUrl}. The screenshot build may be stale or broken — ` +
					'rebuild tests/screenshot/dist (unset PLAYWRIGHT_SKIP_BUILD) and retry.'
				);
			}

			fs.writeFileSync(testDataFile, JSON.stringify(testData));
		} finally {
			await pwBrowser.close();
		}
	} finally {
		stopStaticServer();
	}
}
