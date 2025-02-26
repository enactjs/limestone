const {runTest} = require('@enact/ui-test-utils/utils');

const Page = require('./LimestonePage');

runTest({
	testName: 'Limestone Light',
	Page: Page,
	skin: 'light',
	highContrast: false,
	concurrency: 4
});
