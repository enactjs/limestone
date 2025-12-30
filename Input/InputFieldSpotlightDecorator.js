import {forward, forwardCustom, forwardWithPrevent, stopImmediate} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {is} from '@enact/core/keymap';
import {getDirection, Spotlight} from '@enact/spotlight';
import Pause from '@enact/spotlight/Pause';
import Spottable from '@enact/spotlight/Spottable';
import PropTypes from 'prop-types';
import {useCallback, useEffect, useMemo, useRef} from 'react';

import {lockPointer, releasePointer} from './pointer';

const isBubbling = (ev) => ev.currentTarget !== ev.target;

// A regex to check for input types that allow selectionStart
const SELECTABLE_TYPES = /text|password|search|tel|url/;

const isSelectionAtLocation = (target, location) => {
	if (SELECTABLE_TYPES.test(target.type)) {
		return target.selectionStart === location;
	} else {
		return true;
	}
};

/**
 * Default config for {@link limestone/Input.InputSpotlightDecorator|InputSpotlightDecorator}
 *
 * @memberof limestone/Input/InputSpotlightDecorator.InputSpotlightDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Suppress the pointer lock behavior of limestone input
	 *
	 * @type {Boolean}
	 * @default false
	 * @memberof limestone/Input/InputSpotlightDecorator.InputSpotlightDecorator.defaultConfig
	*/
	noLockPointer: false
};

/**
 * A higher-order component that manages the
 * spotlight behavior for an {@link limestone/Input.Input}
 *
 * @class InputSpotlightDecorator
 * @memberof limestone/Input/InputSpotlightDecorator
 * @hoc
 * @private
 */
const InputSpotlightDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {noLockPointer} = config;
	const Component = Spottable({emulateMouse: false}, Wrapped);
	const forwardBlur = forward('onBlur');
	const forwardMouseDown = forward('onMouseDown');
	const forwardFocus = forward('onFocus');
	const forwardKeyDown = forwardWithPrevent('onKeyDown');
	const forwardKeyUp = forward('onKeyUp');

	// eslint-disable-next-line no-shadow
	const InputSpotlightDecorator = ({...props}) => {
		const downTarget = useRef(null);
		const focused = useRef(null);
		const node = useRef(null);
		const fromMouse = useRef(false);
		const prevStatus = useRef({
			focused: null,
			node: null
		});
		const paused = useMemo(() => new Pause('InputSpotlightDecorator'), []);

		const setDownTarget = useCallback((ev) => {
			const {repeat, target} = ev;

			if (!repeat) {
				downTarget.current = target;
			}
		}, []);

		const updateFocus = useCallback(() => {
			// focus node if `InputSpotlightDecorator` is pausing Spotlight or if Spotlight is paused
			if (
				node.current &&
				Spotlight.getCurrent() !== node.current &&
				(paused.isPaused() || !Spotlight.isPaused())
			) {
				if (fromMouse.current) {
					node.current.focus({preventScroll: true});
				} else {
					node.current.focus();
				}
			}

			const focusChanged = focused.current !== prevStatus.current.focused;
			if (focusChanged) {
				if (focused.current === 'input') {
					forwardCustom('onActivate')(null, props);
					if (!noLockPointer) {
						lockPointer(node.current);
					}
					paused.pause();
				} else if (prevStatus.current.focused === 'input') {
					forwardCustom('onDeactivate')(null, props);
					if (!noLockPointer) {
						releasePointer(prevStatus.current.node);
					}
					paused.resume();
				}
			}

			prevStatus.current = {
				focused: focused.current,
				node: node.current
			};
		}, [paused, props]);

		const blur = useCallback(() => {
			if (focused.current || node.current) {
				focused.current = null;
				node.current = null;
				updateFocus();
			}
		}, [updateFocus]);

		const focus = useCallback((focusedProp, nodeProp, fromMouseProp) => {
			focused.current = focusedProp;
			node.current = nodeProp;
			fromMouse.current = fromMouseProp;
			updateFocus();
		}, [updateFocus]);

		const focusDecorator = useCallback((decorator) => {
			focus('decorator', decorator, false);
		}, [focus]);

		const onKeyDown = useCallback((ev) => {
			forwardKeyDown(ev, props);

			const {currentTarget, keyCode, target} = ev;

			// cache the target if this is the first keyDown event to ensure the component had focus
			// when the key interaction started
			setDownTarget(ev);

			if (focused.current === 'input') {
				const isDown = is('down', keyCode);
				const isLeft = is('left', keyCode);
				const isRight = is('right', keyCode);
				const isUp = is('up', keyCode);

				// move spotlight
				const shouldSpotlightMove = (
					// No value exists! (Can happen when disabled)
					target.value == null ||
					// on left + at beginning of selection
					(isLeft && isSelectionAtLocation(target, 0)) ||
					// on right + at end of selection (note: fails on non-selectable types usually)
					(isRight && isSelectionAtLocation(target, target.value.length)) ||
					// on up
					isUp ||
					// on down
					isDown
				);

				// prevent modifying the value via 5-way for numeric fields
				if ((isUp || isDown) && target.type === 'number') {
					ev.preventDefault();
				}

				if (shouldSpotlightMove) {
					const direction = getDirection(keyCode);
					const {getPointerMode, move, resetKeyHoldState, setPointerMode} = Spotlight;

					if (getPointerMode()) {
						setPointerMode(false);
					}

					stopImmediate(ev);
					paused.resume();

					// Move spotlight in the keypress direction
					if (move(direction)) {
						// if successful, reset the internal state
						blur();
						resetKeyHoldState();
					} else {
						// if there is no other spottable elements, focus `InputDecorator` instead
						focusDecorator(currentTarget);
					}
				} else if (isLeft || isRight) {
					// prevent 5-way nav for left/right keys within the <input>
					stopImmediate(ev);
				}
			}
		}, [blur, focusDecorator, paused, props, setDownTarget]);

		useEffect(() => {
			return () => {
				paused.resume();

				if (focused.current === 'input') {
					const {onSpotlightDisappear} = props;

					if (onSpotlightDisappear) {
						onSpotlightDisappear();
					}

					if (!noLockPointer) {
						releasePointer(node.current);
					}
				}
			};
		}, []); // eslint-disable-line react-hooks/exhaustive-deps

		const focusInput = useCallback((decorator, fromMouseProp) => {
			focus('input', decorator.querySelector('input'), fromMouseProp);
		}, [focus]);

		const onBlur = useCallback((ev) => {
			if (!props.autoFocus) {
				if (isBubbling(ev)) {
					if (Spotlight.getPointerMode()) {
						blur();
						forwardBlur(ev, props);
					} else {
						focused.current = 'decorator';
						node.current = ev.currentTarget;
						fromMouse.current = false;
						ev.stopPropagation();
					}
				} else if (!ev.currentTarget.contains(ev.relatedTarget)) {
					// Blurring decorator but not focusing input
					forwardBlur(ev, props);
					blur();
				}
			} else if (isBubbling(ev)) {
				if (focused.current === 'input' && node.current === ev.target && ev.currentTarget !== ev.relatedTarget) {
					blur();
					forwardBlur(ev, props);
				} else {
					focusDecorator(ev.currentTarget);
					ev.stopPropagation();
					blur();
				}
			}
		}, [blur, focusDecorator, props]);

		const onMouseDown = useCallback((ev) => {
			const {disabled, spotlightDisabled} = props;

			setDownTarget(ev);
			// focus the <input> whenever clicking on any part of the component to ensure both that
			// the <input> has focus and Spotlight is paused.
			if (!disabled && !spotlightDisabled) {
				focusInput(ev.currentTarget, true);
			}

			forwardMouseDown(ev, props);
		}, [focusInput, props, setDownTarget]);

		const onFocus = useCallback((ev) => {
			forwardFocus(ev, props);
			// when in autoFocus mode, focusing the decorator directly will cause it to
			// forward the focus onto the <input>
			if (!isBubbling(ev) && (props.autoFocus && focused.current === null && !Spotlight.getPointerMode())) {
				focusInput(ev.currentTarget, false);
				ev.stopPropagation();
			}
		}, [focusInput, props]);


		const onKeyUp = useCallback((ev) => {
			const {dismissOnEnter} = props;
			const {currentTarget, keyCode, target} = ev;

			// verify that we have a matching pair of key down/up events to avoid adjusting focus
			// when the component received focus mid-press
			if (target === downTarget.current) {
				downTarget.current = null;

				if (!props.disabled) {
					if (focused.current === 'input' && dismissOnEnter && is('enter', keyCode)) {
						focusDecorator(currentTarget);
						// prevent Enter onKeyPress which triggers an onMouseDown via Spotlight
						ev.preventDefault();
					} else if (focused.current !== 'input' && is('enter', keyCode)) {
						focusInput(currentTarget, false);
					}
				}
			}

			forwardKeyUp(ev, props);
		}, [focusDecorator, focusInput, props]);

		const componentProps = Object.assign({}, props);
		delete componentProps.autoFocus;
		delete componentProps.onActivate;
		delete componentProps.onDeactivate;

		return (
			<Component
				{...componentProps}
				onBlur={onBlur}
				onFocus={onFocus}
				onKeyDown={onKeyDown}
				onKeyUp={onKeyUp}
				onMouseDown={onMouseDown}
			/>
		);
	};

	InputSpotlightDecorator.displayName = 'InputSpotlightDecorator';
	InputSpotlightDecorator.propTypes = /** @lends limestone/Input/InputSpotlightDecorator.InputSpotlightDecorator.prototype */ {
		/**
		 * Focuses the <input> when the decorator is focused via 5-way.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		autoFocus: PropTypes.bool,

		/**
		 * Applies a disabled style and the control becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Blurs the input when the "enter" key is pressed.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		dismissOnEnter: PropTypes.bool,

		/**
		 * Called when the internal <input> is focused.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onActivate: PropTypes.func,

		/**
		 * Called when the internal <input> loses focus.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onDeactivate: PropTypes.func,

		/**
		 * Called when the component is removed while retaining focus.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightDisappear: PropTypes.func,

		/**
		 * Disables spotlight navigation into the component.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		spotlightDisabled: PropTypes.bool
	};

	return InputSpotlightDecorator;
});

export default InputSpotlightDecorator;
export {InputSpotlightDecorator};
