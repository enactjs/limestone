import {adaptEvent, forProp, forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import Spottable from '@enact/spotlight/Spottable';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';

import Icon from '../Icon';
import Skinnable from '../Skinnable';

import css from './Star.module.less';

const SpottableIcon = Spottable(Icon);

/**
 * A single star of a [StarRatings]{@link limestone/StarRatings.StarRatings}, without any
 * behaviors applied.
 *
 * The star fills from the start of the reading direction (left in LTR, right in RTL) by the
 * amount set in `value`.
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
		 * Makes the star glow while any star in its row has focus.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		highlighted: PropTypes.bool,

		/**
		 * Called when the star is selected.
		 *
		 * Receives an object with the star's `id` and the original event as `ev`.
		 * Not called while `readOnly` is `true`.
		 *
		 * @type {Function}
		 * @public
		 */
		onClick: PropTypes.func,

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
		 * Rounded half-up to 10% steps, e.g. `0.55` fills 60%. Values outside `0`–`1` are clamped,
		 * and `NaN` shows an empty star.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		value: PropTypes.number
	},

	defaultProps: {
		highlighted: false,
		readOnly: false,
		value: 0
	},

	styles: {
		css,
		className: 'star'
	},

	handlers: {
		onClick: handle(
			forProp('readOnly', false),
			adaptEvent(
				(ev, {id}) => ({id, ev}),
				forward('onClick')
			)
		)
	},

	computed: {
		className: ({highlighted, styler}) => styler.append({highlighted}),
		style: ({style, value}) => {
			// Whole tenths, clamped to 0–10; `|| 0` also turns NaN into an empty star
			const tenths = Math.min(Math.max(Math.round(value * 10) || 0, 0), 10);
			return {...style, '--star-fill': tenths * 10 + '%'};
		}
	},

	render: ({className, id, onClick, readOnly, style, ...rest}) => {
		delete rest.highlighted;
		delete rest.value;

		const IconComponent = readOnly ? Icon : SpottableIcon;

		return (
			<IconComponent
				{...rest}
				className={className}
				id={id}
				onClick={onClick}
				style={style}
				size={180}
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
	Star,
	StarBase,
	StarDecorator
};
