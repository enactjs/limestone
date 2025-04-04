const Page = require('../TabLayoutPage');

describe('TabLayout', function () {
	beforeEach(async function () {
		await Page.open('VerticalTabs');
		await Page.delay(500);
	});

	describe('vertical tabs', function () {
		describe('scrolling behavior', function () {
			describe.skip('5-way interaction', function () {
				it('should focus the last Spottable tab and it should be visible', async function () {
					const tabs = await (await Page.tabLayout.tabsFromScroller());
					// Step 1: 5-way down 15 times to reach the last Spottable tab
					for (let i = 0; i < 15; i++) {
						await Page.spotlightDown();
					}
					// Step 2: Wait for the last view
					await (await Page.tabLayout.view(15)).waitForExist();
					// Step 3: Check if the last tab is selected
					expect(await Page.tabLayout.isSelectedTab(15)).toBe(true);
					// Step 4: Check if the selected tab is visible in the viewport
					expect(await tabs[15].isDisplayed({withinViewport: true})).toBe(true);
				});

				it('should focus the first Spottable tab and it should be visible', async function () {
					const tabs = await (await Page.tabLayout.tabsFromScroller());
					// Step 1: 5-way down 15 times to reach the last Spottable tab
					for (let i = 0; i < 15; i++) {
						await Page.spotlightDown();
					}
					// Step 2: Wait for the last view
					await (await Page.tabLayout.view(15)).waitForExist();
					// Step 3: Check if the last tab is selected
					expect(await Page.tabLayout.isSelectedTab(15)).toBe(true);
					// Step 4: Check if the selected tab is visible in the viewport
					expect(await tabs[15].isDisplayed({withinViewport: true})).toBe(true);
					// Step 5: 5-way up 15 times to reach the first tab
					for (let i = 0; i < 15; i++) {
						await Page.spotlightUp();
					}
					// Step 6: Wait for the first view
					await (await Page.tabLayout.view(1)).waitForExist();
					// Step 7: Check if the first tab is selected
					expect(await Page.tabLayout.isSelectedTab(1)).toBe(true);
					// Step 8: Check if the selected tab is visible in the viewport
					expect(await tabs[1].isDisplayed({withinViewport: true})).toBe(true);
				});
			});

			describe('pointer interaction', function () {
				it('should scroll to the last Spottable tab', async function () {
					await Page.delay(500);
					const tabs = await (await Page.tabLayout.tabsFromScroller());
					// Step 1: Move the pointer to the 12th tab
					tabs[12].moveTo();
					// Step 2: Wait for the scrolling animation to complete
					await Page.delay(1500);
					// Step 3: Verify that the 15th tab is visible within the viewport
					expect(await tabs[15].isDisplayed({withinViewport: true})).toBe(true);
				});

				it('should scroll to the first Spottable tab', async function () {
					await Page.delay(500);
					const tabs = await (await Page.tabLayout.tabsFromScroller());
					// Step 1: Move the pointer to the 12th tab
					tabs[12].moveTo();
					// Step 2: Wait for the scrolling animation to complete
					await Page.delay(1500);
					// Step 3: Verify that the 15th tab is visible within the viewport
					expect(await tabs[15].isDisplayed({withinViewport: true})).toBe(true);
					// Step 4: Move the pointer to the 4th tab
					tabs[4].moveTo();
					// Step 5: Wait for the scrolling animation to complete
					await Page.delay(1500);
					// Step 6: Verify that the 1st tab is visible within the viewport
					expect(await tabs[1].isDisplayed({withinViewport: true})).toBe(true);
				});
			});
		});
	});
});
