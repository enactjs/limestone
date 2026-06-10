import {createHash} from 'node:crypto';
import path from 'path';

/**
 * Case file name only (WDIO visual-service convention).
 * @see ui-test-utils/utils/runTest.js, screenshot/utils/confHelpers.js
 */
export function getScreenshotBasename (title) {
	let testCaseName = title.replace(/[/\\:?*"|<>]/g, '_');
	testCaseName = testCaseName.substring(0, 128) + '-' + createHash('md5').update(testCaseName).digest('hex');

	return `${testCaseName}.png`.replace(/ /g, '_');
}

/** Relative path: <Component>/<TestName>/<case>.png (matches WDIO reference layout). */
export function getScreenshotName (component, testName, title) {
	return path.posix.join(component, testName, getScreenshotBasename(title));
}

/** Playwright snapshot segments — array form keeps WDIO folder layout (not flat dashes). */
export function getScreenshotPathSegments (component, testName, title) {
	return getScreenshotName(component, testName, title).split('/');
}

