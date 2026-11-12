import {getViewMotion, getViewMotionDistance, negateLength} from '../util/motion';

/**
 * Fallback values for the enter motion, used when no motion is set with `.lime-view-motions()`
 * (e.g. no `ThemeDecorator`). They match the values the arranger used before reading the motion
 * tokens.
 *
 * @type {Object}
 * @private
 */
const carouselInDefaults = {
	positionDelay: 30,
	positionDuration: 470,
	positionEasing: 'ease-out',
	opacityDelay: 120,
	opacityDuration: 380,
	opacityEasing: 'ease-out'
};

/**
 * Fallback values for the exit motion. See `carouselInDefaults`.
 *
 * @type {Object}
 * @private
 */
const carouselOutDefaults = {
	positionDelay: 0,
	positionDuration: 500,
	positionEasing: 'ease-in-out',
	opacityDelay: 0,
	opacityDuration: 250,
	opacityEasing: 'ease-in-out'
};

/**
 * Combines a primary animation with secondary animations so they can be controlled together.
 * `primary` should be whichever animation takes the longest to complete; it is used as the
 * source for state and finish callbacks, and the rest are snapped to their end state when it
 * finishes.
 *
 * @param {Animation} primary			Longest-running animation; used as the source for state and finish callbacks.
 * @param {...Animation} secondary		Shorter-running animations controlled alongside the primary animation.
 * @returns {Animation} 				Combined animation-like controller.
 * @private
 */
const combineCarouselAnimations = (primary, ...secondary) => ({
	get playState () {
		return primary.playState;
	},
	get onfinish () {
		return primary.onfinish;
	},
	set onfinish (fn) {
		primary.onfinish = (...args) => {
			fn(...args);
			secondary.forEach((animation) => animation.finish());
		};
	},
	finish: () => {
		primary.finish();
		secondary.forEach((animation) => animation.finish());
	},
	cancel: () => {
		primary.cancel();
		secondary.forEach((animation) => animation.cancel());
	},
	reverse: () => {
		primary.reverse();
		secondary.forEach((animation) => animation.reverse());
	}
});

/**
 * Combines the position and opacity animations, using the one that ends last as primary.
 * Since the values come from motion tokens, either one may be the longest.
 *
 * @param {Animation} position		Position animation.
 * @param {Animation} opacity		Opacity animation.
 * @param {Object} motion			Resolved motion values.
 * @returns {Animation}				Combined animation.
 * @private
 */
const combinePositionOpacity = (position, opacity, motion) => {
	const positionEnd = motion.positionDelay + motion.positionDuration;
	const opacityEnd = motion.opacityDelay + motion.opacityDuration;

	return positionEnd >= opacityEnd ?
		combineCarouselAnimations(position, opacity) :
		combineCarouselAnimations(opacity, position);
};

/**
 * Maps the animated CSS property of a transition to the prefix of the motion values.
 *
 * @type {Object}
 * @private
 */
const transitionPropertyNames = {
	transform: 'position',
	opacity: 'opacity'
};

/**
 * Converts the transitions read with `getViewMotion()` into motion values, e.g.
 * `{positionDuration, positionDelay, positionEasing, opacityDuration, ...}`.
 *
 * @param {Object[]} transitions		Parsed transitions.
 * @returns {Object}					Motion values of the transitioned properties.
 * @private
 */
const toMotionValues = (transitions) => {
	const values = {};

	transitions.forEach(({property, duration, delay, easing}) => {
		const name = transitionPropertyNames[property];

		if (name) {
			values[`${name}Duration`] = duration;
			values[`${name}Delay`] = delay;
			values[`${name}Easing`] = easing;
		}
	});

	return values;
};

/**
 * Resolves the motion values for a node: fallback defaults, then the motion set by the
 * component's styles with `.lime-view-motions()`, then explicit arranger options.
 *
 * The translation distance is the one set in the styles (see `internal/Picker/Picker.module.less`)
 * or, when none is set, the `amount` of the arranger.
 *
 * @param {HTMLElement} node			Animated node.
 * @param {String} type					Motion type ('enter' | 'exit').
 * @param {Object} defaults				Fallback values.
 * @param {Object} options				Explicit arranger options.
 * @param {Number} amount				Fallback translation distance in pixels.
 * @returns {Object}					Resolved motion values including the `distance` CSS length.
 * @private
 */
const resolveMotion = (node, type, defaults, options, amount) => ({
	...defaults,
	...toMotionValues(getViewMotion(node, type) || []),
	distance: getViewMotionDistance(node) || `${Math.abs(amount)}px`,
	...options
});

/**
 * Returns the signed translation for a carousel animation.
 *
 * @param {String} distance				Translation distance (CSS length).
 * @param {Number} direction			`1` or `-1`.
 * @param {Boolean} isHorizontal		`true` for horizontal transitions.
 * @returns {String}					CSS transform value.
 * @private
 */
const getTransform = (distance, direction, isHorizontal) => {
	const translate = isHorizontal ? 'translateX' : 'translateY';
	const negative = (isHorizontal ? 1 : -1) * direction < 0;

	return `${translate}(${negative ? negateLength(distance) : distance})`;
};

/**
 * Animates a carousel item into view with position and opacity transitions (enter motion).
 *
 * @param {Object} config				Arranger transition configuration.
 * @param {HTMLElement} config.node		Node to animate.
 * @param {Number} direction			`1` to enter from the incrementing side; `-1` from the other.
 * @param {Boolean} isHorizontal		`true` to animate horizontally; `false` to animate vertically.
 * @param {Object} motion				Resolved enter motion values.
 * @returns {Animation}					Combined enter animation.
 * @private
 */
const animateCarouselIn = ({node}, direction, isHorizontal, motion) => {
	const position = node.animate([
		{transform: getTransform(motion.distance, direction, isHorizontal)},
		{transform: `${isHorizontal ? 'translateX' : 'translateY'}(0)`}
	], {duration: motion.positionDuration, delay: motion.positionDelay, easing: motion.positionEasing, fill: 'both'});

	const opacity = node.animate([
		{opacity: 0},
		{opacity: 1}
	], {duration: motion.opacityDuration, delay: motion.opacityDelay, easing: motion.opacityEasing, fill: 'both'});

	return combinePositionOpacity(position, opacity, motion);
};

/**
 * Animates a carousel item out of view with position and opacity transitions (exit motion).
 *
 * @param {Object} config				Arranger transition configuration.
 * @param {HTMLElement} config.node		Node to animate.
 * @param {Number} direction			`1` to leave towards the incrementing side; `-1` towards the other.
 * @param {Boolean} isHorizontal		`true` to animate horizontally; `false` to animate vertically.
 * @param {Object} motion				Resolved exit motion values.
 * @returns {Animation}					Combined leave animation.
 * @private
 */
const animateCarouselOut = ({node}, direction, isHorizontal, motion) => {
	const position = node.animate([
		{transform: getTransform(motion.distance, direction, isHorizontal)}
	], {duration: motion.positionDuration, delay: motion.positionDelay, easing: motion.positionEasing, fill: 'both'});

	const opacity = node.animate([
		{opacity: 0}
	], {duration: motion.opacityDuration, delay: motion.opacityDelay, easing: motion.opacityEasing, fill: 'both'});

	return combinePositionOpacity(position, opacity, motion);
};

const animateCarouselStay = ({node}, isHorizontal) => {
	const translate = isHorizontal ? 'translateX' : 'translateY';

	const position = node.animate([
		{transform: `${translate}(0)`},
		{transform: `${translate}(0)`}
	], {fill: 'both'});

	const opacity = node.animate([
		{opacity: 1},
		{opacity: 1}
	], {fill: 'both'});

	return combineCarouselAnimations(position, opacity);
};

/**
 * Creates a carousel arranger that transitions panels with translation and fade animations.
 *
 * The timing (duration, delay and easing of `transform` and `opacity`) comes from the motion set
 * with `.lime-view-motions()` in the component's styles (`styles/motion-mixins.less`), e.g.:
 *
 * ```less
 * .applyMotions(
 *     .lime-view-motions(.lime-carousel-in-small-high-motion(), .lime-carousel-out-small-high-motion()),
 *     .lime-view-motions(.lime-carousel-in-small-low-motion(), .lime-carousel-out-small-low-motion())
 * );
 * ```
 *
 * Otherwise the fallback values are used. `optionsEnter` and `optionsLeave` override both.
 *
 * The translation distance is the `--lime-view-motion-distance` set by the picker's styles
 * (`@lime-picker-horizontal-motion-distance` / `@lime-picker-vertical-motion-distance`), so it
 * scales with the screen resolution. `amount` is only used when no distance is set.
 *
 * ViewManager calls `enter` for the entering view and `leave` for the leaving view, and swaps
 * them when `reverse` is set, so the entering view always gets the enter motion and the leaving
 * view always gets the exit motion.
 *
 * @param {Object} config						Carousel arranger configuration.
 * @param {Number} [config.amount=270]			Fallback translation distance in pixels.
 * @param {Boolean} [config.isHorizontal=true]	`true` for horizontal transitions; `false` for vertical transitions.
 * @param {Object} [config.optionsEnter={}]		Timing and easing overrides for the enter motion.
 * @param {Object} [config.optionsLeave={}]		Timing and easing overrides for the exit motion.
 * @returns {Arranger}							Carousel arranger configuration.
 * @private
 */
export const CarouselArranger = ({amount = 270, isHorizontal = true, optionsEnter = {}, optionsLeave = {}} = {}) => {
	const carouselIn = (config, direction) => animateCarouselIn(
		config, direction, isHorizontal,
		resolveMotion(config.node, 'enter', carouselInDefaults, optionsEnter, amount)
	);
	const carouselOut = (config, direction) => animateCarouselOut(
		config, direction, isHorizontal,
		resolveMotion(config.node, 'exit', carouselOutDefaults, optionsLeave, amount)
	);

	return {
		// entering view (or the leaving view when reversed)
		enter: (config) => (config.reverse ? carouselOut(config, 1) : carouselIn(config, 1)),
		// leaving view (or the entering view when reversed)
		leave: (config) => (config.reverse ? carouselIn(config, -1) : carouselOut(config, -1)),
		stay: (config) => animateCarouselStay(config, isHorizontal)
	};
};

/**
 * Fast horizontal carousel arranger. Without a distance set in the styles, it translates by 270px.
 *
 * @type {Arranger}
 * @private
 */
const FastHorizontalCarouselArranger = CarouselArranger();

/**
 * Fast vertical carousel arranger. Without a distance set in the styles, it translates by 165px.
 *
 * @type {Arranger}
 * @private
 */
const FastVerticalCarouselArranger = CarouselArranger({amount: 165, isHorizontal: false});

export {
	FastHorizontalCarouselArranger,
	FastVerticalCarouselArranger
};
