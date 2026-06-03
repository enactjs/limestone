import {registerScreenshotTests} from '../../utils/run-screenshot-tests.js';

registerScreenshotTests({
	testName: 'Limestone High Contrast',
	skin: 'neutral',
	highContrast: true,
	concurrency: 8
});
