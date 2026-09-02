/**
 * Combines a primary animation with secondary animations so they can be controlled together.
 *
 * @param {Animation} primary			Animation used as the source for state and finish callbacks.
 * @param {...Animation} secondary		Additional animations controlled alongside the primary animation.
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
		primary.onfinish = fn;
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
 * Animates a carousel item into view with position and opacity transitions.
 *
 * @param {Object} config				Arranger transition configuration.
 * @param {HTMLElement} config.node		Node to animate.
 * @param {Number} amount				Starting translation amount in pixels.
 * @param {Boolean} isHorizontal		`true` to animate horizontally; `false` to animate vertically.
 * @param {Object} options				Animation timing and easing options.
 * @returns {Animation}					Combined enter animation.
 * @private
 */
const carouselAnimateEnter = ({node}, amount, isHorizontal, options) => {
	const translate = isHorizontal ? 'translateX' : 'translateY';
	const translateAmount = isHorizontal ? amount : -amount;
	const {
		positionDuration = 470,
		positonDelay = 30,
		opacityDuration = 380,
		opacityDelay = 120,
		positionEasing = 'ease-out',
		opacityEasing = 'ease-out'
	} = options;

	const position = node.animate([
		{transform: `${translate}(${translateAmount}px)`},
		{transform: `${translate}(0)`}
	], {duration: positionDuration, delay: positonDelay, easing: positionEasing, fill: 'both'});

	const opacity = node.animate([
		{opacity: 0},
		{opacity: 1}
	], {duration: opacityDuration, delay: opacityDelay, easing: opacityEasing, fill: 'both'});

	return combineCarouselAnimations(position, opacity);
};

/**
 * Animates a carousel item out of view with position and opacity transitions.
 *
 * @param {Object} config				Arranger transition configuration.
 * @param {HTMLElement} config.node		Node to animate.
 * @param {Number} amount				Ending translation amount in pixels.
 * @param {Boolean} isHorizontal		`true` to animate horizontally; `false` to animate vertically.
 * @param {Object} options				Animation timing and easing options.
 * @returns {Animation}					Combined leave animation.
 * @private
 */
const animateCarouselLeave = ({node}, amount, isHorizontal, options) => {
	const translate = isHorizontal ? 'translateX' : 'translateY';
	const translateAmount = isHorizontal ? amount : -amount;
	const {
		positionDuration = 500,
		opacityDuration = 250,
		positionEasing = 'ease-in-out',
		opacityEasing = 'ease-in-out'
	} = options;

	const position = node.animate([
		{transform: `${translate}(${translateAmount}px)`}
	], {duration: positionDuration, easing: positionEasing, fill: 'both'});

	const opacity = node.animate([
		{opacity: 0}
	], {duration: opacityDuration, easing: opacityEasing, fill: 'both'});

	return combineCarouselAnimations(position, opacity);
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
 * @param {Object} config						Carousel arranger configuration.
 * @param {Number} [config.amount=270]			Translation distance in pixels.
 * @param {Boolean} [config.isHorizontal=true]	`true` for horizontal transitions; `false` for vertical transitions.
 * @param {Object} [config.optionsEnter={}]		Timing and easing options for enter animations.
 * @param {Object} [config.optionsLeave={}]		Timing and easing options for leave animations.
 * @returns {Arranger}							Carousel arranger configuration.
 * @private
 */
export const CarouselArranger = ({amount = 270, isHorizontal = true, optionsEnter = {}, optionsLeave = {}} = {}) => ({
	enter: (config) => {
		if (config.reverse) {
			return animateCarouselLeave(config, amount, isHorizontal, optionsEnter);
		} else {
			return carouselAnimateEnter(config, amount, isHorizontal, optionsEnter);
		}
	},
	leave: (config) => {
		if (config.reverse) {
			return carouselAnimateEnter(config, -amount, isHorizontal, optionsLeave);
		} else {
			return animateCarouselLeave(config, -amount, isHorizontal, optionsLeave);
		}
	},
	stay: (config) => animateCarouselStay(config, isHorizontal)
});

/**
 * Fast horizontal carousel arranger using the default translation distance.
 *
 * @type {Arranger}
 * @private
 */
const FastHorizontalCarouselArranger = CarouselArranger();

/**
 * Fast vertical carousel arranger with a shorter translation distance.
 *
 * @type {Arranger}
 * @private
 */
const FastVerticalCarouselArranger = CarouselArranger({amount: 165, isHorizontal: false});

export {
	FastHorizontalCarouselArranger,
	FastVerticalCarouselArranger
};
