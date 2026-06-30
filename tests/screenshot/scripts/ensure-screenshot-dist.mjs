/* eslint-disable no-console */
import fs from 'fs';

import {SCREENSHOT_VIEW_INDEX, assertScreenshotDist} from '../playwright/paths.js';

export function hasScreenshotDist () {
	return fs.existsSync(SCREENSHOT_VIEW_INDEX);
}

/**
 * Ensure tests/screenshot/dist exists before Playwright starts its webServer.
 * Builds when dist is missing (even with --skip-build) so runs do not fail on a cold checkout.
 *
 * @returns {Promise<{skipBuild: boolean}>} skipBuild=true → set PLAYWRIGHT_SKIP_BUILD for global-setup
 */
export async function ensureScreenshotDist ({skipBuild = false} = {}) {
	if (hasScreenshotDist()) {
		return {skipBuild};
	}

	if (skipBuild) {
		console.log('tests/screenshot/dist is missing; building before Playwright (ignoring --skip-build)');
	} else {
		console.log('Building tests/screenshot/dist...');
	}

	const {default: buildApps} = await import('@enact/ui-test-utils/build-apps');
	await buildApps('screenshot');
	assertScreenshotDist();

	return {skipBuild: true};
}
