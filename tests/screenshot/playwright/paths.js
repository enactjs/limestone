import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotRoot = path.join(__dirname, '..');

/** Default 4568 so WDIO can keep 4567 when both run in parallel. */
export const PLAYWRIGHT_BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:4568';
export const PLAYWRIGHT_PORT = new URL(PLAYWRIGHT_BASE_URL).port || '4568';

export const SCREENSHOT_DIST = path.join(screenshotRoot, 'dist');
export const SCREENSHOT_COMPONENTS = path.join(screenshotRoot, 'apps', 'components');
export const TEST_DATA_FILE = path.join(__dirname, '.test-data.json');

function componentSourcePath (componentName) {
	return path.join(SCREENSHOT_COMPONENTS, `${componentName}.js`);
}

export function assertComponentSource (componentName) {
	const source = componentSourcePath(componentName);
	if (!fs.existsSync(source)) {
		throw new Error(`Missing ${source} — add the component under tests/screenshot/apps/components/`);
	}
}
