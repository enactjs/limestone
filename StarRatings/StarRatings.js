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
 * Moves focus to a star, which shows the focus glow on the row.
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
 * A star rating component, without any behaviors applied.
 *
 * Has two modes, set by `readOnly`:
 * * Read-only (`readOnly` is `true`): displays `value`, rounded half-up to one decimal place, so
 *   `2.54` fills 2.5 stars and `2.55` fills 2.6 stars. Not focusable and ignores all input.
 * * Selecting (`readOnly` is `false`, the default): shows `value` as whole stars, from 1 to
 *   `max`, starting at 3 stars when no value is given. The user selects a star with the
 *   remote, a click, a tap or a touch drag, and `onChange` is called with the star's number.
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
		 * The number of stars.
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
		 * During a touch drag, it is called whenever the finger moves onto a star other than the
		 * current `value`. Never called while `readOnly` is `true`.
		 *
		 * @type {Function}
		 * @public
		 */
		onChange: PropTypes.func,

		/**
		 * Displays the rating without letting the user change it.
		 *
		 * * `true`: the stars cannot be focused or selected, and `value` keeps one decimal place.
		 * * `false`: the user can select a star, `value` is shown as whole stars, and the filled
		 *   stars glow while the row has focus.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		readOnly: PropTypes.bool,

		/**
		 * The rating.
		 *
		 * * Read-only: rounded half-up to one decimal place and clamped to `0`–`max`. When not
		 *   set or `NaN`, no star is filled.
		 * * Selecting: rounded half-up to a whole star and clamped to `1`–`max`, so `0` shows 1
		 *   star. When neither `value` nor `defaultValue` is set (or the value is `NaN`), shows
		 *   3 stars, the spec's recommended default.
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
		max: 5,
		readOnly: false
	},

	styles: {
		css,
		className: 'starRatings'
	},

	handlers: {
		// Star forwards {id, ev}; turn it into {value} for onChange
		onStarClick: handle(
			forProp('readOnly', false),
			adaptEvent(
				({id: starId}, {id}) => ({value: getStarNumber(starId, id)}),
				forward('onChange')
			)
		),

		// Glow starts as soon as the finger touches a star
		onTouchStart: handle(
			forward('onTouchStart'),
			forProp('readOnly', false),
			(ev, {id}) => {
				focusStar(getStarFromTouch(ev, id));
				return true;
			}
		),

		// Drag across the stars to change the rating
		onTouchMove: handle(
			forward('onTouchMove'),
			forProp('readOnly', false),
			(ev, {id, onChange, value}) => {
				const star = getStarFromTouch(ev, id);
				if (!star) return false; // outside the row: keep the last value and focus

				focusStar(star);

				const starNumber = getStarNumber(star.id, id);
				if (onChange && starNumber && starNumber !== value) {
					onChange({value: starNumber});
				}
				return true;
			}
		)
	},

	computed: {
		className: ({readOnly, styler}) => styler.append({readOnly}),
		tenths: ({max, readOnly, value}) => toTenths(value, max, readOnly)
	},

	render: ({id, max, onStarClick, onTouchMove, onTouchStart, readOnly, tenths, ...rest}) => {
		delete rest.onChange;
		delete rest.value;

		return (
			<div
				{...rest}
				id={id}
				onTouchMove={onTouchMove}
				onTouchStart={onTouchStart}
			>
				{Array.from({length: max}, (_, i) => {
					const starValue = clamp(0, 10, tenths - i * 10) / 10;

					return (
						<Star
							key={i}
							id={`${id}-star-${i + 1}`}
							highlighted={!readOnly && starValue > 0}
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
 * Stores the rating itself when `value` is not set (see `defaultValue`), groups the stars for
 * Spotlight navigation (focus returns to the last focused star) and applies the current skin.
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
	SpotlightContainerDecorator({enterTo: 'last-focused'}),
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
