import {checkPropTypes} from '@enact/core/util';
import PropTypes from 'prop-types';
import {addTransitionType, Children, startTransition, useCallback, useEffect, useLayoutEffect, useRef, useState, ViewTransition} from 'react';

/**
 * Transition type added when the Picker moves to the next value.
 *
 * @type {String}
 * @private
 */
export const PICKER_FORWARD = 'limestone-picker-forward';

/**
 * Transition type added when the Picker moves to the previous value.
 *
 * @type {String}
 * @private
 */
export const PICKER_BACKWARD = 'limestone-picker-backward';

/**
 * `true` when the running React version provides `<ViewTransition>` (React 19.3+). Without it,
 * the Picker changes items without animation.
 *
 * @type {Boolean}
 * @private
 */
export const supportsViewTransition = typeof ViewTransition !== 'undefined';

let warnedViewTransitionSupport = false;

/**
 * How long (ms) a running item animation is given to finish when the value changes again.
 *
 * The browser runs one view transition at a time, and React holds the next one until the current
 * one ends. Fast-forwarding keeps the Picker in step with rapid presses (as `ViewManager` did)
 * instead of stalling for the rest of the 500ms animation and then skipping values.
 *
 * @type {Number}
 * @private
 */
const FAST_FORWARD_MS = 80;

/**
 * Safety timeout (ms) for the input guard, in case a view transition never reports finishing.
 *
 * @type {Number}
 * @private
 */
const GUARD_TIMEOUT_MS = 1500;

/**
 * If the item animation has not started this long (ms) after a change, React did not run a view
 * transition (for example, the Picker is off screen), so held input is released. Starting one
 * normally takes ~40-60ms.
 *
 * @type {Number}
 * @private
 */
const READY_TIMEOUT_MS = 250;

// While a view transition starts, the browser captures the old state and sends all pointer
// input to `<html>` (~40-60ms), and React does not run event handlers until the transition is
// ready. These events, when they land on `<html>` over the Picker, are queued and re-dispatched to
// the element under the pointer inside the Picker once the animation starts...
const REROUTED_EVENTS = ['mousedown', 'mouseup', 'click', 'pointerdown', 'pointerup'];
// ...and these are dropped, so Spotlight and Touchable don't see the pointer leave the Picker.
const SWALLOWED_EVENTS = ['mousemove', 'mouseover', 'mouseout', 'pointermove', 'pointerover', 'pointerout'];
// Key events aimed at the Picker while the transition starts are held the same way. Otherwise a
// quick OK/Enter tap can release during that window, Touchable never sees the key go up, and its
// hold timer keeps changing the value.
const KEY_EVENTS = ['keydown', 'keyup'];
const GUARDED_EVENTS = REROUTED_EVENTS.concat(SWALLOWED_EVENTS, KEY_EVENTS);

const contains = (rect, x, y) => x >= rect.left && x < rect.right && y >= rect.top && y < rect.bottom;

/**
 * Finds the deepest element in `root` under the point, ignoring `pointer-events: none` (a
 * stand-in for the browser's hit testing, which is unavailable while a view transition starts).
 *
 * @param {Element} root	Picker root node.
 * @param {Number} x		Client x.
 * @param {Number} y		Client y.
 * @returns {Element|null}	Element under the point.
 * @private
 */
const hitTest = (root, x, y) => {
	let hit = null;
	const visit = (node) => {
		if (contains(node.getBoundingClientRect(), x, y) && getComputedStyle(node).pointerEvents !== 'none') {
			hit = node;
		}
		for (let i = 0; i < node.children.length; i++) {
			visit(node.children[i]);
		}
	};
	visit(root);
	return hit;
};

/**
 * Speeds up the given view transition pseudo-element animations so they end within
 * `FAST_FORWARD_MS`.
 *
 * The page root's own animation (`::view-transition-*(root)`, a 250ms cross-fade) is part of
 * every view transition and keeps it alive, so it is sped up too.
 *
 * @param {Set<String>} names	`view-transition-name`s of this Picker's items.
 * @private
 */
const fastForward = (names) => {
	if (!names.size || typeof document === 'undefined' || !document.getAnimations) return;

	document.getAnimations().forEach((animation) => {
		const pseudo = animation.effect && animation.effect.pseudoElement;
		if (!pseudo || !pseudo.startsWith('::view-transition')) return;

		const name = pseudo.slice(pseudo.indexOf('(') + 1, -1);
		if (name !== 'root' && !names.has(name)) return;

		const remaining = animation.effect.getComputedTiming().endTime - (animation.currentTime || 0);
		if (remaining > FAST_FORWARD_MS) {
			animation.updatePlaybackRate(animation.playbackRate * remaining / FAST_FORWARD_MS);
		}
	});
};

/**
 * View Transition Classes for each orientation, keyed by transition type.
 *
 * Each value is a pair of global classes: `lime-picker-vt-item` (clipping) and one that selects
 * the CSS animation for that orientation and direction (see `Picker.module.less`). They are plain
 * (non-hashed) names because the browser matches them against
 * `::view-transition-*(.<class>)` selectors. The same class serves both enter and exit: the
 * entering item only has a `::view-transition-new` and the leaving item only a
 * `::view-transition-old`.
 *
 * @type {Object}
 * @private
 */
const VIEW_TRANSITION_CLASSES = ['horizontal', 'vertical'].reduce((classes, orientation) => {
	classes[orientation] = {
		[PICKER_FORWARD]: `lime-picker-vt-item lime-picker-vt-${orientation}-forward`,
		[PICKER_BACKWARD]: `lime-picker-vt-item lime-picker-vt-${orientation}-backward`,
		default: 'none'
	};
	return classes;
}, {});

/**
 * Renders the selected Picker item inside a React `<ViewTransition>` keyed by the shown item's key.
 *
 * Like `ViewManager`, an item is identified by its React key, not by `index`: a list Picker
 * changes `index` (keys `.0`, `.1`, ...), while a range Picker (for example in `DatePicker`) keeps
 * `index` at 0 and swaps a single child keyed by its value. Either way, a new key animates.
 *
 * This replaces Enact's `ViewManager` and keeps its behavior: `index` itself is never deferred: the Picker's value, ARIA state
 * and buttons update immediately, whoever changed it (button, key, wheel, voice or the app).
 * After that commit, this component swaps the displayed item in its own Transition, tagged with
 * `addTransitionType`, which unmounts the old item (exit) and mounts the new one (enter).
 *
 * The animation is pure CSS: the transition type selects a View Transition Class whose keyframes
 * (in `Picker.module.less`) reproduce the `ViewManager` carousel arranger, so no JavaScript runs
 * per animation.
 *
 * @class PickerViewTransition
 * @memberof limestone/internal/Picker
 * @ui
 * @private
 */
const PickerViewTransition = (props) => {
	checkPropTypes(PickerViewTransition, props);

	const {children, index, orientation = 'horizontal', pickerRef, reverseTransition = false, ...rest} = props;
	const noAnimation = props.noAnimation || !supportsViewTransition;
	const items = Children.toArray(children);
	const current = items[index];
	const currentKey = current ? current.key : null;
	const [shownKey, setShownKey] = useState(currentKey);
	// The element last displayed, so a range Picker can keep showing the old value (which is no
	// longer in `children`) until its exit animation is captured.
	const lastItem = useRef(current);

	if (__DEV__ && !supportsViewTransition && !warnedViewTransitionSupport) {
		warnedViewTransitionSupport = true;
		// eslint-disable-next-line no-console
		console.warn('Picker: animations require React 19.3 or later; items change without animation.');
	}

	// Without animation, swap the item in the same render (as `ViewManager` did with `noAnimation`).
	if (noAnimation && shownKey !== currentKey) {
		setShownKey(currentKey);
	}

	const displayedKey = noAnimation ? currentKey : shownKey;
	let item = current;
	if (displayedKey !== currentKey) {
		item = items.find((child) => child.key === displayedKey) || lastItem.current;
	}

	// Transition bookkeeping, kept in refs so it never causes renders.
	const state = useRef(null);
	if (state.current === null) {
		state.current = {
			active: false,			// a transition of ours is starting or running
			names: new Set(),		// view-transition-names of our running item animations
			pendingFastForward: false,	// value changed before the running animations started
			queue: [],				// input held while the transition starts
			latestKey: currentKey,
			committedKey: displayedKey,
			guardTimer: null,
			readyTimer: null
		};
	}
	state.current.latestKey = currentKey;

	useLayoutEffect(() => {
		state.current.committedKey = displayedKey;
		lastItem.current = item;
	});

	// `target` is the original target, or `null` to find the element under the pointer.
	const redispatch = useCallback(({ev, target}) => {
		const root = pickerRef && pickerRef.current;
		const node = target || (root && hitTest(root, ev.clientX, ev.clientY));
		if (node && node.isConnected) {
			node.dispatchEvent(new ev.constructor(ev.type, ev));
		}
	}, [pickerRef]);

	const flushQueue = useCallback(() => {
		const queue = state.current.queue;
		state.current.queue = [];
		queue.forEach(redispatch);
	}, [redispatch]);

	const handleGuardedEvent = useCallback((ev) => {
		const root = pickerRef && pickerRef.current;
		if (!root) return;

		const s = state.current;
		if (KEY_EVENTS.indexOf(ev.type) >= 0) {
			// Only while starting (or behind held input, to keep order), and only for the Picker.
			if ((s.names.size && !s.queue.length) || !root.contains(ev.target)) return;

			ev.stopImmediatePropagation();
			if (ev.type === 'keydown') ev.preventDefault();
			s.queue.push({ev, target: ev.target});
			return;
		}

		const rerouted = REROUTED_EVENTS.indexOf(ev.type) >= 0;
		const starting = !s.names.size || s.queue.length;

		// A press aimed straight at the Picker while starting would be ignored by React: hold it.
		if (rerouted && starting && root.contains(ev.target)) {
			ev.stopImmediatePropagation();
			s.queue.push({ev, target: ev.target});
			return;
		}

		const html = document.documentElement;
		if (ev.target !== html && ev.relatedTarget !== html) return;
		if (!contains(root.getBoundingClientRect(), ev.clientX, ev.clientY)) return;

		ev.stopImmediatePropagation();

		if (rerouted && ev.target === html) {
			// Keep the browser from moving focus to <body>, which would blur the Picker. (Not on
			// `pointerdown`: cancelling it suppresses the `mousedown`/`mouseup` Touchable needs.)
			if (ev.type === 'mousedown') ev.preventDefault();

			if (starting) {
				// React would ignore it now, so deliver it once animating.
				s.queue.push({ev, target: null});
			} else {
				redispatch({ev, target: null});
			}
		}
	}, [pickerRef, redispatch]);

	const endGuard = useCallback(() => {
		const s = state.current;
		if (s.queue.length) {
			setTimeout(flushQueue, 0);
		}
		s.active = false;
		s.pendingFastForward = false;
		clearTimeout(s.guardTimer);
		clearTimeout(s.readyTimer);
		s.guardTimer = null;
		s.readyTimer = null;
		GUARDED_EVENTS.forEach((type) => window.removeEventListener(type, handleGuardedEvent, true));
	}, [flushQueue, handleGuardedEvent]);

	const startGuard = useCallback(() => {
		const s = state.current;
		if (!s.active) {
			s.active = true;
			GUARDED_EVENTS.forEach((type) => window.addEventListener(type, handleGuardedEvent, true));
		}
		clearTimeout(s.guardTimer);
		s.guardTimer = setTimeout(endGuard, GUARD_TIMEOUT_MS);
		clearTimeout(s.readyTimer);
		s.readyTimer = setTimeout(() => {
			if (!s.names.size) endGuard();
		}, READY_TIMEOUT_MS);
	}, [endGuard, handleGuardedEvent]);

	useEffect(() => endGuard, [endGuard]);

	// Called when the item animations start; the cleanup runs when the view transition ends.
	const trackAnimation = useCallback((instance) => {
		const s = state.current;
		s.names.add(instance.name);

		// The transition is ready, so React handles events again: deliver held input.
		if (s.queue.length) {
			setTimeout(flushQueue, 0);
		}

		if (s.pendingFastForward) {
			s.pendingFastForward = false;
			fastForward(s.names);
		}

		return () => {
			s.names.delete(instance.name);
			// Keep guarding if another transition is already queued behind this one.
			if (!s.names.size && s.committedKey === s.latestKey) {
				endGuard();
			}
		};
	}, [endGuard, flushQueue]);

	useEffect(() => {
		if (!noAnimation && shownKey !== currentKey) {
			const s = state.current;

			if (s.active) {
				// Still animating the previous change: let it finish quickly so this one starts.
				if (s.names.size) {
					fastForward(s.names);
				} else {
					s.pendingFastForward = true;
				}
			}

			if (typeof document.startViewTransition === 'function') {
				startGuard();
			}

			startTransition(() => {
				addTransitionType(reverseTransition ? PICKER_BACKWARD : PICKER_FORWARD);
				setShownKey(currentKey);
			});
		}
	}, [currentKey, noAnimation, reverseTransition, shownKey, startGuard]);

	const classes = noAnimation ? 'none' : VIEW_TRANSITION_CLASSES[orientation];

	delete rest.noAnimation;

	return (
		<div {...rest}>
			{item == null || !supportsViewTransition ? item : (
				<ViewTransition
					key={displayedKey}
					default="none"
					enter={classes}
					exit={classes}
					onEnter={trackAnimation}
					onExit={trackAnimation}
				>
					{item}
				</ViewTransition>
			)}
		</div>
	);
};

PickerViewTransition.displayName = 'PickerViewTransition';
PickerViewTransition.propTypes = /** @lends limestone/internal/Picker.PickerViewTransition.prototype */ {
	/**
	 * Index of the child to show.
	 *
	 * @type {Number}
	 * @required
	 * @private
	 */
	index: PropTypes.number.isRequired,

	/**
	 * Picker items.
	 *
	 * @type {Node}
	 * @private
	 */
	children: PropTypes.node,

	/**
	 * Disables the enter/exit animations.
	 *
	 * @type {Boolean}
	 * @private
	 */
	noAnimation: PropTypes.bool,

	/**
	 * Ref to the Picker's root node. While an item change is animating, pointer input over the
	 * Picker that the browser cannot hit test is routed back into it.
	 *
	 * @type {Object}
	 * @private
	 */
	pickerRef: PropTypes.object,

	/**
	 * Picker orientation; selects the horizontal or vertical animation.
	 *
	 * @type {('horizontal'|'vertical')}
	 * @default 'horizontal'
	 * @private
	 */
	orientation: PropTypes.oneOf(['horizontal', 'vertical']),

	/**
	 * `true` to animate backward (the new item enters from the start side), as with `ViewManager`.
	 *
	 * @type {Boolean}
	 * @default false
	 * @private
	 */
	reverseTransition: PropTypes.bool
};

export default PickerViewTransition;
export {PickerViewTransition};
