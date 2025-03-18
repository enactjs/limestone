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
					await Page.delay(500);
					// Step 1: 5-way right 15 times to reach the last Spottable tab
					for (let i = 0; i < 15; i++) {
						await Page.spotlightRight();
					}
					// Step 2: Wait for the last view
					await (await Page.tabLayout.view(15)).waitForExist();
					// Step 3: Check if the last tab is selected
					expect(await Page.tabLayout.isSelectedTab(14)).toBe(true);
					// Step 4: Check if the selected tab is visible in the viewport
					expect(await $$('.TabLayout_TabGroup_tab')[14]).toBeDisplayedInViewport();
				});

				it('should focus the first Spottable tab and it should be visible', async function () {
					await Page.delay(500);
					// Step 1: 5-way right 15 times to reach the last Spottable tab
					for (let i = 0; i < 15; i++) {
						await Page.spotlightRight();
					}
					// Step 2: Wait for the last view
					await (await Page.tabLayout.view(15)).waitForExist();
					// Step 3: Check if the last tab is selected
					expect(await Page.tabLayout.isSelectedTab(14)).toBe(true);
					// Step 4: Check if the selected tab is visible in the viewport
					await expect(await $$('.TabLayout_TabGroup_tab')[14]).toBeDisplayedInViewport();
					// Step 5: 5-way left 15 times to reach the first tab
					for (let i = 0; i < 15; i++) {
						await Page.spotlightLeft();
					}
					// Step 6: Wait for the first view
					await (await Page.tabLayout.view(1)).waitForExist();
					// Step 7: Check if the first tab is selected
					expect(await Page.tabLayout.isSelectedTab(0)).toBe(true);
					// Step 8: Check if the selected tab is visible in the viewport
					expect(await $$('.TabLayout_TabGroup_tab')[0]).toBeDisplayedInViewport();
				});
			});

			describe('pointer interaction', function () {
				it('should scroll to the last Spottable tab', async function () {
					const tabs = await (await Page.tabLayout.horizontalTabsFromScroller());
					tabs[4].scrollIntoView();
					tabs[4].moveTo();
					await Page.delay(4000);
					expect(tabs[14]).toBeDisplayedInViewport();
				});

				it('should scroll to the first Spottable tab', async function () {
					const tabs = await (await Page.tabLayout.horizontalTabsFromScroller());
					tabs[4].scrollIntoView();
					tabs[4].moveTo();
					await Page.delay(4000);
					expect(tabs[14]).toBeDisplayedInViewport();

					tabs[10].scrollIntoView();
					tabs[10].moveTo();
					await Page.delay(4000);
					expect(tabs[0]).toBeDisplayedInViewport();
				});
			});
		});
	});
});
