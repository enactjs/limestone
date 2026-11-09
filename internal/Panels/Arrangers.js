import {arrange} from '@enact/ui/ViewManager';

import {getViewMotion, getViewMotionDistance} from '../util/motion';

const quadInOut = 'cubic-bezier(0.455, 0.030, 0.515, 0.955)';
const animationOptions = {easing: quadInOut};

// Properties of the first/last keyframe applied to the node while the animation is not running
const fillProperties = ['opacity', 'transform'];

// Merges the keyframes at `offset` since each animated property may have its own keyframes
const getKeyframeAt = (keyframes, offset) => Object.assign({}, ...keyframes.filter(keyframe => keyframe.offset === offset));

// Batches animations together so that all views start/end at the same time
const callbacks = [];
const idle = (callback) => {
	callbacks.push(callback);
	if (callbacks.length === 1) {
		const idleCallback = () => {
			callbacks.forEach(fn => fn());
			callbacks.length = 0;
		};

		if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
			window.requestIdleCallback(idleCallback, {timeout: 400});
		} else {
			setTimeout(idleCallback);
		}
	}
};

class AnimateOnIdle {
	constructor (node, keyframes, {duration, reverse, ...options}) {
		this.animation = null;

		// used to "fill" when the animation completes
		this.keyframes = [
			getKeyframeAt(keyframes, reverse ? 1 : 0),
			getKeyframeAt(keyframes, reverse ? 0 : 1)
		];

		this._onfinish = null;
		this._oncancel = null;
		this._reverse = false;
		this._playState = 'idle';

		this.fill(node, this.keyframes[0]);

		this.handleFinish = () => {
			this._playState = 'finished';
			this.fill(node, this.keyframes[1]);
			if (this._onfinish) this._onfinish();
		};

		this.handleCancel = () => {
			this._playState = 'finished';
			this.fill(node, this.keyframes[0]);
			if (this._oncancel) this._oncancel();
		};

		idle(() => {
			// if the animation was finished/cancelled before the idle callback occurs, bail out
			if (this._playState === 'finished') return;

			this.animation = node.animate(keyframes, {
				duration,
				direction: reverse ? 'reverse' : 'normal',
				fill: 'none',
				...options
			});

			this.animation.onfinish = this.handleFinish;
			this.animation.oncancel = this.handleCancel;

			if (this._reverse) {
				this.animation.reverse();
			}
		});
	}

	fill (node, keyframe) {
		fillProperties.forEach((property) => {
			if (property in keyframe) {
				node.style[property] = keyframe[property];
			}
		});
	}

	get playState () {
		return this.animation ? this.animation.playState : this._playState;
	}

	set onfinish (value) {
		this._onfinish = value;
	}

	set oncancel (value) {
		this._oncancel = value;
	}

	finish () {
		if (this.animation) {
			this.animation.finish();
		} else {
			this.handleFinish();
		}
	}

	cancel () {
		if (this.animation) {
			this.animation.cancel();
		} else {
			this.handleCancel();
		}
	}

	reverse () {
		// swap the first/last keyframe so we fill the correct frame
		this.keyframes.reverse();

		if (this.animation) {
			this.animation.reverse();
		} else {
			// do we need to account for re-reversing? seems unlikely but a possibility perhaps
			this._reverse = true;
		}
	}
}

const deferArrange = (config, keyframes, options) => {
	const {node, duration, reverse} = config;

	return new AnimateOnIdle(node, keyframes, {
		duration,
		reverse,
		...options
	});
};

// Builds the keyframes animating each property of `values` (`{property: [from, to]}`) with the
// duration, delay and easing of its transition. Properties without a transition are not animated.
const getMotionKeyframes = (transitions, values) => {
	const animated = transitions.filter(({property}) => property in values);
	const duration = Math.max(0, ...animated.map(({delay, duration: propertyDuration}) => delay + propertyDuration));
	const keyframes = [];

	animated.forEach(({delay, duration: propertyDuration, easing, property}) => {
		const [from, to] = values[property];
		const start = duration ? delay / duration : 0;
		const end = duration ? (delay + propertyDuration) / duration : 1;

		if (start > 0) keyframes.push({[property]: from, offset: 0});
		keyframes.push({[property]: from, offset: start, easing}, {[property]: to, offset: end});
		if (end < 1) keyframes.push({[property]: to, offset: 1});
	});

	return {duration, keyframes: keyframes.sort((a, b) => a.offset - b.offset)};
};

// Arranges a view with the motion set by `.lime-view-motions()` on one of its ancestors. Returns
// `null` when no motion is set so the arranger can fall back to its default animation.
//
// Unlike the default animations, a reverse transition isn't played backwards: the view coming into
// the viewport always uses the enter motion and the view going out always uses the exit motion.
const arrangeViewMotion = (arrangeFn, config, type, values) => {
	const {node, reverse} = config;
	const transitions = getViewMotion(node, (type === 'enter') !== reverse ? 'enter' : 'exit');

	if (!transitions) return null;

	const directedValues = {};
	Object.keys(values).forEach((property) => {
		directedValues[property] = reverse ? [...values[property]].reverse() : values[property];
	});

	const {duration, keyframes} = getMotionKeyframes(transitions, directedValues);

	return arrangeFn({...config, duration, reverse: false}, keyframes);
};

const negateLength = (length) => (/^[\d.]+[a-z%]*$/i.test(length) ? `-${length}` : `calc(-1 * ${length})`);

// Translates a view off by the distance set with `.lime-view-motions()` or, when no distance is
// set, by its full width. `toStart` moves it towards the start edge (left in LTR).
const getSlideTransform = (node, toStart) => {
	const distance = getViewMotionDistance(node) || '100%';

	return `translateX(${toStart ? negateLength(distance) : distance})`;
};

/**
 * Arranger that slides panels in from the right and out to the left.
 *
 * This arranger is visually the same as {@link ui/ViewManager.SlideLeftArranger} when transition
 * but prevents skipping transition animations under system load.
 * Because BasicArranger is an improved version of {@link ui/ViewManager.SlideLeftArranger},
 * {@link ui/ViewManager.SlideLeftArranger} can be written in documentation instead of BasicArranger in unavoidable case.
 *
 * When the views are within a container which sets the motion with `.lime-view-motions()`, the
 * `transform` and `opacity` transitions of the motion are used instead of `duration`, and the views
 * slide by the motion's distance instead of their full width.
 *
 * @type {Arranger}
 * @private
 */
const BasicArranger = {
	enter: (config) => {
		const from = getSlideTransform(config.node, config.rtl);

		return arrangeViewMotion(deferArrange, config, 'enter', {transform: [from, 'none'], opacity: [0, 1]}) ||
			deferArrange(config, [
				{transform: from, offset: 0},
				{transform: 'none', offset: 1}
			], animationOptions);
	},
	leave: (config) => {
		const to = getSlideTransform(config.node, !config.rtl);

		return arrangeViewMotion(deferArrange, config, 'leave', {transform: ['none', to], opacity: [1, 0]}) ||
			deferArrange(config, [
				{transform: 'none', offset: 0},
				{transform: to, offset: 1}
			], animationOptions);
	}
};

/**
 * Arranger that slides panels in from the right and out to the left.
 *
 * When the views are within a container which sets the motion with `.lime-view-motions()`, the
 * `transform` and `opacity` transitions of the motion are used instead of the default fade and slide,
 * and the views slide by the motion's distance instead of their full width.
 *
 * @type {Arranger}
 * @private
 */
const FadeAndSlideArranger = {
	enter: (config) => {
		const from = getSlideTransform(config.node, config.rtl);

		return arrangeViewMotion(arrange, config, 'enter', {transform: [from, 'none'], opacity: [0, 1]}) ||
			arrange(config, [
				{transform: from, opacity: 0, offset: 0},
				{opacity: 0, offset: 0.5},
				{transform: 'none', opacity: 1, offset: 1}
			], animationOptions);
	},
	leave: (config) => {
		const to = getSlideTransform(config.node, !config.rtl);

		return arrangeViewMotion(arrange, config, 'leave', {transform: ['none', to], opacity: [1, 0]}) ||
			arrange(config, [
				{transform: 'none', opacity: 1, offset: 0},
				{opacity: 0, offset: 0.5},
				{transform: to, opacity: 0, offset: 1}
			], animationOptions);
	}
};

/**
 * Arranger that cross-fade between panels.
 *
 * @type {Arranger}
 * @private
 */
const CrossFadeArranger = {
	enter: (config) => {
		return arrange(config, [
			{opacity: 0, offset: 0},
			{opacity: 0, offset: 0.5},
			{opacity: 1, offset: 1}
		], animationOptions);
	},
	leave: (config) => {
		return arrange(config, [
			{opacity: 1, offset: 0},
			{opacity: 0, offset: 0.5},
			{opacity: 0, offset: 1}
		], animationOptions);
	}
};

/**
 * Arranger that fade between panels.
 *
 * When the views are within a container which sets the motion with `.lime-view-motions()`, the
 * `opacity` transitions of the motion are used instead of the default cross-fade.
 *
 * @type {Arranger}
 * @private
 */
const FadeArranger = {
	enter: (config) => arrangeViewMotion(arrange, config, 'enter', {opacity: [0, 1]}) ||
		arrange(config, [
			{opacity: 0, offset: 0},
			{opacity: 0, offset: 0.5},
			{opacity: 1, offset: 1}
		], {duration: 250, easing: 'ease-in-out'}),
	leave: (config) => arrangeViewMotion(arrange, config, 'leave', {opacity: [1, 0]}) ||
		arrange(config, [
			{opacity: 1, offset: 0},
			{opacity: 0, offset: 0.5},
			{opacity: 0, offset: 1}
		], {duration: 250, easing: 'ease-in-out'})
};

export {
	BasicArranger,
	CrossFadeArranger,
	FadeAndSlideArranger,
	FadeArranger
};
