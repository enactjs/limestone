import path from 'path';
import {fileURLToPath} from 'url';
import {defineConfig, devices} from '@playwright/test';

import {PLAYWRIGHT_BASE_URL, PLAYWRIGHT_PORT, SCREENSHOT_HEALTH_URL} from './paths.js';
import {resolveTestMatchGlob} from './utils/spec-match.js';

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
			pathTemplate: path.join(__dirname, 'snapshots/{arg}{ext}')
		}
	},
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
		trace: 'on-first-retry',
		viewport: {width: 1920, height: 1080},
		launchOptions: {
			args: [
				'--disable-infobars',
				'--disable-search-engine-choice-screen',
				'--disable-notifications',
				'--disable-popup-blocking',
				'--disable-lcd-text',
				'--force-device-scale-factor=1',
				'--disable-gpu',
				'--window-size=1920,1080'
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
