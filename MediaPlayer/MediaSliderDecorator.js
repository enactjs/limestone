import {forKey, forward, forwardCustom, handle, oneOf, preventDefault, stopImmediate} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import platform from '@enact/core/platform';
import useHandlers from '@enact/core/useHandlers';
import {calcProportion} from '@enact/ui/Slider/utils';
import clamp from 'ramda/src/clamp';
import PropTypes from 'prop-types';
import {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';

const STEP = 0.05;

// Event handlers. Each receives (ev, props, context) from useHandlers, where context holds
// the component's imperative methods (track, untrack, increment, ...).
const handlers = {
	onBlur: handle(
		forward('onBlur'),
		(ev, props, {untrack}) => untrack()
	),

	onFocus: handle(
		forward('onFocus'),
		(ev, props, {track}) => track(ev.target)
	),

	onKeyDown: handle(
		forward('onKeyDown'),
		(ev, props, {isTracking}) => isTracking(),
		// if tracking and the key is left/right update the preview x position
		oneOf(
			[forKey('left'), (ev, props, {decrement}) => {
				decrement();
				return true;
			}],
			[forKey('right'), (ev, props, {increment}) => {
				increment();
				return true;
			}]
		),
		// if we handled left or right, preventDefault to prevent browser scroll behavior
		preventDefault,
		// stopImmediate to prevent spotlight handling
		stopImmediate
	),

	onKeyUp: handle(
		forward('onKeyUp'),
		(ev, props, {isTracking}) => isTracking(),
		forKey('enter'),
		// prevent limestone/Slider from activating the knob
		preventDefault,
		(ev, props, {getEventPayload}) => forwardCustom('onChange', payload => payload)(getEventPayload(), props)
	)
};

/**
 * MediaSlider for {@link limestone/VideoPlayer}.
 *
 * @class MediaSliderDecorator
 * @memberof limestone/MediaPlayer
 * @hoc
 * @private
 */
const MediaSliderDecorator = hoc((config, Wrapped) => {
	const Decorator = (props) => {
		const {selection, ...rest} = props;
		let {backgroundProgress} = props;
		let progressAnchor = 0;

		const [tracking, setTracking] = useState(false);
		const [x, setX] = useState(0);

		// Refs mirror values that must be read synchronously inside handlers
		// (the class version read this.state directly).
		const trackingRef = useRef(false);
		const boundsRef = useRef({minX: 0, maxX: 0});
		const xRef = useRef(x);
		const propsRef = useRef(props);
		const prevXRef = useRef(x);

		// Keep refs in sync after each render (refs must not be written during render).
		// A layout effect runs before any user event can reach the handlers.
		useLayoutEffect(() => {
			xRef.current = x;
			propsRef.current = props;
		});

		// Equivalent of componentDidUpdate: notify onKnobMove when x changes (not on mount)
		useEffect(() => {
			if (prevXRef.current !== x) {
				prevXRef.current = x;
				forwardCustom('onKnobMove', ev => ev)({value: x, proportion: x}, propsRef.current);
			}
		}, [x]);

		const getEventPayload = useCallback(() => ({
			value: xRef.current,
			proportion: xRef.current
		}), []);

		const track = useCallback((target) => {
			const bounds = target.getBoundingClientRect();

			boundsRef.current = {minX: bounds.left, maxX: bounds.right};
			trackingRef.current = true;
			setTracking(true);
			setX(propsRef.current.value);
		}, []);

		const untrack = useCallback(() => {
			boundsRef.current = {minX: 0, maxX: 0};
			trackingRef.current = false;
			setTracking(false);
		}, []);

		const move = useCallback((clientX) => {
			const {minX, maxX} = boundsRef.current;
			const value = clamp(minX, maxX, clientX);

			setX(calcProportion(minX, maxX, value));
		}, []);

		const decrement = useCallback(() => {
			setX(prevX => (trackingRef.current && prevX > 0 ? Math.max(0, prevX - STEP) : prevX));
		}, []);

		const increment = useCallback(() => {
			setX(prevX => (trackingRef.current && prevX < 1 ? Math.min(1, prevX + STEP) : prevX));
		}, []);

		const isTracking = useCallback(() => trackingRef.current, []);

		const handleMouseOver = useCallback((ev) => {
			if (ev.currentTarget.contains(ev.relatedTarget)) {
				return;
			}

			track(ev.currentTarget);
			move(ev.clientX);
		}, [move, track]);

		const handleMouseOut = useCallback((ev) => {
			if (ev.currentTarget.contains(ev.relatedTarget)) {
				return;
			}

			untrack();
		}, [untrack]);

		const handleMouseMove = useCallback((ev) => {
			move(ev.clientX);
		}, [move]);

		const handleTouchMove = useCallback((ev) => {
			// ignores multi touch
			move(ev.touches[0].clientX);
		}, [move]);

		const boundHandlers = useHandlers(handlers, props, {
			decrement,
			getEventPayload,
			increment,
			isTracking,
			track,
			untrack
		});

		if (selection != null && selection.length > 0) {
			// extracts both values from selection, defaulting backgroundProgress to
			// progressAnchor if not defined
			[progressAnchor, backgroundProgress = progressAnchor] = selection;
		}

		delete rest.onKnobMove;

		if (platform.touchEvent) {
			rest.onTouchMove = handleTouchMove;
		}

		return (
			<Wrapped
				{...rest}
				backgroundProgress={backgroundProgress}
				onBlur={boundHandlers.onBlur}
				onFocus={boundHandlers.onFocus}
				onKeyDown={boundHandlers.onKeyDown}
				onKeyUp={boundHandlers.onKeyUp}
				onMouseOver={handleMouseOver}
				onMouseOut={handleMouseOut}
				onMouseMove={handleMouseMove}
				preview={tracking}
				previewProportion={x}
				progressAnchor={progressAnchor}
			/>
		);
	};

	Decorator.displayName = 'MediaSliderDecorator';

	Decorator.propTypes = {
		backgroundProgress: PropTypes.number,
		selection: PropTypes.arrayOf(PropTypes.number),
		value: PropTypes.number
	};

	return Decorator;
});

export default MediaSliderDecorator;
export {
	MediaSliderDecorator
};
