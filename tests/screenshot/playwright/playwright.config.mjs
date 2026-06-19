import path from 'path';
import {fileURLToPath} from 'url';
import {defineConfig, devices} from '@playwright/test';

import {PLAYWRIGHT_BASE_URL, PLAYWRIGHT_PORT, SCREENSHOT_HEALTH_URL} from './paths.js';
import {resolveTestMatchGlob} from './utils/spec-match.js';
import {SCREENSHOT_COMPARE_OPTIONS, SCREENSHOT_VIEWPORT} from './utils/screenshot-options.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'dist');

export default defineConfig({
	testDir: path.join(__dirname, 'specs'),
	testMatch: resolveTestMatchGlob(),
	testIgnore: ['**/utils/**', '**/scripts/**'],
	globalSetup: path.join(__dirname, 'global-setup.js'),
	globalTeardown: path.join(__dirname, 'global-teardown.js'),
	updateSnapshots: 'none',
	snapshotPathTemplate: path.join(__dirname, 'snapshots/{arg}{ext}'),
	expect: {
		toHaveScreenshot: {
			pathTemplate: path.join(__dirname, 'snapshots/{arg}{ext}'),
			...SCREENSHOT_COMPARE_OPTIONS
		}
	},
	// WDIO mocha timeout is 1h; default Playwright 30s is too low for CI (goto + hydrate + fonts).
	timeout: 120000,
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.PLAYWRIGHT_WORKERS ? Number.parseInt(process.env.PLAYWRIGHT_WORKERS) : 5,
	reporter: [
		['list'],
		['html', {outputFolder: path.join(__dirname, 'reports', 'html'), open: 'never'}]
	],
	outputDir: path.join(__dirname, 'test-results'),
	use: {
		baseURL: PLAYWRIGHT_BASE_URL,
		navigationTimeout: 60000,
		actionTimeout: 60000,
		trace: 'on-first-retry',
		viewport: SCREENSHOT_VIEWPORT,
		launchOptions: {
			args: [
				'--disable-infobars',
				'--disable-search-engine-choice-screen',
				'--disable-notifications',
				'--disable-popup-blocking',
				'--disable-lcd-text',
				'--force-device-scale-factor=1',
				'--disable-gpu',
				`--window-size=${SCREENSHOT_VIEWPORT.width},${SCREENSHOT_VIEWPORT.height}`
			]
		}
	},
	webServer: {
		command: process.platform === 'win32' ?
			`npx.cmd --yes serve "${distDir}" -l ${PLAYWRIGHT_PORT}` :
			`npx --yes serve ${distDir} -l ${PLAYWRIGHT_PORT}`,
		url: SCREENSHOT_HEALTH_URL,
		reuseExistingServer: !process.env.CI,
		timeout: 120000,
		shell: process.platform === 'win32'
	},
	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
				channel: 'chrome'
			}
		}
	]
});
