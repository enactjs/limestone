import {adaptEvent, forProp, forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import Spottable from '@enact/spotlight/Spottable';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';

import Icon from '../Icon';
import iconList from '../Icon/IconList';
import Skinnable from '../Skinnable';

import css from './Star.module.less';

const SpottableIcon = Spottable(Icon);

// The star glyph, also drawn by the fill layer (`::after`) on top of the focus outline
const STAR_GLYPH = String.fromCodePoint(iconList.star);

/**
 * Where the fill edge sits (`--star-fill`, % of the star's box) for each tenth of `value`.
 *
 * The glyph only covers about 9%–91% of its box, so plain tenths look wrong: a 10% fill shows
 * almost nothing and a 90% fill looks full. 0.1 and 0.9 are pinned to 20% and 80%; the steps in
 * between were measured on the Limestone star glyph so each tenth adds an equal share of the
 * star's area (symmetric around 50%).
 *
 * @type {Number[]}
 * @private
 */
const FILL_STEPS = [0, 20, 33, 39, 45, 50, 55, 61, 67, 80, 100];

/**
 * A single star of a [StarRatings]{@link limestone/StarRatings.StarRatings}, without any
 * behaviors applied.
 *
 * The star fills from the start of the reading direction (left in LTR, right in RTL) by the
 * amount set in `value`. While focused, it shows a white outline and a drop shadow that follow
 * the star's shape. The star is a 108px Icon (Limestone has no preset that size, so the number
 * is passed to `size`).
 *
 * @class StarBase
 * @memberof limestone/StarRatings
 * @ui
 * @private
 */
const StarBase = kind({
	name: 'Star',

	propTypes: /** @lends limestone/StarRatings.StarBase.prototype */ {
		/**
		 * Unique identifier for the star.
		 *
		 * Also sent to `onClick`, so the parent can tell which star was selected.
		 *
		 * @type {String}
		 * @required
		 * @public
		 */
		id: PropTypes.string.isRequired,

		/**
		 * Disables the star and makes it non-interactive.
		 *
		 * The star is shown at 30% opacity and `onClick` is not called. Like other disabled
		 * Limestone controls, it can still receive focus with the remote unless `readOnly` is also
		 * set.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Called when the star is selected.
		 *
		 * Receives an object with the star's `id` and the original event as `ev`.
		 * Not called while `disabled` or `readOnly` is `true`.
		 *
		 * @type {Function}
		 * @public
		 */
		onClick: PropTypes.func,

		/**
		 * Colors the empty (unselected) part of the star for the surface behind it.
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
		 * Makes the star display-only.
		 *
		 * When `false`, the star can be focused with Spotlight and `onClick` is called when it is
		 * clicked, tapped or selected with the remote. When `true`, the star cannot be focused
		 * and ignores input.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		readOnly: PropTypes.bool,

		/**
		 * The fill amount, from `0` (empty) to `1` (full).
		 *
		 * Rounded half-up to tenths (`0.55` → `0.6`), and each tenth fills the star by an equal
		 * share of its area. Values outside `0`–`1` are clamped, and `NaN` shows an empty star.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		value: PropTypes.number
	},

	defaultProps: {
		disabled: false,
		overlayMode: false,
		readOnly: false,
		value: 0
	},

	styles: {
		css,
		className: 'star'
	},

	handlers: {
		onClick: handle(
			forProp('disabled', false),
			forProp('readOnly', false),
			adaptEvent(
				(ev, {id}) => ({id, ev}),
				forward('onClick')
			)
		)
	},

	computed: {
		className: ({overlayMode, styler}) => styler.append({overlayMode}),
		style: ({style, value}) => {
			// Whole tenths, clamped to 0–10; `|| 0` also turns NaN into an empty star
			const tenths = Math.min(Math.max(Math.round(value * 10) || 0, 0), 10);
			return {...style, '--star-fill': FILL_STEPS[tenths] + '%'};
		}
	},

	render: ({className, disabled, id, onClick, readOnly, style, ...rest}) => {
		delete rest.overlayMode;
		delete rest.value;

		const IconComponent = readOnly ? Icon : SpottableIcon;

		return (
			<IconComponent
				{...rest}
				aria-disabled={disabled}
				className={className}
				data-glyph={STAR_GLYPH}
				disabled={disabled}
				id={id}
				onClick={onClick}
				style={style}
				size={108}
			>
				star
			</IconComponent>
		);
	}
});

/**
 * Applies Limestone specific behaviors to
 * [StarBase]{@link limestone/StarRatings.StarBase} components.
 *
 * @hoc
 * @memberof limestone/StarRatings
 * @mixes limestone/Skinnable.Skinnable
 * @private
 */
const StarDecorator = compose(
	Skinnable
);

/**
 * A single Limestone styled star, used by
 * [StarRatings]{@link limestone/StarRatings.StarRatings}.
 *
 * @class Star
 * @memberof limestone/StarRatings
 * @extends limestone/StarRatings.StarBase
 * @mixes limestone/StarRatings.StarDecorator
 * @ui
 * @private
 */
const Star = StarDecorator(StarBase);

export default Star;
export {
	FILL_STEPS,
	Star,
	StarBase,
	StarDecorator
};
