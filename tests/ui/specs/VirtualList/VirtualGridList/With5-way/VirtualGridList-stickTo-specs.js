const {expectFocusedItem, focusedElement} = require('../../VirtualList-utils');
const Page = require('../VirtualGridListPage');

describe('VirtualGridList with stickTo="start"', function () {
	beforeEach(async function () {
		await Page.open();
	});

	it('should anchor the focused item at the start while navigating', async function () {
		// Switch to horizontal direction.
		await Page.buttonDirectionChange.moveTo();
		await Page.spotlightSelect();
		// Enable stickTo="start".
		await Page.buttonStickTo.moveTo();
		await Page.spotlightSelect();

		// Focus the first item.
		await (await Page.item(0)).moveTo();
		await Page.spotlightLeft();
		await expectFocusedItem(0);

		// Navigate right
		for (let i = 0; i < 6; i++) {
			await Page.spotlightRight();
			await Page.delay(500);
		}

		const focusedId = await focusedElement();

		expect(focusedId).not.toBe('item0');
		// The focused item is anchored at the start (top-left) of the
		// list, which is only possible because the list scrolled to bring it to that slot.
		expect(await Page.topLeftVisibleItemId()).toBe(focusedId);
	});
});
