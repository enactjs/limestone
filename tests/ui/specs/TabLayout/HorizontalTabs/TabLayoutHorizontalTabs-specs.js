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
					await Page.delay(1000);
					// check if first tab is selected
					expect(await Page.tabLayout.isSelectedTab(0)).toBe(true);
					// 5-way right 9 times to reach the last Spottable tab
					for (let i = 0; i < 9; i ++) {
						await Page.spotlightRight();
					}
					await (await Page.tabLayout.view(10)).waitForExist();
					// check if 5th tab is selected
					expect(await Page.tabLayout.isSelectedTab(9)).toBe(true);
					// check if selected tab is visible
					await expect(await $$('.TabLayout_TabGroup_tab')[9]).toBeDisplayedInViewport();
				});

				it('should focus the first Spottable tab and it should be visible', async function () {
					await Page.delay(500);
					// check if first tab is selected
					expect(await Page.tabLayout.isSelectedTab(0)).toBe(true);
					// 5-way right 9 times to reach the last Spottable tab
					for (let i = 0; i < 9; i ++) {
						await Page.spotlightRight();
					}
					await (await Page.tabLayout.view(10)).waitForExist();
					// check if 5th tab is selected
					expect(await Page.tabLayout.isSelectedTab(9)).toBe(true);
					// check if selected tab is visible
					await expect(await $$('.TabLayout_TabGroup_tab')[9]).toBeDisplayedInViewport();
					// 5-way left 9 times to reach the first tab
					for (let i = 0; i < 9; i ++) {
						await Page.spotlightLeft();
					}
					await (await Page.tabLayout.view(1)).waitForExist();
					// check if first tab is selected
					expect(await Page.tabLayout.isSelectedTab(0)).toBe(true);
					// check if selected tab is visible
					await expect(await $$('.TabLayout_TabGroup_tab')[0]).toBeDisplayedInViewport();
				})
			})

			describe('wheel interaction', function () {

			})
		})
	})
});