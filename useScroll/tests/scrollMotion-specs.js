import {getScrollMotion, getScrollMotionWait} from '../scrollMotion';

const highTransition = 'transform 600ms 0ms cubic-bezier(0.22, 0.61, 0.36, 1)';
const lowTransition = 'transform 500ms 0ms cubic-bezier(0.22, 0.61, 0.36, 1)';

const withMotion = (transition) => {
	const node = document.createElement('div');
	if (transition != null) {
		node.style.setProperty('--lime-scroll-motion', transition);
	}
	document.body.appendChild(node);
	return node;
};

describe('scrollMotion', () => {
	const nodes = [];

	afterEach(() => {
		while (nodes.length) {
			nodes.pop().remove();
		}
	});

	const nodeWith = (transition) => {
		const node = withMotion(transition);
		nodes.push(node);
		return node;
	};

	describe('getScrollMotion', () => {
		test('should read the high tier default scroll motion', () => {
			const motion = getScrollMotion(nodeWith(highTransition));

			expect(motion.duration).toBe(600);
			expect(motion.delay).toBe(0);
			expect(motion.ease(0)).toBe(0);
			expect(motion.ease(1)).toBe(1);
			expect(motion.ease(0.5)).toBeGreaterThan(0.5);
		});

		test('should read the low tier fast scroll motion', () => {
			expect(getScrollMotion(nodeWith(lowTransition)).duration).toBe(500);
		});

		test('should accept durations in seconds and a delay', () => {
			const motion = getScrollMotion(nodeWith('transform 0.6s 30ms cubic-bezier(0.22, 0.61, 0.36, 1)'));

			expect(motion.duration).toBe(600);
			expect(motion.delay).toBe(30);
		});

		test('should ease a linear transition by its progress', () => {
			expect(getScrollMotion(nodeWith('transform 600ms 0ms linear')).ease(0.25)).toBe(0.25);
		});

		test('should return null when the transition cannot drive a scroll', () => {
			expect(getScrollMotion(nodeWith(''))).toBeNull();
			expect(getScrollMotion(nodeWith('transform ease'))).toBeNull();
			expect(getScrollMotion(nodeWith('opacity 600ms 0ms ease-out'))).toBeNull();
			expect(getScrollMotion(nodeWith('transform 600ms 0ms ease-out'))).toBeNull();
		});

		test('should return null when the node has no scroll motion', () => {
			expect(getScrollMotion(nodeWith(null))).toBeNull();
			expect(getScrollMotion(null)).toBeNull();
		});
	});

	describe('getScrollMotionWait', () => {
		test('should include the delay, duration, and end buffer', () => {
			expect(getScrollMotionWait(nodeWith('transform 600ms 0ms linear'), 500)).toBe(650);
		});

		test('should use the fallback when the node has no scroll motion', () => {
			expect(getScrollMotionWait(nodeWith(null), 500)).toBe(500);
		});
	});
});
