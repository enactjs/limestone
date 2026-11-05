import {getScrollMotion, getScrollMotionWait, installScrollMotion, parseScrollTransition} from '../scrollMotion';

const highTransition = 'transform 600ms 0ms cubic-bezier(0.22, 0.61, 0.36, 1)';
const lowTransition = 'transform 500ms 0ms cubic-bezier(0.22, 0.61, 0.36, 1)';

const setMotion = (node, value) => {
	node.style.setProperty('--lime-scroll-motion', value);
};

describe('scrollMotion', () => {
	describe('parseScrollTransition', () => {
		test('should read the high-tier default scroll timing', () => {
			const motion = parseScrollTransition(highTransition);

			expect(motion).toMatchObject({delay: 0, duration: 600});
			expect(motion.ease(0)).toBe(0);
			expect(motion.ease(1)).toBe(1);
			expect(motion.ease(0.5)).toBeGreaterThan(0.5);
		});

		test('should read the low-tier fast scroll timing', () => {
			const motion = parseScrollTransition(lowTransition);

			expect(motion).toMatchObject({delay: 0, duration: 500});
		});

		test('should convert second units and honor a delay', () => {
			const motion = parseScrollTransition('transform 0.6s 30ms cubic-bezier(0.22, 0.61, 0.36, 1)');

			expect(motion).toMatchObject({delay: 30, duration: 600});
		});

		test('should scroll linearly while a key is held', () => {
			const {timingFunction} = parseScrollTransition(highTransition);

			expect(timingFunction(0, 100, 600, 300, true)).toBe(50);
		});

		test('should accept a linear easing', () => {
			const motion = parseScrollTransition('transform 600ms 0ms linear');

			expect(motion.ease(0.25)).toBe(0.25);
		});

		test('should ignore a transition it cannot time', () => {
			expect(parseScrollTransition('')).toBeNull();
			expect(parseScrollTransition('transform ease')).toBeNull();
			expect(parseScrollTransition('opacity 600ms 0ms ease-out')).toBeNull();
		});
	});

	describe('getScrollMotion', () => {
		test('should read the custom property from an element', () => {
			const node = document.createElement('div');
			setMotion(node, highTransition);
			document.body.appendChild(node);

			expect(getScrollMotion(node)).toMatchObject({duration: 600, delay: 0});

			document.body.removeChild(node);
		});

		test('should return null when the element has no scroll motion', () => {
			const node = document.createElement('div');

			expect(getScrollMotion(node)).toBeNull();
		});
	});

	describe('installScrollMotion', () => {
		let container;

		beforeEach(() => {
			container = document.createElement('div');
			setMotion(container, highTransition);
			document.body.appendChild(container);
		});

		afterEach(() => {
			document.body.removeChild(container);
		});

		test('should scroll translate mode with the token duration and easing', () => {
			const originalTiming = jest.fn();
			const start = jest.fn();
			const handle = {animator: {timingFunction: originalTiming}, start};

			installScrollMotion({
				containerNode: container,
				scrollContainerHandle: handle,
				scrollContentHandle: null
			});

			handle.start({targetX: 10, targetY: 40});

			expect(start).toHaveBeenCalledWith({targetX: 10, targetY: 40, duration: 600});
			expect(handle.animator.timingFunction).not.toBe(originalTiming);
		});

		test('should keep a caller-supplied duration, such as a flick', () => {
			const originalTiming = jest.fn();
			const start = jest.fn();
			const handle = {animator: {timingFunction: originalTiming}, start};

			installScrollMotion({
				containerNode: container,
				scrollContainerHandle: handle,
				scrollContentHandle: null
			});

			handle.start({targetX: 10, targetY: 40, duration: 320});

			expect(start).toHaveBeenCalledWith({targetX: 10, targetY: 40, duration: 320});
			expect(handle.animator.timingFunction).toBe(originalTiming);
		});

		test('should not animate a scroll when animate is false', () => {
			const start = jest.fn();
			const handle = {start};

			installScrollMotion({
				containerNode: container,
				scrollContainerHandle: handle,
				scrollContentHandle: null
			});

			handle.start({targetX: 0, targetY: 10, animate: false});

			expect(start).toHaveBeenCalledWith({targetX: 0, targetY: 10, animate: false});
		});

		test('should wrap a start function replaced on a later commit', () => {
			const handle = {start: jest.fn()};

			installScrollMotion({
				containerNode: container,
				scrollContainerHandle: handle,
				scrollContentHandle: null
			});

			const nextStart = jest.fn();
			handle.start = nextStart;
			installScrollMotion({
				containerNode: container,
				scrollContainerHandle: handle,
				scrollContentHandle: null
			});

			handle.start({targetX: 0, targetY: 8});

			expect(nextStart).toHaveBeenCalledWith({targetX: 0, targetY: 8, duration: 600});
		});

		test('should animate a native smooth scroll with the token easing', () => {
			const frames = [];
			jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
				frames.push(callback);
				return frames.length;
			});
			jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
			jest.spyOn(window.performance, 'now').mockReturnValue(0);

			const node = document.createElement('div');
			node.scrollTo = jest.fn(({left, top}) => {
				node.scrollLeft = left;
				node.scrollTop = top;
			});
			Object.defineProperty(node, 'scrollLeft', {value: 0, writable: true});
			Object.defineProperty(node, 'scrollTop', {value: 0, writable: true});
			document.body.appendChild(node);

			const original = jest.fn();
			const contentHandle = {
				props: {scrollContentRef: {current: node}},
				getRtlPositionX: (x) => x,
				scrollAnimationId: null,
				scrollToPosition: original
			};

			installScrollMotion({
				containerNode: container,
				scrollContainerHandle: {start () {}},
				scrollContentHandle: contentHandle
			});

			contentHandle.scrollToPosition(100, 40, 'smooth', false);

			expect(original).not.toHaveBeenCalled();
			expect(contentHandle.scrolling).toBe(true);

			window.performance.now.mockReturnValue(600);
			frames[0](600);

			expect(node.scrollTo).toHaveBeenCalledWith({left: 100, top: 40, behavior: 'instant'});
			expect(contentHandle.scrolling).toBe(false);

			document.body.removeChild(node);
			window.requestAnimationFrame.mockRestore();
			window.cancelAnimationFrame.mockRestore();
			window.performance.now.mockRestore();
		});

		test('should leave a repeated native scroll on the existing path', () => {
			const original = jest.fn();
			const contentHandle = {
				props: {scrollContentRef: {current: document.createElement('div')}},
				scrollToPosition: original
			};

			installScrollMotion({
				containerNode: container,
				scrollContainerHandle: {start () {}},
				scrollContentHandle: contentHandle
			});

			contentHandle.scrollToPosition(100, 0, 'smooth', true);

			expect(original).toHaveBeenCalledWith(100, 0, 'smooth', true);
		});

		test('should leave native scrolling unchanged when no motion is set', () => {
			container.style.removeProperty('--lime-scroll-motion');
			const original = jest.fn();
			const contentHandle = {
				props: {scrollContentRef: {current: document.createElement('div')}},
				scrollToPosition: original
			};

			installScrollMotion({
				containerNode: container,
				scrollContainerHandle: {start () {}},
				scrollContentHandle: contentHandle
			});

			contentHandle.scrollToPosition(100, 0, 'smooth', false);

			expect(original).toHaveBeenCalledWith(100, 0, 'smooth', false);
		});
	});

	describe('getScrollMotionWait', () => {
		test('should wait until the token transition and a frame have finished', () => {
			const node = document.createElement('div');
			setMotion(node, highTransition);

			expect(getScrollMotionWait(node, 500)).toBe(650);
		});

		test('should use the fallback when the node has no motion', () => {
			const node = document.createElement('div');

			expect(getScrollMotionWait(node, 500)).toBe(500);
		});
	});
});
