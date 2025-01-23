const {runTest} = require('@enact/ui-test-utils/utils');

const Page = require('./LimestonePage');

runTest({
	testName: 'Limestone',
	Page: Page,
	skin: 'neutral',
	highContrast: false,
	concurrency: 4
});
