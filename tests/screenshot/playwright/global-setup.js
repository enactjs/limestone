import fs from 'fs';
import path from 'path';
import {spawn} from 'child_process';

import buildApps from '@enact/ui-test-utils/build-apps';
import {chromium} from '@playwright/test';

import {PLAYWRIGHT_BASE_URL, PLAYWRIGHT_PORT, SCREENSHOT_DIST, TEST_DATA_FILE} from './paths.js';

const baseURL = PLAYWRIGHT_BASE_URL;
const distPath = SCREENSHOT_DIST;
const testDataFile = TEST_DATA_FILE;
const port = PLAYWRIGHT_PORT;

/** Set when this file starts `serve`; torn down in global-teardown.js */
export const staticServer = {
	process: null,
	started: false
};

async function waitForServer (url, timeout = 120000) {
	const start = Date.now();

	while (Date.now() - start < timeout) {
		try {
			const response = await fetch(url);
			if (response.ok || response.status === 404) {
				return;
			}
		} catch {
			// retry until the static server is ready
		}
		await new Promise(resolve => setTimeout(resolve, 500));
	}

	throw new Error(`Static server at ${url} did not start within ${timeout}ms`);
}

function startStaticServer () {
	const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
	staticServer.process = spawn(command, ['--yes', 'serve', distPath, '-l', port], {
		stdio: 'pipe',
		shell: process.platform === 'win32'
	});
	staticServer.started = true;
}

function shouldRefreshTestData () {
	if (process.env.PLAYWRIGHT_REFRESH_TEST_DATA === '1') {
		return true;
	}
	if (!fs.existsSync(testDataFile)) {
		return true;
	}
	const distIndex = path.join(distPath, 'Limestone-View', 'index.html');
	if (!fs.existsSync(distIndex)) {
		return true;
	}
	return fs.statSync(distIndex).mtimeMs > fs.statSync(testDataFile).mtimeMs;
}

export default async function globalSetup () {
	if (!process.env.PLAYWRIGHT_SKIP_BUILD) {
		await buildApps('screenshot');
	}

	try {
		await fetch(baseURL);
	} catch {
		startStaticServer();
		await waitForServer(baseURL);
	}

	if (!shouldRefreshTestData()) {
		return;
	}

	const browser = await chromium.launch({
		channel: 'chrome',
		headless: true
	});

	try {
		const page = await browser.newPage();
		await page.goto(`${baseURL}/Limestone-View/?request`, {waitUntil: 'networkidle'});
		const testData = await page.evaluate(() => window.__TEST_DATA);

		fs.writeFileSync(testDataFile, JSON.stringify(testData));
	} finally {
		await browser.close();
	}
}
