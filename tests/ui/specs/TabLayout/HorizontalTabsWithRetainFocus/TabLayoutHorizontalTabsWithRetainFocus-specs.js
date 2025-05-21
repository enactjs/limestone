const Page = require('../TabLayoutPage');

describe('TabLayout', function () {
	beforeEach(async function () {
		await Page.open('HorizontalTabsWithRetainFocus');
		await Page.delay(500);
	});

	describe('horizontal tabs', function () {
		describe('scrolling behavior', function () {
			describe('5-way interaction', function () {
				it('should maintain focus on the first tab on spotlight left', async function () {
					const tabs = await (await Page.tabLayout.tabsFromScroller());
					const leftButton = $('#leftButton');
					// Step 1: Wait for the first view
					await (await Page.tabLayout.view(1)).waitForExist();
					// Step 2: Check if the first tab is focused
					expect(await tabs[0].isFocused()).toBe(true);
					// Step 3: 5-way left 3 times
					for (let i = 0; i < 3; i++) {
						await Page.spotlightLeft();
					}
					// Step 4: Check if the left button is not focused
					expect(await leftButton.isFocused()).toBe(false);
				});

				it('should maintain focus on the last tab on spotlight right', async function () {
					const tabs = await (await Page.tabLayout.tabsFromScroller());
					const rightButton = $('#rightButton');
					// Step 1: 5-way right 15 times to reach the last Spottable tab
					for (let i = 0; i < 15; i++) {
						await Page.spotlightRight();
					}
					// Step 2: Wait for the last view
					await Page.delay(1000);
					await (await Page.tabLayout.view(15)).waitForExist();
					// Step 3: Check if the last tab is focused
					expect(await tabs[14].isFocused()).toBe(true);
					// Step 4: 5-way right 3 times
					for (let i = 0; i < 3; i++) {
						await Page.spotlightRight();
					}
					// Step 5: Check if the right button is not focused
					expect(await rightButton.isFocused()).toBe(false);
				});
			});
		});
	});
});
