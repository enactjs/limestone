import {registerScreenshotTests} from '../../utils/run-screenshot-tests.js';

registerScreenshotTests({
	testName: 'Limestone Light',
	skin: 'light',
	highContrast: false,
	concurrency: 9
});
