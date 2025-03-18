const Page = require('../TabLayoutPage');

describe('TabLayout', function () {
	beforeEach(async function () {
		await Page.open('VerticalTabs');
		await Page.delay(500);
	});

	describe('vertical tabs', function () {
		describe('scrolling behavior', function () {
			describe('5-way interaction', function () {
				it('should focus the last Spottable tab and it should be visible', async function () {
					await Page.delay(500);
					// Step 1: 5-way down 15 times to reach the last Spottable tab
					for (let i = 0; i < 15; i++) {
						await Page.spotlightDown();
					}
					// Step 2: Wait for the last view
					await (await Page.tabLayout.view(15)).waitForExist();
					// Step 3: Check if the last tab is selected
					expect(await Page.tabLayout.isSelectedTab(15)).toBe(true);
					// Step 4: Check if the selected tab is visible in the viewport
					expect(await (await Page.tabLayout.tabItems())[15]).toBeDisplayedInViewport();
				});

				it('should focus the first Spottable tab and it should be visible', async function () {
					await Page.delay(500);
					// Step 1: 5-way down 15 times to reach the last Spottable tab
					for (let i = 0; i < 15; i++) {
						await Page.spotlightDown();
					}
					// Step 2: Wait for the last view
					await (await Page.tabLayout.view(15)).waitForExist();
					// Step 3: Check if the last tab is selected
					expect(await Page.tabLayout.isSelectedTab(15)).toBe(true);
					// Step 4: Check if the selected tab is visible in the viewport
					expect(await (await Page.tabLayout.tabItems())[15]).toBeDisplayedInViewport();
					// Step 5: 5-way up 15 times to reach the first tab
					for (let i = 0; i < 15; i++) {
						await Page.spotlightUp();
					}
					// Step 6: Wait for the first view
					await (await Page.tabLayout.view(1)).waitForExist();
					// Step 7: Check if the first tab is selected
					expect(await Page.tabLayout.isSelectedTab(1)).toBe(true);
					// Step 8: Check if the selected tab is visible in the viewport
					expect(await (await Page.tabLayout.tabItems())[1]).toBeDisplayedInViewport();
				});
			});

			describe('pointer interaction', function () {
				it('should scroll to the last Spottable tab', async function () {
					const tabs = await (await Page.tabLayout.tabItems());
					tabs[11].moveTo();
					await Page.delay(1000);
					expect(tabs[14]).toBeDisplayedInViewport();
				});

				it('should scroll to the first Spottable tab', async function () {
					const tabs = await (await Page.tabLayout.tabItems());
					tabs[11].moveTo();
					await Page.delay(1000);
					expect(tabs[14]).toBeDisplayedInViewport();

					tabs[5].moveTo();
					await Page.delay(1000);
					expect(tabs[0]).toBeDisplayedInViewport();
				});
			});
		});
	});
});
