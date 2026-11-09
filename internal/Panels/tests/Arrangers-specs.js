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

	describe('with motion tokens', () => {
		const easeOut = 'cubic-bezier(0.1, 0.6, 0.15, 1)';
		const easeIn = 'cubic-bezier(0.4, 0, 1, 1)';
		let motions;

		const createMockElement = () => ({...createMockNode(), nodeType: 1});

		beforeEach(() => {
			motions = {
				'--lime-view-enter-motion': `transform 450ms 0ms ${easeOut}, opacity 300ms 0ms ${easeOut}`,
				'--lime-view-exit-motion': `transform 300ms 0ms ${easeIn}, opacity 250ms 0ms ${easeIn}`
			};
			window.requestIdleCallback = jest.fn((callback) => callback());
			jest.spyOn(window, 'getComputedStyle').mockImplementation(() => ({
				getPropertyValue: (name) => motions[name] || ''
			}));
		});

		afterEach(() => {
			delete window.requestIdleCallback;
			jest.restoreAllMocks();
		});

		test('should animate each property of BasicArranger with the timing of the enter motion', () => {
			const node = createMockElement();

			BasicArranger.enter({node, duration: 300, reverse: false, rtl: false});

			const [keyframes, options] = node.animate.mock.calls[0];

			expect(keyframes).toEqual([
				{transform: 'translateX(100%)', offset: 0, easing: easeOut},
				{opacity: 0, offset: 0, easing: easeOut},
				{opacity: 1, offset: 300 / 450},
				{transform: 'none', offset: 1},
				{opacity: 1, offset: 1}
			]);
			expect(options).toMatchObject({duration: 450, direction: 'normal'});
			expect(options.easing).toBeUndefined();
		});

		test('should hold the starting values of BasicArranger during the delay of the motion', () => {
			const node = createMockElement();
			motions['--lime-view-enter-motion'] = `transform 550ms 50ms ${easeOut}, opacity 470ms 130ms ${easeOut}`;

			BasicArranger.enter({node, duration: 300, reverse: false, rtl: false});

			const [keyframes, options] = node.animate.mock.calls[0];

			expect(keyframes).toEqual([
				{transform: 'translateX(100%)', offset: 0},
				{opacity: 0, offset: 0},
				{transform: 'translateX(100%)', offset: 50 / 600, easing: easeOut},
				{opacity: 0, offset: 130 / 600, easing: easeOut},
				{transform: 'none', offset: 1},
				{opacity: 1, offset: 1}
			]);
			expect(options).toMatchObject({duration: 600});
		});

		test('should set the starting values of BasicArranger before the deferred animation runs', () => {
			const node = createMockElement();
			window.requestIdleCallback = jest.fn();

			BasicArranger.enter({node, duration: 300, reverse: false, rtl: false});

			expect(node.style).toEqual({transform: 'translateX(100%)', opacity: 0});

			// flush the batched animations so the next tests aren't queued behind this one
			window.requestIdleCallback.mock.calls[0][0]();
		});

		test('should use the exit motion for the view leaving with BasicArranger', () => {
			const node = createMockElement();

			BasicArranger.leave({node, duration: 300, reverse: false, rtl: false});

			const [keyframes, options] = node.animate.mock.calls[0];

			expect(keyframes).toEqual([
				{transform: 'none', offset: 0, easing: easeIn},
				{opacity: 1, offset: 0, easing: easeIn},
				{opacity: 0, offset: 250 / 300},
				{transform: 'translateX(-100%)', offset: 1},
				{opacity: 0, offset: 1}
			]);
			expect(options).toMatchObject({duration: 300});
		});

		test('should use the enter motion instead of the reversed exit motion for a reverse transition', () => {
			const node = createMockElement();

			BasicArranger.leave({node, duration: 300, reverse: true, rtl: false});

			const [keyframes, options] = node.animate.mock.calls[0];

			expect(keyframes[0]).toEqual({transform: 'translateX(-100%)', offset: 0, easing: easeOut});
			expect(keyframes[keyframes.length - 2]).toEqual({transform: 'none', offset: 1});
			expect(options).toMatchObject({duration: 450, direction: 'normal'});
		});

		test('should animate only the properties set in the motion', () => {
			const node = createMockElement();
			motions['--lime-view-exit-motion'] = `opacity 250ms 0ms ${easeIn}`;

			BasicArranger.leave({node, duration: 300, reverse: false, rtl: false});

			const [keyframes, options] = node.animate.mock.calls[0];

			expect(keyframes).toEqual([
				{opacity: 1, offset: 0, easing: easeIn},
				{opacity: 0, offset: 1}
			]);
			expect(options).toMatchObject({duration: 250});
		});

		test('should finish immediately with a motion without duration', () => {
			const node = createMockElement();
			motions['--lime-view-enter-motion'] = `transform 0ms 0ms ${easeOut}, opacity 0ms 0ms ${easeOut}`;

			BasicArranger.enter({node, duration: 300, reverse: false, rtl: false});

			const [, options] = node.animate.mock.calls[0];

			expect(options).toMatchObject({duration: 0});
		});

		test('should support times in seconds', () => {
			const node = createMockElement();
			motions['--lime-view-enter-motion'] = 'opacity 0.25s 0.1s linear';

			FadeArranger.enter({node, duration: 300, reverse: false, rtl: false});

			const [keyframes, options] = node.animate.mock.calls[0];

			expect(keyframes).toEqual([
				{opacity: 0, offset: 0},
				{opacity: 0, offset: 100 / 350, easing: 'linear'},
				{opacity: 1, offset: 1}
			]);
			expect(options).toMatchObject({duration: 350});
		});

		test('should fade with the opacity of the enter and exit motions in FadeArranger', () => {
			const enterNode = createMockElement();
			const leaveNode = createMockElement();
			motions['--lime-view-enter-motion'] = `opacity 250ms 0ms ${easeOut}`;
			motions['--lime-view-exit-motion'] = `opacity 250ms 0ms ${easeIn}`;

			FadeArranger.enter({node: enterNode, duration: 300, reverse: false, rtl: false});
			FadeArranger.leave({node: leaveNode, duration: 300, reverse: false, rtl: false});

			expect(enterNode.animate.mock.calls[0][0]).toEqual([
				{opacity: 0, offset: 0, easing: easeOut},
				{opacity: 1, offset: 1}
			]);
			expect(leaveNode.animate.mock.calls[0][0]).toEqual([
				{opacity: 1, offset: 0, easing: easeIn},
				{opacity: 0, offset: 1}
			]);
			expect(enterNode.animate.mock.calls[0][1]).toMatchObject({duration: 250, direction: 'normal'});
		});

		test('should slide and fade with the enter and exit motions in FadeAndSlideArranger', () => {
			const enterNode = createMockElement();
			const leaveNode = createMockElement();

			FadeAndSlideArranger.enter({node: enterNode, duration: 300, reverse: false, rtl: true});
			FadeAndSlideArranger.leave({node: leaveNode, duration: 300, reverse: false, rtl: true});

			expect(enterNode.animate.mock.calls[0][0]).toEqual([
				{transform: 'translateX(-100%)', offset: 0, easing: easeOut},
				{opacity: 0, offset: 0, easing: easeOut},
				{opacity: 1, offset: 300 / 450},
				{transform: 'none', offset: 1},
				{opacity: 1, offset: 1}
			]);
			expect(enterNode.animate.mock.calls[0][1]).toMatchObject({duration: 450, direction: 'normal'});
			expect(leaveNode.animate.mock.calls[0][0]).toEqual([
				{transform: 'none', offset: 0, easing: easeIn},
				{opacity: 1, offset: 0, easing: easeIn},
				{opacity: 0, offset: 250 / 300},
				{transform: 'translateX(100%)', offset: 1},
				{opacity: 0, offset: 1}
			]);
			expect(leaveNode.animate.mock.calls[0][1]).toMatchObject({duration: 300, direction: 'normal'});
		});

		test('should fall back to the default fade and slide in FadeAndSlideArranger when no motion is set', () => {
			const node = createMockElement();
			motions = {};

			FadeAndSlideArranger.enter({node, duration: 300, reverse: false, rtl: false});

			const [keyframes, options] = node.animate.mock.calls[0];

			expect(keyframes).toEqual([
				{transform: 'translateX(100%)', opacity: 0, offset: 0},
				{opacity: 0, offset: 0.5},
				{transform: 'none', opacity: 1, offset: 1}
			]);
			expect(options).toMatchObject({duration: 300, easing: quadInOut});
		});

		test('should slide by the distance of the motion in BasicArranger', () => {
			const enterNode = createMockElement();
			const leaveNode = createMockElement();
			motions['--lime-view-motion-distance'] = ' 25rem';

			BasicArranger.enter({node: enterNode, duration: 300, reverse: false, rtl: false});
			BasicArranger.leave({node: leaveNode, duration: 300, reverse: false, rtl: false});

			expect(enterNode.animate.mock.calls[0][0][0]).toEqual({transform: 'translateX(25rem)', offset: 0, easing: easeOut});
			expect(leaveNode.animate.mock.calls[0][0]).toContainEqual({transform: 'translateX(-25rem)', offset: 1});
		});

		test('should slide by the distance of the motion in the other direction in RTL', () => {
			const enterNode = createMockElement();
			const leaveNode = createMockElement();
			motions['--lime-view-motion-distance'] = '25rem';

			FadeAndSlideArranger.enter({node: enterNode, duration: 300, reverse: false, rtl: true});
			FadeAndSlideArranger.leave({node: leaveNode, duration: 300, reverse: false, rtl: true});

			expect(enterNode.animate.mock.calls[0][0][0]).toEqual({transform: 'translateX(-25rem)', offset: 0, easing: easeOut});
			expect(leaveNode.animate.mock.calls[0][0]).toContainEqual({transform: 'translateX(25rem)', offset: 1});
		});

		test('should negate a distance which is not a plain length with `calc()`', () => {
			const node = createMockElement();
			motions['--lime-view-motion-distance'] = 'var(--distance)';

			BasicArranger.leave({node, duration: 300, reverse: false, rtl: false});

			expect(node.animate.mock.calls[0][0]).toContainEqual({transform: 'translateX(calc(-1 * var(--distance)))', offset: 1});
		});

		test('should fall back to the default animation when no motion is set', () => {
			const node = createMockElement();
			motions = {};

			BasicArranger.enter({node, duration: 300, reverse: false, rtl: false});

			const [keyframes, options] = node.animate.mock.calls[0];

			expect(keyframes).toEqual([
				{transform: 'translateX(100%)', offset: 0},
				{transform: 'none', offset: 1}
			]);
			expect(options).toMatchObject({duration: 300, easing: quadInOut});
		});
	});
});
