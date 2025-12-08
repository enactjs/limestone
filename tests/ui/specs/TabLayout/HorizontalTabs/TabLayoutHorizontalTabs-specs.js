const Page = require('../TabLayoutPage');

describe('TabLayout', function () {
	beforeEach(async function () {
		await Page.open('HorizontalTabs');
		await Page.delay(500);
	});

	describe('horizontal tabs', function () {
		describe('scrolling behavior', function () {
			describe('5-way interaction', function () {
				it('should focus the last Spottable tab and it should be visible', async function () {
					const tabs = await (await Page.tabLayout.tabsFromScroller());
					// Step 1: 5-way right 15 times to reach the last Spottable tab
					for (let i = 0; i < 15; i++) {
						await Page.spotlightRight();
					}
					// Step 2: Wait for the last view
					await Page.delay(1000);
					await (await Page.tabLayout.view(15)).waitForExist();
					// Step 3: Check if the last tab is selected
					expect(await Page.tabLayout.isSelectedTab(14)).toBe(true);
					// Step 4: Check if the selected tab is visible in the viewport
					expect(await tabs[14].isDisplayed({withinViewport: true})).toBe(true);
				});

				it('should focus the first Spottable tab and it should be visible', async function () {
					const tabs = await (await Page.tabLayout.tabsFromScroller());
					// Step 1: 5-way right 15 times to reach the last Spottable tab
					for (let i = 0; i < 15; i++) {
						await Page.spotlightRight();
					}
					// Step 2: Wait for the last view
					await Page.delay(1000);
					await (await Page.tabLayout.view(15)).waitForExist();
					// Step 3: Check if the last tab is selected
					expect(await Page.tabLayout.isSelectedTab(14)).toBe(true);
					// Step 4: Check if the selected tab is visible in the viewport
					expect(await tabs[14].isDisplayed({withinViewport: true})).toBe(true);
					// Step 5: 5-way left 15 times to reach the first tab
					for (let i = 0; i < 15; i++) {
						await Page.spotlightLeft();
					}
					// Step 6: Wait for the first view
					await Page.delay(1000);
					await (await Page.tabLayout.view(1)).waitForExist();
					// Step 7: Check if the first tab is selected
					expect(await Page.tabLayout.isSelectedTab(0)).toBe(true);
					// Step 8: Check if the selected tab is visible in the viewport
					expect(await tabs[0].isDisplayed({withinViewport: true})).toBe(true);
				});
			});

			describe('pointer interaction', function () {
				it('should scroll to the last Spottable tab', async function () {
					const tabs = await (await Page.tabLayout.tabsFromScroller());
					// Step 1: Move the pointer to the 6th tab
					await tabs[5].moveTo({xOffset: 200, yOffset: 0});
					// Step 2: Wait for the scrolling animation to complete
					await Page.delay(6000);
					// Step 3: Verify that the 15th tab is visible within the viewport
					expect(await tabs[14].isDisplayed({withinViewport: true})).toBe(true);
				});

				it('should scroll to the first Spottable tab', async function () {
					const tabs = await (await Page.tabLayout.tabsFromScroller());
					// Step 1: Move the pointer to the 6th tab
					await tabs[5].moveTo({xOffset: 200, yOffset: 0});
					// Step 2: Wait for the scrolling animation to complete
					await Page.delay(6000);
					// Step 3: Verify that the 15th tab is visible within the viewport
					expect(await tabs[14].isDisplayed({withinViewport: true})).toBe(true);
					// Step 4: Move the pointer to the 10th tab
					await tabs[9].moveTo({xOffset: -200, yOffset: 0});
					// Step 5: Wait for the scrolling animation to complete
					await Page.delay(6000);
					// Step 6: Verify that the 1st tab is visible within the viewport
					expect(await tabs[0].isDisplayed({withinViewport: true})).toBe(true);
				});
			});
		});
	});
});
