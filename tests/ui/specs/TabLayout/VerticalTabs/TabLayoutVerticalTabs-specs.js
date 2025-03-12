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
					// 5-way right 15 times to reach the last Spottable tab
					for (let i = 0; i < 15; i++) {
						await Page.spotlightDown();
					}
					await (await Page.tabLayout.view(15)).waitForExist();
					// check if 5th tab is selected
					expect(await Page.tabLayout.isSelectedTab(15)).toBe(true);
					// check if selected tab is visible
					await expect(await $$('.TabLayout_TabGroup_tab')[15]).toBeDisplayedInViewport();
				});

				it('should focus the first Spottable tab and it should be visible', async function () {
					await Page.delay(500);
					// 5-way right 9 times to reach the last Spottable tab
					for (let i = 0; i < 15; i++) {
						await Page.spotlightDown();
					}
					await (await Page.tabLayout.view(15)).waitForExist();
					// check if 5th tab is selected
					expect(await Page.tabLayout.isSelectedTab(15)).toBe(true);
					// check if selected tab is visible
					await expect(await $$('.TabLayout_TabGroup_tab')[15]).toBeDisplayedInViewport();
					// 5-way left 9 times to reach the first tab
					for (let i = 0; i < 15; i++) {
						await Page.spotlightUp();
					}
					await (await Page.tabLayout.view(1)).waitForExist();
					// check if first tab is selected
					expect(await Page.tabLayout.isSelectedTab(1)).toBe(true);
					// check if selected tab is visible
					await expect(await $$('.TabLayout_TabGroup_tab')[1]).toBeDisplayedInViewport();
				});
			});

			describe('wheel interaction', function () {
				it('should focus the last Spottable tab and it should be visible', async function () {
					await Page.delay(500);
					const tabs = await $$('.TabLayout_TabGroup_tab');
					for (let i = 0; i < 15; i++) {
						await browser.action('wheel').scroll({deltaY: 1, origin: tabs[0]}).perform();
					}
					// scroll until the last Spottable tab
					await (await Page.tabLayout.view(15)).waitForExist();
					// check if 5th tab is selected
					expect(await Page.tabLayout.isSelectedTab(15)).toBe(true);
					// check if selected tab is visible
					await expect(tabs[15]).toBeDisplayedInViewport();
				});

				it('should focus the first Spottable tab and it should be visible', async function () {
					await Page.delay(500);
					// check if first tab is selected
					const tabs = await $$('.TabLayout_TabGroup_tab');
					for (let i = 0; i < 15; i++) {
						await browser.action('wheel').scroll({deltaY: 1, origin: tabs[0]}).perform();
					}
					await (await Page.tabLayout.view(15)).waitForExist();
					// check if 5th tab is selected
					expect(await Page.tabLayout.isSelectedTab(15)).toBe(true);
					// check if selected tab is visible
					await expect(tabs[15]).toBeDisplayedInViewport();
					// 5-way left 9 times to reach the first tab
					for (let i = 0; i < 15; i++) {
						await browser.action('wheel').scroll({deltaY: -1, origin: tabs[15]}).perform();
					}
					await (await Page.tabLayout.view(1)).waitForExist();
					// check if first tab is selected
					expect(await Page.tabLayout.isSelectedTab(1)).toBe(true);
					// check if selected tab is visible
					await expect(tabs[1]).toBeDisplayedInViewport();
				});
			});

			describe('RTL locale', function () {
				beforeEach(async function () {
					await Page.open('VerticalTabs', '?locale=ar-SA');
				});

				describe('5-way interaction', function () {
					it('should focus the last Spottable tab and it should be visible', async function () {
						await Page.delay(500);
						// 5-way right 15 times to reach the last Spottable tab
						for (let i = 0; i < 15; i++) {
							await Page.spotlightDown();
						}
						await (await Page.tabLayout.view(15)).waitForExist();
						// check if 5th tab is selected
						expect(await Page.tabLayout.isSelectedTab(15)).toBe(true);
						// check if selected tab is visible
						await expect(await $$('.TabLayout_TabGroup_tab')[15]).toBeDisplayedInViewport();
					});

					it('should focus the first Spottable tab and it should be visible', async function () {
						await Page.delay(500);
						// 5-way right 15 times to reach the last Spottable tab
						for (let i = 0; i < 15; i++) {
							await Page.spotlightDown();
						}
						await (await Page.tabLayout.view(15)).waitForExist();
						// check if 5th tab is selected
						expect(await Page.tabLayout.isSelectedTab(15)).toBe(true);
						// check if selected tab is visible
						await expect(await $$('.TabLayout_TabGroup_tab')[15]).toBeDisplayedInViewport();
						// 5-way left 9 times to reach the first tab
						for (let i = 0; i < 15; i++) {
							await Page.spotlightUp();
						}
						await (await Page.tabLayout.view(1)).waitForExist();
						// check if first tab is selected
						expect(await Page.tabLayout.isSelectedTab(1)).toBe(true);
						// check if selected tab is visible
						await expect(await $$('.TabLayout_TabGroup_tab')[1]).toBeDisplayedInViewport();
					});
				});

				describe('wheel interaction', function () {
					it('should focus the last Spottable tab and it should be visible', async function () {
						await Page.delay(500);
						const tabs = await $$('.TabLayout_TabGroup_tab');
						for (let i = 0; i < 15; i++) {
							await browser.action('wheel').scroll({deltaY: 1, origin: tabs[0]}).perform();
						}
						// scroll until the last Spottable tab
						await (await Page.tabLayout.view(15)).waitForExist();
						// check if 5th tab is selected
						expect(await Page.tabLayout.isSelectedTab(15)).toBe(true);
						// check if selected tab is visible
						await expect(tabs[15]).toBeDisplayedInViewport();
					});

					it('should focus the first Spottable tab and it should be visible', async function () {
						await Page.delay(500);
						// check if first tab is selected
						const tabs = await $$('.TabLayout_TabGroup_tab');
						for (let i = 0; i < 15; i++) {
							await browser.action('wheel').scroll({deltaY: 1, origin: tabs[0]}).perform();
						}
						await (await Page.tabLayout.view(15)).waitForExist();
						// check if 15th tab is selected
						expect(await Page.tabLayout.isSelectedTab(15)).toBe(true);
						// check if selected tab is visible
						await expect(tabs[15]).toBeDisplayedInViewport();
						// 5-way left 9 times to reach the first tab
						for (let i = 0; i < 15; i++) {
							await browser.action('wheel').scroll({deltaY: -1, origin: tabs[15]}).perform();
						}
						await (await Page.tabLayout.view(1)).waitForExist();
						// check if first tab is selected
						expect(await Page.tabLayout.isSelectedTab(1)).toBe(true);
						// check if selected tab is visible
						await expect(tabs[1]).toBeDisplayedInViewport();
					});
				});
			});
		});
	});
});
