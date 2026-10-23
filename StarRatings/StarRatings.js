/**
 * Limestone styled star rating components and behaviors.
 *
 * A row of stars that either displays a rating or lets the user choose one.
 *
 * @example
 * <StarRatings id="averageRating" readOnly value={3.3} />
 *
 * @example
 * <StarRatings
 * 	id="userRating"
 * 	defaultValue={3}
 * 	onChange={({value}) => console.log(value)}
 * />
 *
 * @module limestone/StarRatings
 * @exports StarRatings
 * @exports StarRatingsBase
 * @exports StarRatingsDecorator
 */

import {adaptEvent, forProp, forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import Spotlight from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import Changeable from '@enact/ui/Changeable';
import PropTypes from 'prop-types';
import {useCallback, useEffect, useRef, useState} from 'react';
import clamp from 'ramda/src/clamp';
import compose from 'ramda/src/compose';

import Skinnable from '../Skinnable';

import Star from './Star';

import css from './StarRatings.module.less';

/**
 * Finds the star element under the current touch point.
 *
 * @param {TouchEvent} ev The touch event.
 * @param {String} id The `id` of the `StarRatings` the star must belong to.
 * @returns {Element|null} The star element, or `null` if the touch is not over a star.
 * @private
 */
const getStarFromTouch = (ev, id) => {
	const touch = ev.touches && ev.touches[0];
	if (!touch) return null;

	const el = document.elementFromPoint(touch.clientX, touch.clientY);
	return el && el.closest(`[id^="${id}-star-"]`);
};

/**
 * Reads the 1-based star number from a star id, e.g. `3` from `rating-star-3`.
 *
 * @param {String} starId The star's id.
 * @param {String} id The `id` of its `StarRatings`.
 * @returns {Number} The star number.
 * @private
 */
const getStarNumber = (starId, id) => Number(starId.slice(`${id}-star-`.length));

/**
 * `true` while a touch focuses a star (see `selectTouchedStar`), so that focus is not redirected
 * to the selected star.
 *
 * @type {Boolean}
 * @private
 */
let touchFocusing = false;

/**
 * Moves focus to a star, which shows its focus outline.
 *
 * Uses Spotlight so remote navigation continues from this star, and falls back to native focus
 * if Spotlight declines.
 *
 * @param {Element|null} star The star element to focus.
 * @returns {undefined}
 * @private
 */
const focusStar = (star) => {
	if (star && document.activeElement !== star) {
		if (!Spotlight.focus(star)) {
			star.focus({preventScroll: true}); // fallback if Spotlight declines
		}
	}
};

/**
 * The rating shown while selecting when no `value` or `defaultValue` is given. The spec
 * recommends 3 as the default selection.
 *
 * @type {Number}
 * @private
 */
const DEFAULT_SELECTING_VALUE = 3;

/**
 * Converts a rating to whole tenths of a star, the unit the stars are filled in.
 *
 * * Read-only: rounded half-up to one decimal place and clamped to `0`–`max`, so `2.54` gives
 *   `25` and `2.55` gives `26`. Rounding once, then working in integers, avoids floating-point
 *   subtraction errors (`2.55 - 2 = 0.5499…`).
 * * Selecting: rounded half-up to a whole star and clamped to `1`–`max`, the selectable range.
 *   A missing value or `NaN` uses `DEFAULT_SELECTING_VALUE` (3, also clamped to `max`).
 *
 * @param {Number} value The rating.
 * @param {Number} max The number of stars.
 * @param {Boolean} readOnly Whether the component is read-only.
 * @returns {Number} The rating in tenths, from `0` to `max * 10`.
 * @private
 */
const toTenths = (value, max, readOnly) => {
	if (readOnly) {
		return clamp(0, max * 10, Math.round(value * 10) || 0);
	}

	const hasValue = typeof value === 'number' && !Number.isNaN(value);
	const rating = hasValue ? value : DEFAULT_SELECTING_VALUE;

	return clamp(1, max, Math.round(rating)) * 10;
};

/**
 * Selects the star under the finger: focuses it and, if it differs from the rating shown, calls
 * `onChange` with its number. Shared by `touchstart` (spec: pressing a star selects it right
 * away) and `touchmove` (dragging updates the rating).
 *
 * Compares with the shown rating rather than `value`, so a missing value (3 stars shown) or a
 * clamped one does not fire `onChange` for the star that is already shown.
 *
 * @param {TouchEvent} ev The touch event.
 * @param {Object} props The `StarRatingsBase` props.
 * @returns {Boolean} `false` when the finger is not over a star, so the last value is kept.
 * @private
 */
const selectTouchedStar = (ev, {id, max, onChange, readOnly, value}) => {
	const star = getStarFromTouch(ev, id);
	if (!star) return false; // outside the row: keep the last value and focus

	touchFocusing = true;
	try {
		focusStar(star);
	} finally {
		touchFocusing = false;
	}

	const shown = toTenths(value, max, readOnly) / 10;
	const starNumber = getStarNumber(star.id, id);
	if (onChange && starNumber && starNumber !== shown) {
		onChange({value: starNumber});
	}
	return true;
};

/**
 * Selector of the selected star, which Spotlight focuses whenever 5-way navigation enters the
 * row. A star that was only focused (previewed) and not selected is not remembered, so coming
 * back shows and focuses the saved rating, and pressing Enter right away keeps it.
 *
 * @type {String}
 * @private
 */
const SELECTED_STAR_SELECTOR = '[data-star-selected]';

/**
 * Tells the app about the rating the stars show, when it differs from `value`.
 *
 * While selecting, the stars show a whole rating from 1 to `max`, so a missing value (3 stars),
 * `0` (1 star), a value above `max` (`max` stars) or a fraction (rounded) would show a rating
 * the app does not have. In that case `onChange` is called once with `{value: shown, normalized:
 * true}`, so the app (and `Changeable`) holds what the user sees, and pressing Done in a popup
 * submits it. `normalized` lets an app that acts on each selection (e.g. a popup that closes on
 * selection) ignore this call.
 *
 * Skipped while read-only (no rating is chosen) or disabled (`Changeable` ignores changes then);
 * it runs again when either becomes `false`.
 *
 * @param {Object} props The `StarRatings` props.
 * @returns {undefined}
 * @private
 */
const useSyncShownValue = ({disabled = false, max = 5, onChange, readOnly = false, value}) => {
	const synced = useRef(null);
	const shown = toTenths(value, max, readOnly) / 10;

	useEffect(() => {
		if (readOnly || disabled || !onChange || value === shown) {
			synced.current = null;
			return;
		}

		// Calls once per mismatch, even if the app ignores it or the effect runs twice (Strict Mode)
		const key = `${value}:${shown}`;
		if (synced.current === key) return;
		synced.current = key;

		onChange({value: shown, normalized: true});
	}, [disabled, onChange, readOnly, shown, value]);
};

/**
 * Applies `useSyncShownValue`. Placed inside `Changeable`, so the reported rating is stored.
 *
 * @hoc
 * @param {Component} Wrapped The component to wrap.
 * @returns {Component} The wrapped component.
 * @private
 */
const ShownValueDecorator = (Wrapped) => {
	const ShownValue = (props) => {
		useSyncShownValue(props);

		return <Wrapped {...props} />;
	};

	return ShownValue;
};

/**
 * Handles focus for the stars:
 *
 * * Preview: passes the focused star's number to `StarRatingsBase` as `focusedStar`, so the
 *   stars up to and including it are filled. Only the fill changes: `value` and `onChange` are
 *   untouched until the user selects the star. When focus leaves the row, the selected rating
 *   shows again.
 * * Pointer: while the pointer is inside the row, focus stays on the last star that received it,
 *   until another star receives it. Spotlight blurs the focused element whenever the pointer is
 *   over something that is not spottable (the gaps between stars, or the edge of a star on some
 *   platforms); that blur is undone right away, before anything is painted, and is not passed
 *   on to `onBlur`/`onFocus`. Leaving the row blurs as usual. Pointer events are not stopped, so
 *   Spotlight and other listeners still see every move.
 * * 5-way return: when 5-way focus comes back to the row from outside, it goes to the selected
 *   star, even when Spotlight would restore a star that was only hovered or focused, or move from
 *   the pointer's last position. Only the selected star's focus is passed on to `onFocus`.
 *
 * @hoc
 * @param {Component} Wrapped The component to wrap.
 * @returns {Component} The wrapped component.
 * @private
 */
const FocusPreviewDecorator = (Wrapped) => {
	const FocusPreview = ({onBlur, onFocus, onMouseEnter, onMouseLeave, ...rest}) => {
		const {id} = rest;
		const [focusedStar, setFocusedStar] = useState(null);
		const pointerInside = useRef(false);
		const restoring = useRef(false);
		const redirecting = useRef(false);

		const isOwnStar = useCallback((node) => (
			Boolean(node && typeof node.id === 'string' && node.id.startsWith(`${id}-star-`))
		), [id]);

		const handleMouseEnter = useCallback((ev) => {
			pointerInside.current = true;
			if (onMouseEnter) onMouseEnter(ev);
		}, [onMouseEnter]);

		// `mouseleave` fires before the `mousemove` Spotlight blurs on, so leaving is not undone
		const handleMouseLeave = useCallback((ev) => {
			pointerInside.current = false;
			if (onMouseLeave) onMouseLeave(ev);
		}, [onMouseLeave]);

		const handleFocus = useCallback((ev) => {
			const star = ev.target;
			const fromOutside = !(ev.relatedTarget && ev.currentTarget.contains(ev.relatedTarget));

			// 5-way focus coming back to the row from outside goes to the selected star. Spotlight
			// enters the row there itself, but when nothing has focus (e.g. after the pointer left)
			// a key either restores the last focused star or moves from the pointer's position,
			// which can land on any star. Pointer and touch focus the star under them instead.
			if (
				fromOutside && isOwnStar(star) && !restoring.current && !redirecting.current &&
				!pointerInside.current && !touchFocusing && !Spotlight.getPointerMode()
			) {
				const selected = ev.currentTarget.querySelector(SELECTED_STAR_SELECTOR);
				if (selected && selected !== star) {
					redirecting.current = true;
					try {
						focusStar(selected);
					} finally {
						redirecting.current = false;
					}
					// The selected star's own focus event already updated the preview and onFocus
					if (document.activeElement === selected) return;
				}
			}

			// Focus events bubble from the stars; anything else in the row is ignored
			setFocusedStar(isOwnStar(ev.target) ? getStarNumber(ev.target.id, id) || null : null);

			if (restoring.current) return; // the star got its focus back; nothing changed
			if (onFocus) onFocus(ev);
		}, [id, isOwnStar, onFocus]);

		const handleBlur = useCallback((ev) => {
			const star = ev.target;

			// Leaving the star that `handleFocus` redirected from: focus never really arrived there
			if (redirecting.current) return;

			// Blurred to nothing (not to another element) while the pointer is still inside: keep
			// focus on this star. Not while the window itself loses focus.
			const to = ev.relatedTarget;
			const toNothing = !to || to === document || to === document.body;
			if (pointerInside.current && toNothing && isOwnStar(star) && document.hasFocus()) {
				restoring.current = true;
				try {
					focusStar(star);
				} finally {
					restoring.current = false;
				}
				if (document.activeElement === star) return;
			}

			if (onBlur) onBlur(ev);

			// Moving between stars fires blur then focus; only clear when focus leaves the row
			if (!ev.relatedTarget || !ev.currentTarget.contains(ev.relatedTarget)) {
				setFocusedStar(null);
			}
		}, [isOwnStar, onBlur]);

		return (
			<Wrapped
				{...rest}
				focusedStar={focusedStar}
				onBlur={handleBlur}
				onFocus={handleFocus}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			/>
		);
	};

	return FocusPreview;
};

/**
 * A star rating component, without any behaviors applied.
 *
 * Has two modes, set by `readOnly`:
 * * Read-only (`readOnly` is `true`): displays `value`, rounded half-up to one decimal place, so
 *   `2.54` fills 2.5 stars and `2.55` fills 2.6 stars. Not focusable and ignores all input.
 * * Selecting (`readOnly` is `false`, the default): shows `value` as whole stars, from 1 to
 *   `max`, starting at 3 stars when no value is given. The user selects a star with the
 *   remote, a click, a tap or a touch drag, and `onChange` is called with the star's number.
 *   [StarRatings]{@link limestone/StarRatings.StarRatings} also reports the shown rating
 *   with `onChange` when it differs from `value`, and enters the row at the selected star, so
 *   pressing Enter or Done keeps the rating the user sees. While a star has focus, the stars
 *   up to and including it are filled as a preview (`value` changes only on selection); the
 *   selected rating shows again when focus leaves the row. With a pointer, focus stays on the
 *   last hovered star while the pointer is between stars, until it leaves the row.
 *
 * `disabled` works in both modes: the rating is still shown, at 30% opacity, but cannot be
 * changed. `overlayMode` switches the color of the empty parts for light overlay surfaces.
 *
 * Laid out as a row of 108px stars with a 60px gap (UHD px). The row is as wide as its stars,
 * for any `max`; space around it, such as the design's 990 × 240 area in a popup, is up to the
 * surrounding layout.
 *
 * @class StarRatingsBase
 * @memberof limestone/StarRatings
 * @ui
 * @public
 */
const StarRatingsBase = kind({
	name: 'StarRatings',

	propTypes: /** @lends limestone/StarRatings.StarRatingsBase.prototype */ {
		/**
		 * Unique identifier for the component.
		 *
		 * Each star gets the id `{id}-star-{number}`, e.g. `rating-star-3`, so the id must be
		 * unique on the page and must not contain quotes.
		 *
		 * @type {String}
		 * @required
		 * @public
		 */
		id: PropTypes.string.isRequired,

		/**
		 * Disables StarRatings and makes it non-interactive.
		 *
		 * The rating is still shown, at 30% opacity. No star can be selected and `onChange` is not
		 * called. Like other disabled Limestone controls, the stars can still receive focus with
		 * the remote while selecting, so the user can see the rating.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * The number of the focused star, set by
		 * [StarRatingsDecorator]{@link limestone/StarRatings.StarRatingsDecorator}.
		 *
		 * While selecting (and not disabled), the stars up to and including this one are filled
		 * as a preview, up or down from the selected rating. `value` does not change until the
		 * user selects the star.
		 *
		 * @type {Number}
		 * @private
		 */
		focusedStar: PropTypes.number,

		/**
		 * The number of stars.
		 *
		 * Set it for each scenario. The row grows or shrinks with the number of stars.
		 *
		 * @type {Number}
		 * @default 5
		 * @public
		 */
		max: PropTypes.number,

		/**
		 * Called when the user selects a star.
		 *
		 * Receives an object whose `value` is the number of the selected star, from `1` to `max`.
		 * With touch, it is called as soon as the finger lands on a star other than the one
		 * shown, and again whenever a drag moves it onto another star. Lifting the finger, or
		 * moving it off the stars, keeps the last value.
		 *
		 * With [StarRatings]{@link limestone/StarRatings.StarRatings} (not `StarRatingsBase`),
		 * also called once, with `{value, normalized: true}`, when the rating shown while
		 * selecting differs from `value`: when no value is set (3), for `0` (1), above `max`
		 * (`max`) or for a fraction (rounded). This way the app holds the rating the user sees,
		 * e.g. to submit it with a popup's Done button. An app that acts on every selection,
		 * such as a popup that closes on selection, can ignore events with `normalized` set.
		 *
		 * Never called while `disabled` or `readOnly` is `true`.
		 *
		 * @type {Function}
		 * @public
		 */
		onChange: PropTypes.func,

		/**
		 * Colors the empty (unselected) part of the stars for the surface behind them.
		 *
		 * * `false`: `#FFFFFF33` (white at 20%), for dark backgrounds.
		 * * `true`: `#1111111A` (near-black at 10%), for light overlay surfaces.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		overlayMode: PropTypes.bool,

		/**
		 * Displays the rating without letting the user change it.
		 *
		 * * `true`: the stars cannot be focused or selected, and `value` keeps one decimal place.
		 * * `false`: the user can select a star, `value` is shown as whole stars, and the focused
		 *   star shows a white outline and a drop shadow that follow its shape.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		readOnly: PropTypes.bool,

		/**
		 * The rating.
		 *
		 * * Read-only: rounded half-up to one decimal place and clamped to `0`–`max`. Each tenth
		 *   of a star fills an equal share of its area. When not set or `NaN`, no star is filled.
		 * * Selecting: rounded half-up to a whole star and clamped to `1`–`max`, so `0` shows 1
		 *   star. When neither `value` nor `defaultValue` is set (or the value is `NaN`), shows
		 *   3 stars, the spec's recommended default. If the shown rating differs from `value`,
		 *   `onChange` reports it (see `onChange`).
		 *
		 * If not set, the component keeps its own value and updates it on each selection; use
		 * `defaultValue` to set where it starts.
		 *
		 * @type {Number}
		 * @public
		 */
		value: PropTypes.number
	},

	defaultProps: {
		disabled: false,
		max: 5,
		overlayMode: false,
		readOnly: false
	},

	styles: {
		css,
		className: 'starRatings'
	},

	handlers: {
		// Star forwards {id, ev}; turn it into {value} for onChange
		onStarClick: handle(
			forProp('disabled', false),
			forProp('readOnly', false),
			adaptEvent(
				({id: starId}, {id}) => ({value: getStarNumber(starId, id)}),
				forward('onChange')
			)
		),

		// Spec: pressing a star selects it right away (focus outline and fill together)
		onTouchStart: handle(
			forward('onTouchStart'),
			forProp('disabled', false),
			forProp('readOnly', false),
			selectTouchedStar
		),

		// Drag across the stars to change the rating
		onTouchMove: handle(
			forward('onTouchMove'),
			forProp('disabled', false),
			forProp('readOnly', false),
			selectTouchedStar
		),

		// The touch already selected the star, so cancel the click the browser would send on
		// release; otherwise `onChange` would be called a second time for the same star
		onTouchEnd: handle(
			forward('onTouchEnd'),
			forProp('disabled', false),
			forProp('readOnly', false),
			(ev) => {
				if (ev.cancelable) ev.preventDefault();
				return true;
			}
		)
	},

	computed: {
		className: ({disabled, readOnly, styler}) => styler.append({disabled, readOnly}),
		// The selected rating, which Spotlight enters the row at
		selected: ({max, readOnly, value}) => (readOnly ? null : toTenths(value, max, readOnly) / 10),
		// What the stars show: the focus preview while selecting, otherwise `value`
		tenths: ({disabled, focusedStar, max, readOnly, value}) => {
			const preview = !readOnly && !disabled && focusedStar;
			return toTenths(preview ? focusedStar : value, max, readOnly);
		}
	},

	render: ({
		disabled,
		id,
		max,
		onStarClick,
		onTouchEnd,
		onTouchMove,
		onTouchStart,
		overlayMode,
		readOnly,
		selected,
		tenths,
		...rest
	}) => {
		delete rest.focusedStar;
		delete rest.onChange;
		delete rest.value;

		return (
			<div
				{...rest}
				aria-disabled={disabled}
				id={id}
				onTouchEnd={onTouchEnd}
				onTouchMove={onTouchMove}
				onTouchStart={onTouchStart}
			>
				{Array.from({length: max}, (_, i) => {
					const starValue = clamp(0, 10, tenths - i * 10) / 10;

					return (
						<Star
							key={i}
							data-star-selected={i + 1 === selected ? true : null}
							id={`${id}-star-${i + 1}`}
							disabled={disabled}
							overlayMode={overlayMode}
							readOnly={readOnly}
							value={starValue}
							onClick={onStarClick}
						/>
					);
				})}
			</div>
		);
	}
});

/**
 * Applies Limestone specific behaviors to
 * [StarRatingsBase]{@link limestone/StarRatings.StarRatingsBase} components.
 *
 * Stores the rating itself when `value` is not set (see `defaultValue`), reports the shown
 * rating with `onChange` when it differs from `value` (see `onChange`), groups the stars for
 * Spotlight navigation (5-way focus always enters at the selected star, not the last focused or
 * hovered one),
 * fills the stars up to the focused one as a preview while selecting, and
 * applies the current skin.
 *
 * @hoc
 * @memberof limestone/StarRatings
 * @mixes ui/Changeable.Changeable
 * @mixes spotlight/SpotlightContainerDecorator.SpotlightContainerDecorator
 * @mixes limestone/Skinnable.Skinnable
 * @public
 */
const StarRatingsDecorator = compose(
	Changeable,
	ShownValueDecorator,
	FocusPreviewDecorator,
	SpotlightContainerDecorator({
		// Always enter at the selected star: a star focused without being selected is a preview
		// only, so returning to the row goes back to the saved rating
		defaultElement: SELECTED_STAR_SELECTOR,
		enterTo: 'default-element'
	}),
	Skinnable
);

/**
 * A Limestone styled star rating component, with Spotlight, touch and RTL support.
 *
 * Usage:
 * ```
 * // Read-only, e.g. an app's average rating
 * <StarRatings id="averageRating" readOnly value={3.3} />
 *
 * // Selecting, controlled
 * <StarRatings id="userRating" value={rating} onChange={({value}) => setRating(value)} />
 * ```
 *
 * @class StarRatings
 * @memberof limestone/StarRatings
 * @extends limestone/StarRatings.StarRatingsBase
 * @mixes limestone/StarRatings.StarRatingsDecorator
 * @ui
 * @public
 */
const StarRatings = StarRatingsDecorator(StarRatingsBase);

/**
 * The rating to start from when `value` is not set.
 *
 * Works in both modes and is rounded and clamped like `value`. After that, the component
 * updates the rating itself on each selection. When not set, selecting starts at 3 stars and
 * read-only shows no stars.
 *
 * @name defaultValue
 * @memberof limestone/StarRatings.StarRatings.prototype
 * @type {Number}
 * @public
 */

export default StarRatings;
export {
	StarRatings,
	StarRatingsBase,
	StarRatingsDecorator
};
