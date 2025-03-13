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

				it('should not focus the first and the last button outside the TabLayout', async function () {
					await Page.delay(500);
					const tabs = await $$('.TabLayout_TabGroup_tab');
					// Step 1: Move to the first tab
					tabs[0].moveTo();
					// Step 2: Wait for the first view
					await (await Page.tabLayout.view(1)).waitForExist();
					// Step 3: Check if the first tab is selected
					expect(await Page.tabLayout.isSelectedTab(0)).toBe(true);
					// Step 4: 5-way left 2 times to try to reach the last Spottable tab
					await Page.spotlightLeft();
					await Page.spotlightLeft();
					// Step 5: Check if the first tab is still selected
					expect(await Page.tabLayout.isSelectedTab(0)).toBe(true);
					// Step 6: 5-way right 15 times to reach the last Spottable tab
					for (let i = 0; i < 15; i++) {
						await Page.spotlightRight();
					}
					// Step 7: Wait for the last view
					await (await Page.tabLayout.view(15)).waitForExist();
					// Step 8: Check if the last tab is selected
					expect(await Page.tabLayout.isSelectedTab(14)).toBe(true);
					// Step 9: 5-way right 2 times to try to reach the last Spottable tab
					await Page.spotlightRight();
					await Page.spotlightRight();
					// Step 10: Check if the last tab is still selected
					expect(await Page.tabLayout.isSelectedTab(14)).toBe(true);
				});
			});

			describe('wheel interaction', function () {
				it('should focus the last Spottable tab and it should be visible', async function () {
					await Page.delay(500);
					const tabs = await $$('.TabLayout_TabGroup_tab');
					// Step 1: Trigger wheel event to scroll through the tabs
					for (let i = 0; i < 15; i++) {
						await browser.action('wheel').scroll({deltaY: 1, origin: tabs[0]}).perform();
					}
					// Step 2: Wait for the last view
					await (await Page.tabLayout.view(15)).waitForExist();
					// Step 3: Check if the last tab is selected
					expect(await Page.tabLayout.isSelectedTab(14)).toBe(true);
					// Step 4: Check if the selected tab is visible in the viewport
					expect(tabs[14]).toBeDisplayedInViewport();
				});

				it('should focus the first Spottable tab and it should be visible', async function () {
					await Page.delay(500);
					// check if first tab is selected
					const tabs = await $$('.TabLayout_TabGroup_tab');
					// Step 1: Trigger wheel event to scroll through the tabs
					for (let i = 0; i < 15; i++) {
						await browser.action('wheel').scroll({deltaY: 1, origin: tabs[0]}).perform();
					}
					// Step 2: Wait for the last view
					await (await Page.tabLayout.view(15)).waitForExist();
					// Step 3: Check if the last tab is selected
					expect(await Page.tabLayout.isSelectedTab(14)).toBe(true);
					// Step 4: Check if the selected tab is visible in the viewport
					expect(tabs[14]).toBeDisplayedInViewport();
					// Step 5: Trigger wheel event to scroll back to the first tab
					for (let i = 0; i < 15; i++) {
						await browser.action('wheel').scroll({deltaY: -1, origin: tabs[14]}).perform();
					}
					// Step 6: Wait for the first view
					await (await Page.tabLayout.view(1)).waitForExist();
					// Step 7: Check if the first tab is selected
					expect(await Page.tabLayout.isSelectedTab(0)).toBe(true);
					// Step 8: Check if the selected tab is visible in the viewport
					expect(tabs[0]).toBeDisplayedInViewport();
				});

				it('should not focus the first and the last button outside the TabLayout', async function () {
					await Page.delay(500);
					const tabs = await $$('.TabLayout_TabGroup_tab');
					// Step 1: Move to the first tab
					tabs[0].moveTo();
					// Step 2: Wait for the first view
					await (await Page.tabLayout.view(1)).waitForExist();
					// Step 3: Check if the first tab is selected
					expect(await Page.tabLayout.isSelectedTab(0)).toBe(true);
					// Step 4: Trigger wheel event to scroll up 2 times
					await browser.action('wheel').scroll({deltaY: -1, origin: tabs[0]}).perform();
					await browser.action('wheel').scroll({deltaY: -1, origin: tabs[0]}).perform();
					// Step 5: Check if the first tab is still selected
					expect(await Page.tabLayout.isSelectedTab(0)).toBe(true);
					// Step 6: Trigger wheel event to scroll down 15 times to reach the last Spottable tab
					for (let i = 0; i < 15; i++) {
						await browser.action('wheel').scroll({deltaY: 1, origin: tabs[0]}).perform();
					}
					// Step 7: Wait for the last view
					await (await Page.tabLayout.view(15)).waitForExist();
					// Step 8: Check if the last tab is selected
					expect(await Page.tabLayout.isSelectedTab(14)).toBe(true);
					// Step 9: Trigger wheel event to scroll down 2 times
					await browser.action('wheel').scroll({deltaY: 1, origin: tabs[14]}).perform();
					await browser.action('wheel').scroll({deltaY: 1, origin: tabs[14]}).perform();
					// Step 10: Check if the last tab is still selected
					expect(await Page.tabLayout.isSelectedTab(14)).toBe(true);
				});
			});

			describe('RTL locale', function () {
				beforeEach(async function () {
					await Page.open('HorizontalTabs', '?locale=ar-SA');
				});

				describe('5way interaction', function () {
					it('should focus the last Spottable tab and it should be visible', async function () {
						await Page.delay(500);
						// Step 1: 5-way left 15 times to reach the last Spottable tab
						for (let i = 0; i < 15; i++) {
							await Page.spotlightLeft();
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
						// Step 1: 5-way left 15 times to reach the last Spottable tab
						for (let i = 0; i < 15; i++) {
							await Page.spotlightLeft();
						}
						// Step 2: Wait for the last view
						await (await Page.tabLayout.view(15)).waitForExist();
						// Step 3: Check if the last tab is selected
						expect(await Page.tabLayout.isSelectedTab(14)).toBe(true);
						// Step 4: Check if the selected tab is visible in the viewport
						expect(await $$('.TabLayout_TabGroup_tab')[14]).toBeDisplayedInViewport();
						// Step 5: 5-way right 15 times to reach the first tab
						for (let i = 0; i < 15; i++) {
							await Page.spotlightRight();
						}
						// Step 6: Wait for the first view
						await (await Page.tabLayout.view(1)).waitForExist();
						// Step 7: Check if the first tab is selected
						expect(await Page.tabLayout.isSelectedTab(0)).toBe(true);
						// Step 8: Check if the selected tab is visible in the viewport
						expect(await $$('.TabLayout_TabGroup_tab')[0]).toBeDisplayedInViewport();
					});

					it('should not focus the first and the last button outside the TabLayout', async function () {
						await Page.delay(500);
						const tabs = await $$('.TabLayout_TabGroup_tab');
						// Step 1: Move to the first tab
						tabs[0].moveTo();
						// Step 2: Wait for the first view
						await (await Page.tabLayout.view(1)).waitForExist();
						// Step 3: Check if the first tab is selected
						expect(await Page.tabLayout.isSelectedTab(0)).toBe(true);
						// Step 4: 5-way right 2 times to try to reach the last Spottable tab
						await Page.spotlightRight();
						await Page.spotlightRight();
						// Step 5: Check if the first tab is still selected
						expect(await Page.tabLayout.isSelectedTab(0)).toBe(true);
						// Step 6: 5-way left 15 times to reach the last Spottable tab
						for (let i = 0; i < 15; i++) {
							await Page.spotlightLeft();
						}
						// Step 7: Wait for the last view
						await (await Page.tabLayout.view(15)).waitForExist();
						// Step 8: Check if the last tab is selected
						expect(await Page.tabLayout.isSelectedTab(14)).toBe(true);
						// Step 9: 5-way left 2 times to try to reach the last Spottable tab
						await Page.spotlightLeft();
						await Page.spotlightLeft();
						// Step 10: Check if the last tab is still selected
						expect(await Page.tabLayout.isSelectedTab(14)).toBe(true);
					});
				});

				describe('wheel interaction', function () {
					it('should focus the last Spottable tab and it should be visible', async function () {
						await Page.delay(500);
						const tabs = await $$('.TabLayout_TabGroup_tab');
						// Step 1: Trigger wheel event to scroll through the tabs
						for (let i = 0; i < 15; i++) {
							await browser.action('wheel').scroll({deltaY: 1, origin: tabs[0]}).perform();
						}
						// Step 2: Wait for the last view
						await (await Page.tabLayout.view(15)).waitForExist();
						// Step 3: Check if the last tab is selected
						expect(await Page.tabLayout.isSelectedTab(14)).toBe(true);
						// Step 4: Check if the selected tab is visible in the viewport
						expect(tabs[14]).toBeDisplayedInViewport();
					});

					it('should focus the first Spottable tab and it should be visible', async function () {
						await Page.delay(500);
						const tabs = await $$('.TabLayout_TabGroup_tab');
						// Step 1: Trigger wheel event to scroll through the tabs
						for (let i = 0; i < 15; i++) {
							await browser.action('wheel').scroll({deltaY: 1, origin: tabs[0]}).perform();
						}
						// Step 2: Wait for the last view
						await (await Page.tabLayout.view(15)).waitForExist();
						// Step 3: Check if the last tab is selected
						expect(await Page.tabLayout.isSelectedTab(14)).toBe(true);
						// Step 4: Check if the selected tab is visible in the viewport
						expect(tabs[14]).toBeDisplayedInViewport();
						// Step 5: Trigger wheel event to scroll back to the first tab
						for (let i = 0; i < 15; i++) {
							await browser.action('wheel').scroll({deltaY: -1, origin: tabs[14]}).perform();
						}
						// Step 6: Wait for the first view
						await (await Page.tabLayout.view(1)).waitForExist();
						// Step 7: Check if the first tab is selected
						expect(await Page.tabLayout.isSelectedTab(0)).toBe(true);
						// Step 8: Check if the selected tab is visible in the viewport
						expect(tabs[0]).toBeDisplayedInViewport();
					});

					it('should not focus the first and the last button outside the TabLayout', async function () {
						await Page.delay(500);
						const tabs = await $$('.TabLayout_TabGroup_tab');
						// Step 1: Move to the first tab
						tabs[0].moveTo();
						// Step 2: Wait for the first view
						await (await Page.tabLayout.view(1)).waitForExist();
						// Step 3: Check if the first tab is selected
						expect(await Page.tabLayout.isSelectedTab(0)).toBe(true);
						// Step 4: Trigger wheel event to scroll up 2 times
						await browser.action('wheel').scroll({deltaY: -1, origin: tabs[0]}).perform();
						await browser.action('wheel').scroll({deltaY: -1, origin: tabs[0]}).perform();
						// Step 5: Check if the first tab is still selected
						expect(await Page.tabLayout.isSelectedTab(0)).toBe(true);
						// Step 6: Trigger wheel event to scroll down 15 times to reach the last Spottable tab
						for (let i = 0; i < 15; i++) {
							await browser.action('wheel').scroll({deltaY: 1, origin: tabs[0]}).perform();
						}
						// Step 7: Wait for the last view
						await (await Page.tabLayout.view(15)).waitForExist();
						// Step 8: Check if the last tab is selected
						expect(await Page.tabLayout.isSelectedTab(14)).toBe(true);
						// Step 9: Trigger wheel event to scroll down 2 times
						await browser.action('wheel').scroll({deltaY: 1, origin: tabs[14]}).perform();
						await browser.action('wheel').scroll({deltaY: 1, origin: tabs[14]}).perform();
						// Step 10: Check if the last tab is still selected
						expect(await Page.tabLayout.isSelectedTab(14)).toBe(true);
					});
				});
			});
		});
	});
});
