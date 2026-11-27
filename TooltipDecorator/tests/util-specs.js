import {adjustAnchor, adjustDirection, adjustTransform, calcOverflow, getLabelOffset, getPosition, getTransitionDurationInMs} from "../util";

describe('utils', () => {
	test('should convert transition duration to number', async () => {
		expect(getTransitionDurationInMs("0.2s")).toBe(200);
		expect(getTransitionDurationInMs("200ms")).toBe(200);
		expect(getTransitionDurationInMs("200")).toBe(0);
	});

	describe('adjustAnchor', () => {
		const noOverflow = {};

		test('should mirror a side anchor in RTL for a tooltip above or below', () => {
			expect(adjustAnchor('left', 'above', noOverflow, true)).toBe('right');
			expect(adjustAnchor('right', 'below', noOverflow, true)).toBe('left');
			expect(adjustAnchor('center', 'above', noOverflow, true)).toBe('center');
		});

		test('should flip a side anchor away from the edge it overflows', () => {
			expect(adjustAnchor('right', 'above', {isOverRight: 10}, false)).toBe('left');
			expect(adjustAnchor('left', 'below', {isOverLeft: -10}, false)).toBe('right');
		});

		test('should keep a center anchor even when it overflows a side', () => {
			expect(adjustAnchor('center', 'above', {isOverRight: 10}, false)).toBe('center');
		});

		test('should center the anchor of a tooltip that is too wide for the screen', () => {
			expect(adjustAnchor('left', 'above', {isOverWide: true}, false)).toBe('center');
		});

		test('should not adjust the anchor of a tooltip on the left or right', () => {
			expect(adjustAnchor('left', 'right', {isOverRight: 10, isOverWide: true}, true)).toBe('left');
		});
	});

	describe('adjustDirection', () => {
		test('should mirror a left or right tooltip in RTL', () => {
			expect(adjustDirection('left', {}, true)).toBe('right');
			expect(adjustDirection('right', {}, true)).toBe('left');
			expect(adjustDirection('above', {}, true)).toBe('above');
		});

		test('should flip a tooltip away from the edge it overflows', () => {
			expect(adjustDirection('above', {isOverTop: -10}, false)).toBe('below');
			expect(adjustDirection('below', {isOverBottom: 10}, false)).toBe('above');
			expect(adjustDirection('left', {isOverLeft: -10}, false)).toBe('right');
			expect(adjustDirection('right', {isOverRight: 10}, false)).toBe('left');
		});

		test('should not flip a side tooltip that is too wide for the screen', () => {
			expect(adjustDirection('left', {isOverLeft: -10, isOverWide: true}, false)).toBe('left');
			expect(adjustDirection('right', {isOverRight: 10, isOverWide: true}, false)).toBe('right');
		});
	});

	describe('getPosition', () => {
		const clientNode = {top: 100, bottom: 150, left: 200, right: 300, width: 100, height: 50};

		test.each([
			['above', {top: 100, left: 250}],
			['below', {top: 150, left: 250}],
			['left', {left: 200, top: 125}],
			['right', {left: 300, top: 125}],
			['unknown', {}]
		])('should position a tooltip %s the client', (direction, expected) => {
			expect(getPosition(clientNode, direction)).toEqual(expected);
		});
	});

	describe('calcOverflow', () => {
		// The test environment window is 480 x 640
		const tooltipNode = {width: 100, height: 40};

		test('should report the overflow above a client at the top of the screen', () => {
			const clientNode = {top: 10, bottom: 60, left: 190, right: 290, width: 100, height: 50};

			const overflow = calcOverflow(tooltipNode, clientNode, 'above', 0);

			expect(overflow.isOverTop).toBe(-30);
			expect(overflow.isOverBottom).toBe(false);
			expect(overflow.isOverWide).toBe(false);
		});

		test('should report the overflow to the right of a client at the right edge of the screen', () => {
			const clientNode = {top: 300, bottom: 350, left: 400, right: 480, width: 80, height: 50};

			const overflow = calcOverflow(tooltipNode, clientNode, 'right', 0);

			expect(overflow.isOverRight).toBe(100);
			expect(overflow.isOverLeft).toBe(false);
		});

		test('should report a tooltip wider than the screen', () => {
			const clientNode = {top: 300, bottom: 350, left: 200, right: 280, width: 80, height: 50};

			const overflow = calcOverflow({width: 600, height: 40}, clientNode, 'below', 0);

			expect(overflow.isOverWide).toBe(true);
		});
	});

	describe('getLabelOffset', () => {
		const tooltipNode = {width: 200};

		test('should not offset the label of a left or right tooltip', () => {
			expect(getLabelOffset(tooltipNode, 'left', {}, {isOverWide: true})).toBeNull();
		});

		test('should not offset the label of a tooltip that fits', () => {
			expect(getLabelOffset(tooltipNode, 'above', {}, {})).toBeNull();
		});

		test('should shift the label right when it overflows on the left of its center', () => {
			expect(getLabelOffset(tooltipNode, 'above', {}, {isOverCenterLeft: -20})).toBeGreaterThan(0);
		});

		test('should shift the label left when it overflows on the right of its center', () => {
			expect(getLabelOffset(tooltipNode, 'below', {}, {isOverCenterRight: 20})).toBeLessThan(0);
		});

		test('should cap the label offset to the available space', () => {
			const offset = getLabelOffset(tooltipNode, 'above', {}, {isOverCenterLeft: -10000});

			expect(offset).toBeLessThan(1);
			expect(offset).toBe(getLabelOffset(tooltipNode, 'above', {}, {isOverCenterLeft: -20000}));
		});
	});

	describe('adjustTransform', () => {
		const clientNode = {top: 0, bottom: 100, left: 0, right: 200};

		test('should keep the position when the client does not animate a transform', () => {
			const client = document.createElement('div');

			expect(adjustTransform(client, 'above', clientNode, {top: 50, left: 50})).toEqual({top: 50, left: 50});
		});

		test.each([
			['above', {top: 45, left: 50}],
			['below', {top: 55, left: 50}],
			['left', {top: 50, left: 40}],
			['right', {top: 50, left: 60}]
		])('should account for the transform of an animating client for a tooltip %s', (direction, expected) => {
			const client = document.createElement('div');
			client.style.transitionProperty = 'transform';
			client.style.transitionDuration = '0.2s';

			expect(adjustTransform(client, direction, clientNode, {top: 50, left: 50})).toEqual(expected);
		});
	});
});
