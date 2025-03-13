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

				it('should not focus the first and the last button outside the TabLayout', async function () {
					await Page.delay(500);
					const tabs = await Page.tabLayout.tabItems();
					// Step 1: Move to the first tab
					tabs[0].moveTo();
					// Step 2: Wait for the first view
					await (await Page.tabLayout.view(1)).waitForExist();
					// Step 3: Check if the first tab is selected
					expect(await Page.tabLayout.isSelectedTab(1)).toBe(true);
					// Step 4: 5-way up 2 times to try to reach the last Spottable tab
					await Page.spotlightUp();
					await Page.spotlightUp();
					// Step 5: Check if the first tab is still selected
					expect(await Page.tabLayout.isSelectedTab(1)).toBe(true);
					// Step 6: 5-way down 15 times to reach the last Spottable tab
					for (let i = 0; i < 15; i++) {
						await Page.spotlightDown();
					}
					// Step 7: Wait for the last view
					await (await Page.tabLayout.view(15)).waitForExist();
					// Step 8: Check if the last tab is selected
					expect(await Page.tabLayout.isSelectedTab(15)).toBe(true);
					// Step 9: 5-way down 2 times to try to reach the last Spottable tab
					await Page.spotlightDown();
					await Page.spotlightDown();
					// Step 10: Check if the last tab is still selected
					expect(await Page.tabLayout.isSelectedTab(15)).toBe(true);
				});
			});

			describe('wheel interaction', function () {
				it('should focus the last Spottable tab and it should be visible', async function () {
					await Page.delay(500);
					const tabs = await Page.tabLayout.tabItems();
					// Step 1: Trigger wheel event to scroll through the tabs
					for (let i = 0; i < 15; i++) {
						await browser.action('wheel').scroll({deltaY: 1, origin: tabs[0]}).perform();
					}
					// Step 2: Wait for the last view
					await (await Page.tabLayout.view(15)).waitForExist();
					// Step 3: Check if the last tab is selected
					expect(await Page.tabLayout.isSelectedTab(15)).toBe(true);
					// Step 4: Check if the selected tab is visible in the viewport
					expect(tabs[15]).toBeDisplayedInViewport();
				});

				it('should focus the first Spottable tab and it should be visible', async function () {
					await Page.delay(500);
					const tabs = await Page.tabLayout.tabItems();
					// Step 1: Trigger wheel event to scroll through the tabs
					for (let i = 0; i < 15; i++) {
						await browser.action('wheel').scroll({deltaY: 1, origin: tabs[0]}).perform();
					}
					// Step 2: Wait for the last view
					await (await Page.tabLayout.view(15)).waitForExist();
					// Step 3: Check if the last tab is selected
					expect(await Page.tabLayout.isSelectedTab(15)).toBe(true);
					// Step 4: Check if the selected tab is visible in the viewport
					expect(tabs[15]).toBeDisplayedInViewport();
					// Step 5: Trigger wheel event to scroll back to the first tab
					for (let i = 0; i < 15; i++) {
						await browser.action('wheel').scroll({deltaY: -1, origin: tabs[14]}).perform();
					}
					// Step 6: Wait for the first  view
					await (await Page.tabLayout.view(1)).waitForExist();
					// Step 7: Check if the first tab is selected
					expect(await Page.tabLayout.isSelectedTab(1)).toBe(true);
					// Step 8: Check if the selected tab is visible in the viewport
					expect(tabs[1]).toBeDisplayedInViewport();
				});

				it('should not focus the first and the last button outside the TabLayout', async function () {
					await Page.delay(500);
					const tabs = await Page.tabLayout.tabItems();
					// Step 1: Move to the first tab
					tabs[0].moveTo();
					// Step 2: Wait for the first view
					await (await Page.tabLayout.view(1)).waitForExist();
					// Step 3: Check if the first tab is selected
					expect(await Page.tabLayout.isSelectedTab(1)).toBe(true);
					// Step 4: Trigger wheel event to scroll up 2 times
					await browser.action('wheel').scroll({deltaY: -1, origin: tabs[0]}).perform();
					await browser.action('wheel').scroll({deltaY: -1, origin: tabs[0]}).perform();
					// Step 5: Check if the first tab is still selected
					expect(await Page.tabLayout.isSelectedTab(1)).toBe(true);
					// Step 6: Trigger wheel event to scroll down 15 times to reach the last Spottable tab
					for (let i = 0; i < 15; i++) {
						await browser.action('wheel').scroll({deltaY: 1, origin: tabs[0]}).perform();
					}
					// Step 7: Wait for the last view
					await (await Page.tabLayout.view(15)).waitForExist();
					// Step 8: Check if the last tab is selected
					expect(await Page.tabLayout.isSelectedTab(15)).toBe(true);
					// Step 9: Trigger wheel event to scroll down 2 times
					await browser.action('wheel').scroll({deltaY: 1, origin: tabs[14]}).perform();
					await browser.action('wheel').scroll({deltaY: 1, origin: tabs[14]}).perform();
					// Step 10: Check if the last tab is still selected
					expect(await Page.tabLayout.isSelectedTab(15)).toBe(true);
				});
			});

			describe('RTL locale', function () {
				beforeEach(async function () {
					await Page.open('VerticalTabs', '?locale=ar-SA');
				});

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

					it('should not focus the first and the last button outside the TabLayout', async function () {
						await Page.delay(500);
						const tabs = await Page.tabLayout.tabItems();
						// Step 1: Move to the first tab
						tabs[0].moveTo();
						// Step 2: Wait for the first view
						await (await Page.tabLayout.view(1)).waitForExist();
						// Step 3: Check if the first tab is selected
						expect(await Page.tabLayout.isSelectedTab(1)).toBe(true);
						// Step 4: 5-way up 2 times to try to reach the last Spottable tab
						await Page.spotlightUp();
						await Page.spotlightUp();
						// Step 5: Check if the first tab is still selected
						expect(await Page.tabLayout.isSelectedTab(1)).toBe(true);
						// Step 6: 5-way down 15 times to reach the last Spottable tab
						for (let i = 0; i < 15; i++) {
							await Page.spotlightDown();
						}
						// Step 7: Wait for the last view
						await (await Page.tabLayout.view(15)).waitForExist();
						// Step 8: Check if the last tab is selected
						expect(await Page.tabLayout.isSelectedTab(15)).toBe(true);
						// Step 9: 5-way down 2 times to try to reach the last Spottable tab
						await Page.spotlightDown();
						await Page.spotlightDown();
						// Step 10: Check if the last tab is still selected
						expect(await Page.tabLayout.isSelectedTab(15)).toBe(true);
					});
				});

				describe('wheel interaction', function () {
					it('should focus the last Spottable tab and it should be visible', async function () {
						await Page.delay(500);
						const tabs = await Page.tabLayout.tabItems();
						// Step 1: Trigger wheel event to scroll through the tabs
						for (let i = 0; i < 15; i++) {
							await browser.action('wheel').scroll({deltaY: 1, origin: tabs[0]}).perform();
						}
						// Step 2: Wait for the last view
						await (await Page.tabLayout.view(15)).waitForExist();
						// Step 3: Check if the last tab is selected
						expect(await Page.tabLayout.isSelectedTab(15)).toBe(true);
						// Step 4: Check if the selected tab is visible in the viewport
						expect(tabs[15]).toBeDisplayedInViewport();
					});

					it('should focus the first Spottable tab and it should be visible', async function () {
						await Page.delay(500);
						const tabs = await Page.tabLayout.tabItems();
						// Step 1: Trigger wheel event to scroll through the tabs
						for (let i = 0; i < 15; i++) {
							await browser.action('wheel').scroll({deltaY: 1, origin: tabs[0]}).perform();
						}
						// Step 2: Wait for the last view
						await (await Page.tabLayout.view(15)).waitForExist();
						// Step 3: Check if the last tab is selected
						expect(await Page.tabLayout.isSelectedTab(15)).toBe(true);
						// Step 4: Check if the selected tab is visible in the viewport
						expect(tabs[15]).toBeDisplayedInViewport();
						// Step 5: Trigger wheel event to scroll back to the first tab
						for (let i = 0; i < 15; i++) {
							await browser.action('wheel').scroll({deltaY: -1, origin: tabs[14]}).perform();
						}
						// Step 6: Wait for the first  view
						await (await Page.tabLayout.view(1)).waitForExist();
						// Step 7: Check if the first tab is selected
						expect(await Page.tabLayout.isSelectedTab(1)).toBe(true);
						// Step 8: Check if the selected tab is visible in the viewport
						expect(tabs[1]).toBeDisplayedInViewport();
					});

					it('should not focus the first and the last button outside the TabLayout', async function () {
						await Page.delay(500);
						const tabs = await Page.tabLayout.tabItems();
						// Step 1: Move to the first tab
						tabs[0].moveTo();
						// Step 2: Wait for the first view
						await (await Page.tabLayout.view(1)).waitForExist();
						// Step 3: Check if the first tab is selected
						expect(await Page.tabLayout.isSelectedTab(1)).toBe(true);
						// Step 4: Trigger wheel event to scroll up 2 times
						await browser.action('wheel').scroll({deltaY: -1, origin: tabs[0]}).perform();
						await browser.action('wheel').scroll({deltaY: -1, origin: tabs[0]}).perform();
						// Step 5: Check if the first tab is still selected
						expect(await Page.tabLayout.isSelectedTab(1)).toBe(true);
						// Step 6: Trigger wheel event to scroll down 15 times to reach the last Spottable tab
						for (let i = 0; i < 15; i++) {
							await browser.action('wheel').scroll({deltaY: 1, origin: tabs[0]}).perform();
						}
						// Step 7: Wait for the last view
						await (await Page.tabLayout.view(15)).waitForExist();
						// Step 8: Check if the last tab is selected
						expect(await Page.tabLayout.isSelectedTab(15)).toBe(true);
						// Step 9: Trigger wheel event to scroll down 2 times
						await browser.action('wheel').scroll({deltaY: 1, origin: tabs[14]}).perform();
						await browser.action('wheel').scroll({deltaY: 1, origin: tabs[14]}).perform();
						// Step 10: Check if the last tab is still selected
						expect(await Page.tabLayout.isSelectedTab(15)).toBe(true);
					});
				});
			});
		});
	});
});
