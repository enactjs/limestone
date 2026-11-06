/**
 * Reads the scroll motion published by `.lime-scroll-motions()` and applies its duration, delay
 * and easing to the JS scroll animation. Scroll distance stays with the scroller.
 *
 * @module limestone/useScroll/scrollMotion
 * @private
 */

import utilAnimation from '@enact/ui/useScroll/utilAnimation';

const scrollMotionProperty = '--lime-scroll-motion';

// Splits `value` at each character matching `separator` which isn't nested in parentheses.
const splitOutsideParens = (value, separator) => {
	const parts = [];
	let depth = 0, start = 0;

	for (let i = 0; i < value.length; i++) {
		if (value[i] === '(') {
			depth++;
		} else if (value[i] === ')') {
			depth--;
		} else if (depth === 0 && separator.test(value[i])) {
			parts.push(value.slice(start, i));
			start = i + 1;
		}
	}
	parts.push(value.slice(start));

	return parts.map(part => part.trim()).filter(Boolean);
};

const timeRegex = /^(-?[\d.]+)(m?s)$/;

const toMilliseconds = (time) => {
	const [, amount, unit] = timeRegex.exec(time);
	return unit === 's' ? amount * 1000 : Number(amount);
};

// Parses a `transition` value (e.g. `transform 600ms 0ms cubic-bezier(...)`) into the timing of
// each property. Expects the property to precede the easing, as the motion mixins write it.
const parseTransition = (value) => splitOutsideParens(value, /,/).map((transition) => {
	const tokens = splitOutsideParens(transition, /\s/);
	const [duration = 0, delay = 0] = tokens.filter(token => timeRegex.test(token)).map(toMilliseconds);
	const [property, easing = 'ease'] = tokens.filter(token => !timeRegex.test(token));

	return {property, duration, delay, easing};
});

// Extra wait so a position read after the transition sees the final frame, not the one before it.
const scrollMotionEndBuffer = 50;

const bezierRegex = /cubic-bezier\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\)/;

const clampProgress = (progress) => Math.min(Math.max(progress, 0), 1);

// Builds the 0..1 ease and the ScrollAnimator timing function for one cubic-bezier.
const createBezierTiming = (x1, y1, x2, y2) => {
	const curve = utilAnimation(x1, y1, x2, y2);
	const ease = (progress) => {
		const t = clampProgress(progress);
		if (t === 0 || t === 1) return t;
		return curve.cubicBezier(t);
	};

	// Matches ScrollAnimator: a held key scrolls linearly, a single step uses the curve.
	const timingFunction = (source, target, duration, curTime, keyPressed) => {
		if (!duration) return target;

		const progress = keyPressed ? curTime / duration : ease(curTime / duration);
		return (target - source) * progress + source;
	};

	return {ease, timingFunction};
};

const createLinearTiming = () => {
	const ease = (progress) => clampProgress(progress);
	const timingFunction = (source, target, duration, curTime) => {
		if (!duration) return target;
		return (target - source) * ease(curTime / duration) + source;
	};

	return {ease, timingFunction};
};

const toTiming = (transition) => {
	if (!transition) return null;

	const bezier = bezierRegex.exec(transition.easing);
	let timing = null;
	if (bezier) {
		timing = createBezierTiming(Number(bezier[1]), Number(bezier[2]), Number(bezier[3]), Number(bezier[4]));
	} else if (transition.easing === 'linear') {
		timing = createLinearTiming();
	}

	if (!timing) return null;

	return {
		delay: transition.delay,
		duration: transition.duration,
		easing: transition.easing,
		ease: timing.ease,
		timingFunction: timing.timingFunction
	};
};

// Reads the motion set by `.lime-scroll-motions()` (styles/motion-mixins.less).
// Returns `null` when the node isn't within a container which sets the motion.
const getScrollMotion = (node) => {
	if (typeof window === 'undefined' || !node || node.nodeType !== 1) return null;

	const transition = parseTransition(window.getComputedStyle(node).getPropertyValue(scrollMotionProperty))
		.find(({property}) => property === 'transform');

	return toTiming(transition);
};

// Parses a transition string. Components read the computed custom property instead.
const parseScrollTransition = (value) => {
	if (!value || typeof value !== 'string') return null;

	return toTiming(parseTransition(value).find(({property}) => property === 'transform'));
};

const clearPendingScroll = (handle) => {
	if (handle && handle.__limeScrollMotionDelay) {
		clearTimeout(handle.__limeScrollMotionDelay);
		handle.__limeScrollMotionDelay = null;
	}
};

// Translate-mode scrolls go through `start()`. A duration passed by the caller (flick) is kept.
const installTranslateScrollMotion = (handle, getMotion) => {
	if (!handle || typeof handle.start !== 'function' || handle.start.__limeScrollMotion) return;

	const originalStart = handle.start;
	const wrappedStart = (options = {}) => {
		clearPendingScroll(handle);

		const motion = getMotion();
		const animator = handle.animator;
		if (animator && !animator.__limeScrollTiming) {
			animator.__limeScrollTiming = animator.timingFunction;
		}

		const useToken = motion && options.animate !== false && options.duration == null;
		if (animator) {
			animator.timingFunction = useToken ? motion.timingFunction : animator.__limeScrollTiming;
		}
		if (!useToken) return originalStart(options);

		const start = () => originalStart({...options, duration: motion.duration});
		if (motion.delay > 0) {
			handle.__limeScrollMotionDelay = setTimeout(() => {
				handle.__limeScrollMotionDelay = null;
				start();
			}, motion.delay);
			return;
		}
		return start();
	};

	wrappedStart.__limeScrollMotion = true;
	handle.start = wrappedStart;
};

const setScrollPosition = (node, left, top) => {
	if (typeof node.scrollTo === 'function') {
		node.scrollTo({left, top, behavior: 'instant'});
	} else {
		node.scrollLeft = left;
		node.scrollTop = top;
	}
};

// `scrolling` is cleared first so the scrollend listener in useScroll accepts this event.
const finishNativeScroll = (handle, node, left, top) => {
	handle.scrollAnimationId = null;
	handle.scrolling = false;
	if (left != null && top != null) {
		setScrollPosition(node, left, top);
	}
	if (typeof node.dispatchEvent === 'function') {
		node.dispatchEvent(new Event('scrollend'));
	}
};

// Native-mode smooth scrolls are animated here so the token's duration and easing apply.
// `repeat` keeps the scroller's existing held-key path.
const installNativeScrollMotion = (contentHandle, getMotion) => {
	if (!contentHandle || typeof contentHandle.scrollToPosition !== 'function' || contentHandle.scrollToPosition.__limeScrollMotion) return;

	const originalScrollToPosition = contentHandle.scrollToPosition;
	const wrappedScrollToPosition = function (left, top, behavior, repeat) {
		const motion = getMotion();
		const node = this.props && this.props.scrollContentRef && this.props.scrollContentRef.current;

		if (behavior !== 'smooth' || repeat || !motion || !node) {
			return originalScrollToPosition.call(this, left, top, behavior, repeat);
		}
		if (motion.duration <= 0 && motion.delay <= 0) {
			return originalScrollToPosition.call(this, left, top, 'instant', repeat);
		}

		const targetLeft = typeof this.getRtlPositionX === 'function' ? this.getRtlPositionX(left) : left;
		const targetTop = top;

		const hadAnimation = !!this.scrollAnimationId;
		if (hadAnimation) {
			window.cancelAnimationFrame(this.scrollAnimationId);
			this.scrollAnimationId = null;
		}

		const startLeft = node.scrollLeft;
		const startTop = node.scrollTop;
		if (startLeft === targetLeft && startTop === targetTop) {
			// A cancelled animation must still release the scroller, or the next page key is ignored.
			if (hadAnimation) finishNativeScroll(this, node);
			return;
		}

		const startTime = window.performance.now();
		let rafId = 0;
		const step = (now) => {
			if (this.scrollAnimationId !== rafId) return;
			if (!node.isConnected) {
				this.scrollAnimationId = null;
				this.scrolling = false;
				return;
			}

			const elapsed = now - startTime - motion.delay;
			let t = 1;
			if (elapsed <= 0) {
				t = 0;
			} else if (motion.duration > 0) {
				t = Math.min(elapsed / motion.duration, 1);
			}
			const progress = motion.ease(t);

			if (t < 1) {
				setScrollPosition(
					node,
					startLeft + (targetLeft - startLeft) * progress,
					startTop + (targetTop - startTop) * progress
				);
				rafId = window.requestAnimationFrame(step);
				this.scrollAnimationId = rafId;
				return;
			}

			// Clear `scrolling` before the last scroll so `scrollend` is delivered. While it stays
			// set, useScroll ignores `scrollend` and the focused item is restored only after the
			// fallback timer, which drops the next page key.
			finishNativeScroll(this, node, targetLeft, targetTop);
		};

		this.scrolling = true;
		rafId = window.requestAnimationFrame(step);
		this.scrollAnimationId = rafId;
	};

	wrappedScrollToPosition.__limeScrollMotion = true;
	contentHandle.scrollToPosition = wrappedScrollToPosition;
};

// Hooks the container's motion into both scroll modes. Safe to call on every commit: `start`
// is reassigned by ui/useScroll each commit, while `scrollToPosition` is wrapped once.
const installScrollMotion = ({containerNode, scrollContainerHandle, scrollContentHandle}) => {
	const getMotion = () => getScrollMotion(containerNode);

	installTranslateScrollMotion(scrollContainerHandle, getMotion);
	installNativeScrollMotion(scrollContentHandle, getMotion);
};

// How long to wait after a scroll starts before treating it as finished.
const getScrollMotionWait = (node, fallback) => {
	const motion = getScrollMotion(node);
	if (!motion) return fallback;

	return motion.delay + motion.duration + scrollMotionEndBuffer;
};

export {
	getScrollMotionWait,
	installScrollMotion,
	getScrollMotion,
	parseScrollTransition,
	scrollMotionProperty
};
export default installScrollMotion;
