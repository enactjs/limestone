const ScrollerPage = require('../ScrollerPage');
const {expectFocusedItem} = require('../Scroller-utils');

// Covers the scenario the `stickTo="start"` prop was created for: while moving focus through a
// horizontal Scroller (a "shelf" of Cards), the focus indicator stays at a fixed slot near the
// start (left) edge and the list scrolls beneath it, instead of the focused item drifting toward
// the opposite edge.
describe('Scroller with stickTo="start"', function () {
	beforeEach(async function () {
		await ScrollerPage.open('StickToStart');
	});

	it('should keep the focused item anchored at the start while the list scrolls', async function () {
		// Focus on the first card.
		await ScrollerPage.spotlightDown();
		await expectFocusedItem(0);

		// Move right into the scrollable region.
		for (let i = 0; i < 3; i++) {
			await ScrollerPage.spotlightRight();
			await ScrollerPage.delay(500);
		}
		await expectFocusedItem(3);

		const scrollerRect = await ScrollerPage.getScrollerRect();
		const focusedRectA = await ScrollerPage.getActiveElementRect();

		// Move right further.
		for (let i = 0; i < 2; i++) {
			await ScrollerPage.spotlightRight();
			await ScrollerPage.delay(500);
		}
		await expectFocusedItem(5);

		const focusedRectB = await ScrollerPage.getActiveElementRect();

		// The focus slot stays fixed near the start edge: two different cards (item 3 and item 5)
		// occupy the same horizontal position, which is only possible because the list scrolled
		// beneath them.
		expect(Math.abs(focusedRectB.left - focusedRectA.left)).toBeLessThan(5);

		// The focused card sits at the start (left) of the scroller, not drifted to the right edge.
		expect(focusedRectB.left - scrollerRect.left).toBeLessThan(focusedRectB.width);
	});
});
