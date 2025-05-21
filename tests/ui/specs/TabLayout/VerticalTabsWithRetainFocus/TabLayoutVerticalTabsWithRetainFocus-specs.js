const Page = require('../TabLayoutPage');

describe('TabLayout', function () {
	beforeEach(async function () {
		await Page.open('VerticalTabsWithRetainFocus');
		await Page.delay(500);
	});

	describe('vertical tabs', function () {
		describe('scrolling behavior', function () {
			describe('5-way interaction', function () {
				it('should maintain focus on the first tab on spotlight up', async function () {
					const tabs = await (await Page.tabLayout.tabsFromScroller());
					const upButton = $('#upButton');
					// Step 1: Wait for the first view
					await (await Page.tabLayout.view(1)).waitForExist();
					// Step 2: Check if the first tab is focused
					await Page.spotlightDown();
					await Page.spotlightUp();
					await Page.delay(500);
					expect(await Page.tabLayout.isSelectedTab(1)).toBe(true);
					expect(await tabs[1].isFocused()).toBe(true);
					// Step 3: 5-way up 3 times
					for (let i = 0; i < 3; i++) {
						await Page.spotlightUp();
					}
					// Step 4: Check if the up button is not focused
					expect(await upButton.isFocused()).toBe(false);
				});

				it('should maintain focus on the last tab on spotlight down', async function () {
					const tabs = await (await Page.tabLayout.tabsFromScroller());
					const downButton = $('#downButton');
					// Step 1: 5-way down 15 times to reach the last Spottable tab
					for (let i = 0; i < 15; i++) {
						await Page.spotlightDown();
					}
					// Step 2: Wait for the last view
					await Page.delay(1000);
					await (await Page.tabLayout.view(15)).waitForExist();
					// Step 3: Check if the last tab is focused
					expect(await tabs[15].isFocused()).toBe(true);
					// Step 4: 5-way down 3 times
					for (let i = 0; i < 3; i++) {
						await Page.spotlightDown();
					}
					// Step 5: Check if the down button is not focused
					expect(await downButton.isFocused()).toBe(false);
				});
			});
		});
	});
});
