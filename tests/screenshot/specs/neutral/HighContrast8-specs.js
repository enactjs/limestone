const {runTest} = require('@enact/ui-test-utils/utils');

const Page = require('./LimestonePage');

runTest({
	testName: 'Limestone High Contrast',
	Page: Page,
	skin: 'neutral',
	highContrast: true,
	concurrency: 8
});
