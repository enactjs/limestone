import {BasicArranger, CrossFadeArranger, FadeAndSlideArranger, FadeArranger} from '../Arrangers';

const quadInOut = 'cubic-bezier(0.455, 0.030, 0.515, 0.955)';

const createMockNode = () => {
	const animation = {
		playState: 'running',
		onfinish: null,
		oncancel: null,
		finish: jest.fn(function () {
			this.playState = 'finished';
			if (this.onfinish) this.onfinish();
		}),
		cancel: jest.fn(function () {
			this.playState = 'idle';
			if (this.oncancel) this.oncancel();
		}),
		reverse: jest.fn()
	};

	return {
		animate: jest.fn(() => animation),
		style: {}
	};
};

describe('Panels Arrangers Specs', () => {
	describe('FadeArranger', () => {
		test('should animate a fade-in on enter when reverse is false', () => {
			const node = createMockNode();

			FadeArranger.enter({node, duration: 300, reverse: false, rtl: false});

			expect(node.animate).toHaveBeenCalledTimes(1);

			const [keyframes, options] = node.animate.mock.calls[0];

			expect(keyframes).toEqual([
				{opacity: 0, offset: 0},
				{opacity: 0, offset: 0.5},
				{opacity: 1, offset: 1}
			]);
			expect(options).toMatchObject({duration: 250, easing: 'ease-in-out', direction: 'normal'});
		});

		test('should animate a fade-out on leave when reverse is false', () => {
			const node = createMockNode();

			FadeArranger.leave({node, duration: 300, reverse: false, rtl: false});

			expect(node.animate).toHaveBeenCalledTimes(1);

			const [keyframes, options] = node.animate.mock.calls[0];

			expect(keyframes).toEqual([
				{opacity: 1, offset: 0},
				{opacity: 0, offset: 0.5},
				{opacity: 0, offset: 1}
			]);
			expect(options).toMatchObject({duration: 250, easing: 'ease-in-out', direction: 'normal'});
		});

		test('should play the animation in reverse when config.reverse is true', () => {
			const node = createMockNode();

			FadeArranger.enter({node, duration: 300, reverse: true, rtl: false});

			const [, options] = node.animate.mock.calls[0];

			expect(options).toMatchObject({direction: 'reverse'});
		});

		test('should return the underlying Animation so callers can observe completion', () => {
			const node = createMockNode();
			const handler = () => {};

			const result = FadeArranger.enter({node, duration: 300, reverse: false, rtl: false});
			result.onfinish = handler;

			const returnedAnimation = node.animate.mock.results[0].value;

			expect(returnedAnimation.onfinish).toBe(handler);
		});
	});

	describe('CrossFadeArranger', () => {
		test('should animate a fade-in on enter', () => {
			const node = createMockNode();

			CrossFadeArranger.enter({node, duration: 300, reverse: false, rtl: false});

			const [keyframes, options] = node.animate.mock.calls[0];

			expect(keyframes).toEqual([
				{opacity: 0, offset: 0},
				{opacity: 0, offset: 0.5},
				{opacity: 1, offset: 1}
			]);
			expect(options).toMatchObject({duration: 300, easing: quadInOut, direction: 'normal'});
		});

		test('should animate a fade-out on leave', () => {
			const node = createMockNode();

			CrossFadeArranger.leave({node, duration: 300, reverse: false, rtl: false});

			const [keyframes] = node.animate.mock.calls[0];

			expect(keyframes).toEqual([
				{opacity: 1, offset: 0},
				{opacity: 0, offset: 0.5},
				{opacity: 0, offset: 1}
			]);
		});

		test('should play the animation in reverse when config.reverse is true', () => {
			const node = createMockNode();

			CrossFadeArranger.leave({node, duration: 300, reverse: true, rtl: false});

			const [, options] = node.animate.mock.calls[0];

			expect(options).toMatchObject({direction: 'reverse'});
		});
	});

	describe('FadeAndSlideArranger', () => {
		test('should animate a slide-and-fade-in on enter', () => {
			const node = createMockNode();

			FadeAndSlideArranger.enter({node, duration: 300, reverse: false, rtl: false});

			const [keyframes, options] = node.animate.mock.calls[0];

			expect(keyframes).toEqual([
				{transform: 'translateX(100%)', opacity: 0, offset: 0},
				{opacity: 0, offset: 0.5},
				{transform: 'none', opacity: 1, offset: 1}
			]);
			expect(options).toMatchObject({duration: 300, easing: quadInOut, direction: 'normal'});
		});

		test('should animate a slide-and-fade-out on leave', () => {
			const node = createMockNode();

			FadeAndSlideArranger.leave({node, duration: 300, reverse: false, rtl: false});

			const [keyframes] = node.animate.mock.calls[0];

			expect(keyframes).toEqual([
				{transform: 'none', opacity: 1, offset: 0},
				{opacity: 0, offset: 0.5},
				{transform: 'translateX(-100%)', opacity: 0, offset: 1}
			]);
		});

		test('should flip the slide direction for rtl on enter', () => {
			const node = createMockNode();

			FadeAndSlideArranger.enter({node, duration: 300, reverse: false, rtl: true});

			const [keyframes] = node.animate.mock.calls[0];

			expect(keyframes[0]).toMatchObject({transform: 'translateX(-100%)'});
		});

		test('should flip the slide direction for rtl on leave', () => {
			const node = createMockNode();

			FadeAndSlideArranger.leave({node, duration: 300, reverse: false, rtl: true});

			const [keyframes] = node.animate.mock.calls[0];

			expect(keyframes[2]).toMatchObject({transform: 'translateX(100%)'});
		});
	});

	describe('BasicArranger', () => {
		// `BasicArranger` defers its real `node.animate()` call to `requestIdleCallback` (via
		// `AnimateOnIdle`) so multiple views can start/end together. Forcing it to run its
		// callback synchronously here lets the deferred call be asserted without fake timers.
		beforeEach(() => {
			window.requestIdleCallback = jest.fn((callback) => callback());
		});

		afterEach(() => {
			delete window.requestIdleCallback;
		});

		test('should synchronously set the starting transform before the deferred animation runs', () => {
			const node = createMockNode();

			BasicArranger.enter({node, duration: 300, reverse: false, rtl: false});

			expect(node.style.transform).toBe('translateX(100%)');
		});

		test('should flip the starting transform for rtl', () => {
			const node = createMockNode();

			BasicArranger.enter({node, duration: 300, reverse: false, rtl: true});

			expect(node.style.transform).toBe('translateX(-100%)');
		});

		test('should defer the real animation until idle and animate with the full keyframe set', () => {
			const node = createMockNode();

			BasicArranger.enter({node, duration: 300, reverse: false, rtl: false});

			expect(node.animate).toHaveBeenCalledTimes(1);

			const [keyframes, options] = node.animate.mock.calls[0];

			expect(keyframes).toEqual([
				{transform: 'translateX(100%)', offset: 0},
				{transform: 'none', offset: 1}
			]);
			expect(options).toMatchObject({duration: 300, direction: 'normal', fill: 'none', easing: quadInOut});
		});

		test('should animate a leave with the reverse translation', () => {
			const node = createMockNode();

			BasicArranger.leave({node, duration: 300, reverse: false, rtl: false});

			const [keyframes] = node.animate.mock.calls[0];

			expect(keyframes).toEqual([
				{transform: 'none', offset: 0},
				{transform: 'translateX(-100%)', offset: 1}
			]);
		});

		test('should update node.style.transform and notify onfinish when the underlying animation finishes', () => {
			const node = createMockNode();
			const onfinishSpy = jest.fn();

			const result = BasicArranger.enter({node, duration: 300, reverse: false, rtl: false});
			result.onfinish = onfinishSpy;

			const returnedAnimation = node.animate.mock.results[0].value;
			returnedAnimation.finish(); // simulate the browser completing the animation

			expect(node.style.transform).toBe('none');
			expect(onfinishSpy).toHaveBeenCalledTimes(1);
			expect(result.playState).toBe('finished');
		});

		test('should reset node.style.transform and notify oncancel when the underlying animation is cancelled', () => {
			const node = createMockNode();
			const oncancelSpy = jest.fn();

			const result = BasicArranger.enter({node, duration: 300, reverse: false, rtl: false});
			result.oncancel = oncancelSpy;

			const returnedAnimation = node.animate.mock.results[0].value;
			returnedAnimation.cancel(); // simulate the browser cancelling the animation

			expect(node.style.transform).toBe('translateX(100%)');
			expect(oncancelSpy).toHaveBeenCalledTimes(1);
		});

		test('should reverse the underlying animation when reverse() is called after it starts', () => {
			const node = createMockNode();

			const result = BasicArranger.enter({node, duration: 300, reverse: false, rtl: false});
			result.reverse();

			const returnedAnimation = node.animate.mock.results[0].value;

			expect(returnedAnimation.reverse).toHaveBeenCalledTimes(1);
		});
	});
});
