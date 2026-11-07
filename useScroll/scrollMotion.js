/**
 * Reads the scroll motion published by `.lime-scroll-motions()`.
 *
 * The scroller (`@enact/ui/useScroll`) applies the duration, delay and easing. Scroll distance
 * stays with the scroller.
 *
 * @module limestone/useScroll/scrollMotion
 * @private
 */

import utilAnimation from '@enact/ui/useScroll/utilAnimation';

import {parseTransition} from '../internal/util/motion';

const scrollMotionProperty = '--lime-scroll-motion';

// Extra wait so a position read after the transition sees the final frame, not the one before it.
const scrollMotionEndBuffer = 50;

const bezierRegex = /cubic-bezier\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\)/;

const clampProgress = (progress) => Math.min(Math.max(progress, 0), 1);

// Builds the 0..1 ease for one cubic-bezier. A held key is eased by the scroller, not here.
const createEase = (easing) => {
	const bezier = bezierRegex.exec(easing);
	if (bezier) {
		const curve = utilAnimation(Number(bezier[1]), Number(bezier[2]), Number(bezier[3]), Number(bezier[4]));
		return (progress) => {
			const t = clampProgress(progress);
			if (t === 0 || t === 1) return t;
			return curve.cubicBezier(t);
		};
	}

	if (easing === 'linear') return clampProgress;

	return null;
};

/**
 * Reads the motion set by `.lime-scroll-motions()` (styles/motion-mixins.less) on `node`.
 *
 * @function
 * @param   {Node}      node    The scroll container.
 * @returns {Object|null}       `{delay, duration, ease}`, or `null` when no scroll motion is set.
 * @memberof limestone/useScroll/scrollMotion
 * @private
 */
const getScrollMotion = (node) => {
	if (typeof window === 'undefined' || !node || node.nodeType !== 1) return null;

	const transition = parseTransition(window.getComputedStyle(node).getPropertyValue(scrollMotionProperty))
		.find(({property}) => property === 'transform');
	if (!transition) return null;

	const ease = createEase(transition.easing);
	if (!ease) return null;

	return {delay: transition.delay, duration: transition.duration, ease};
};

/**
 * How long to wait for a scroll driven by the motion token to finish.
 *
 * @function
 * @param   {Node}      node        The scroll container.
 * @param   {Number}    fallback    Wait used when the node has no scroll motion.
 * @returns {Number}                Delay plus duration plus a small buffer, or `fallback`.
 * @memberof limestone/useScroll/scrollMotion
 * @private
 */
const getScrollMotionWait = (node, fallback) => {
	const motion = getScrollMotion(node);
	if (!motion) return fallback;

	return motion.delay + motion.duration + scrollMotionEndBuffer;
};

export {
	getScrollMotion,
	getScrollMotionWait,
	scrollMotionProperty
};
