import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotRoot = path.join(__dirname, '..');

/** Default 4568 so WDIO can keep 4567 when both run in parallel. */
export const PLAYWRIGHT_BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:4568';
export const PLAYWRIGHT_PORT = new URL(PLAYWRIGHT_BASE_URL).port || '4568';

export const SCREENSHOT_DIST = path.join(screenshotRoot, 'dist');
export const SCREENSHOT_VIEW = 'Limestone-View';
export const SCREENSHOT_VIEW_INDEX = path.join(SCREENSHOT_DIST, SCREENSHOT_VIEW, 'index.html');
export const SCREENSHOT_HEALTH_URL = `${PLAYWRIGHT_BASE_URL}/${SCREENSHOT_VIEW}/index.html`;
export const SCREENSHOT_COMPONENTS = path.join(screenshotRoot, 'apps', 'components');
export const TEST_DATA_FILE = path.join(__dirname, '.test-data.json');
export const SNAPSHOTS_DIR = path.join(__dirname, 'snapshots');

function componentSourcePath (componentName) {
	return path.join(SCREENSHOT_COMPONENTS, `${componentName}.js`);
}

export function assertScreenshotDist () {
	if (fs.existsSync(SCREENSHOT_VIEW_INDEX)) {
		return;
	}

	const distHint = !fs.existsSync(SCREENSHOT_DIST) ?
		`Directory ${SCREENSHOT_DIST} does not exist. ` :
		'';

	if (process.env.PLAYWRIGHT_SKIP_BUILD) {
		throw new Error(
			`${distHint}Missing ${SCREENSHOT_VIEW_INDEX}. ` +
			'Remove --skip-build (or unset PLAYWRIGHT_SKIP_BUILD) to build automatically, ' +
			'or run npm run test-ss once to populate tests/screenshot/dist/.'
		);
	}

	throw new Error(
		`${distHint}Screenshot build did not produce ${SCREENSHOT_VIEW_INDEX}. ` +
		'Run npm run bootstrap, link @enact/ui-test-utils if build-apps is missing from exports, then retry.'
	);
}

export function assertComponentSource (componentName) {
	const source = componentSourcePath(componentName);
	if (!fs.existsSync(source)) {
		throw new Error(`Missing ${source} — add the component under tests/screenshot/apps/components/`);
	}
}
