/**
 * Utilities that let JS-driven animations (Web Animations API) use the motion token system.
 *
 * Components animated by `ViewManager` arrangers (Panels, Picker, ...) cannot use CSS transitions,
 * so their `.less` file exposes the motion with `.lime-view-motions()` inside `.applyMotions()`
 * (see `styles/motion-mixins.less`):
 *
 * ```css
 * --lime-view-enter-motion: transform 470ms 30ms <EO>, opacity 380ms 120ms <EO>;
 * --lime-view-exit-motion: transform 500ms 0ms <EIO>, opacity 250ms 0ms <EIO>;
 * ```
 *
 * The arrangers read the duration, delay and easing of each transitioned property at animation
 * time, so they follow the active animation tier and any change made to the motion mixins or
 * tokens. The keyframe values (e.g. slide direction and distance) are set by the arranger.
 *
 * @module limestone/internal/util/motion
 * @private
 */

const timeRegex = /^(-?[\d.]+)(m?s)$/;

const toMilliseconds = (time) => {
	const [, amount, unit] = timeRegex.exec(time);
	return unit === 's' ? amount * 1000 : Number(amount);
};

/**
 * Splits `value` at each character matching `separator` which isn't nested in parentheses
 * (e.g. the commas of `cubic-bezier(...)`).
 *
 * @param {String} value		Value to split.
 * @param {RegExp} separator	Single character separator test.
 * @returns {String[]}			Non-empty, trimmed parts.
 * @private
 */
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

/**
 * Parses a `transition` value (e.g. `transform 450ms 0ms ease-out, opacity 300ms 0ms ease-out`)
 * into the timing of each property. Following CSS, the first time is the duration and the second
 * one the delay. Expects the property to precede the easing, as the motion mixins write it.
 *
 * @example
 * parseTransition('transform 470ms 30ms ease-out, opacity 380ms 120ms ease-out');
 * // [{property: 'transform', duration: 470, delay: 30, easing: 'ease-out'},
 * //  {property: 'opacity', duration: 380, delay: 120, easing: 'ease-out'}]
 *
 * @function
 * @param   {String}    value       `transition` value.
 * @returns {Object[]}              `{property, duration, delay, easing}` of each transition.
 * @memberof limestone/internal/util/motion
 * @private
 */
const parseTransition = (value) => splitOutsideParens(value, /,/).map((transition) => {
	const tokens = splitOutsideParens(transition, /\s/);
	const [duration = 0, delay = 0] = tokens.filter(token => timeRegex.test(token)).map(toMilliseconds);
	const [property, easing = 'ease'] = tokens.filter(token => !timeRegex.test(token));

	return {property, duration, delay, easing};
});

/**
 * Reads the motion set by `.lime-view-motions()` (styles/motion-mixins.less) for `type`
 * ('enter' | 'exit') on `node` or one of its ancestors.
 *
 * @function
 * @param   {Node}      node        The animated node.
 * @param   {String}    type        `'enter'` or `'exit'`.
 * @returns {Object[]|null}         The parsed transitions, or `null` when no motion is set.
 * @memberof limestone/internal/util/motion
 * @private
 */
const getViewMotion = (node, type) => {
	if (typeof window === 'undefined' || !node || node.nodeType !== 1) return null;

	const transitions = parseTransition(window.getComputedStyle(node).getPropertyValue(`--lime-view-${type}-motion`));

	return transitions.length ? transitions : null;
};

export {
	getViewMotion,
	parseTransition,
	splitOutsideParens
};
