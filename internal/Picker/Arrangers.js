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

const carouselAnimateEnter = ({node}, amount, isHorizontal, options) => {
	const translate = isHorizontal ? 'translateX' : 'translateY';
	const {
		positionDuration = 470,
		positonDelay = 30,
		opacityDuration = 380,
		opacityDelay = 120,
		positionEasing = 'ease-out',
		opacityEasing = 'ease-out'
	} = options;

	const position = node.animate([
		{transform: `${translate}(${amount}px)`},
		{transform: `${translate}(0)`}
	], {duration: positionDuration, delay: positonDelay, easing: positionEasing, fill: 'both'});

	const opacity = node.animate([
		{opacity: 0},
		{opacity: 1}
	], {duration: opacityDuration, delay: opacityDelay, easing: opacityEasing, fill: 'both'});

	return combineCarouselAnimations(position, opacity);
};

const animateCarouselLeave = ({node}, amount, isHorizontal, options) => {
	const translate = isHorizontal ? 'translateX' : 'translateY';
	const {
		positionDuration = 500,
		opacityDuration = 250,
		positionEasing = 'ease-in-out',
		opacityEasing = 'ease-in-out'
	} = options;

	const position = node.animate([
		{transform: `${translate}(${amount}px)` }
	], {duration: positionDuration, easing: positionEasing, fill: 'both'});

	const opacity = node.animate([
		{opacity: 0}
	], {duration: opacityDuration, easing: opacityEasing, fill: 'both'});

	return combineCarouselAnimations(position, opacity);
};

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
	}
});

const FastHorizontalCarouselArranger = CarouselArranger();

const FastVerticalCarouselArranger = CarouselArranger({amount: 165, isHorizontal: false});

export {
	FastHorizontalCarouselArranger,
	FastVerticalCarouselArranger
}