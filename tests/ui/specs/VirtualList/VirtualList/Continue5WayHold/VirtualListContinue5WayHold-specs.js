const Page = require('../VirtualListPage');
const {focusedElement} = require('../../VirtualList-utils');

// WebDriver cannot send auto-repeated keys, so dispatch repeat keydown events directly.
async function holdDownKey (repeatCount) {
	for (let i = 0; i < repeatCount; i++) {
		await browser.execute(function (repeat) {
			// eslint-disable-next-line no-undef
			const event = new KeyboardEvent('keydown', {bubbles: true, cancelable: true, code: 'ArrowDown', key: 'ArrowDown', keyCode: 40, repeat});
			document.activeElement.dispatchEvent(event);
		}, i > 0);
		await Page.delay(50);
	}
	await browser.execute(function () {
		// eslint-disable-next-line no-undef
		const event = new KeyboardEvent('keyup', {bubbles: true, cancelable: true, code: 'ArrowDown', key: 'ArrowDown', keyCode: 40});
		document.activeElement.dispatchEvent(event);
	});
}

async function focusFirstItem () {
	await browser.execute(function () {
		document.getElementById('list0-item0').focus();
	});
	await Page.delay(200);
}

describe('VirtualList continue5WayHold', function () {
	it('should move focus through all horizontal VirtualLists by holding down key when `continue5WayHold` is true (NXT-19990)', async function () {
		await Page.open('Continue5WayHold', '?locale=en-US&continue5WayHold=true');
		await focusFirstItem();
		expect(await focusedElement()).toBe('list0-item0');

		await holdDownKey(60);

		expect(await focusedElement()).toBe('list2-item0');
	});

	it('should stop focus at the second horizontal VirtualList by holding down key when `continue5WayHold` is false', async function () {
		await Page.open('Continue5WayHold', '?locale=en-US&continue5WayHold=false');
		await focusFirstItem();
		expect(await focusedElement()).toBe('list0-item0');

		await holdDownKey(60);

		// The first keydown is not a repeat, so focus moves once to the next list and then stops
		expect(await focusedElement()).toBe('list1-item0');
	});
});
