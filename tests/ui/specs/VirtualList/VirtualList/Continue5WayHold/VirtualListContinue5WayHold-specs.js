const Page = require('../VirtualListPage');
const {focusById, focusedElement, holdDownKey} = require('../../VirtualList-utils');

describe('VirtualList continue5WayHold', function () {
	it('should move focus through all horizontal VirtualLists by holding down key when `continue5WayHold` is true (NXT-19990)', async function () {
		await Page.open('Continue5WayHold', '?locale=en-US&continue5WayHold=true');
		await focusById('list0-item0');
		expect(await focusedElement()).toBe('list0-item0');

		const repeatKeyDownCount = await holdDownKey(10);

		expect(await focusedElement()).toBe('list2-item0');
		expect(repeatKeyDownCount).toBeGreaterThan(0);
	});

	it('should stop focus at the second horizontal VirtualList by holding down key when `continue5WayHold` is false', async function () {
		await Page.open('Continue5WayHold', '?locale=en-US&continue5WayHold=false');
		await focusById('list0-item0');
		expect(await focusedElement()).toBe('list0-item0');

		const repeatKeyDownCount = await holdDownKey(10);

		// The first keydown is not a repeat, so focus moves once to the next list and then stops
		expect(await focusedElement()).toBe('list1-item0');
		expect(repeatKeyDownCount).toBe(0);
	});
});
