/**
 * Limestone styled Radio component.
 *
 * @example
 * <Radio onToggle={console.log} />
 *
 * @module limestone/Radio
 * @exports Radio
 * @exports RadioBase
 */

import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import Spottable from '@enact/spotlight/Spottable';
import {Cell} from '@enact/ui/Layout';
import Toggleable from '@enact/ui/Toggleable';
import Touchable from '@enact/ui/Touchable';
import compose from 'ramda/src/compose';

import Icon from '../Icon';
import Marquee from '../Marquee';
import Skinnable from '../Skinnable';

import componentCss from './Radio.module.less';

/**
 * A Radio component, ready to use in Limestone applications.
 *
 * `Radio` may be used independently to represent a selectable state but is more commonly used as
 * part of {@link limestone/RadioItem|RadioItem}.
 *
 * Usage:
 * ```
 * <Radio selected />
 * ```
 *
 * @class RadioBase
 * @memberof limestone/Radio
 * @extends limestone/Icon.Icon
 * @ui
 * @public
 */
const RadioBase = kind({
	name: 'Radio',

	propTypes: /** @lends limestone/Radio.RadionBase.prototype */ {
		/**
		 * The icon displayed when `selected`.
		 *
		 * May be specified as either:
		 *
		 * * A string that represents an icon from the {@link limestone/Icon.iconList|iconList},
		 * * An HTML entity string, Unicode reference or hex value (in the form '0x...'),
		 * * A URL specifying path to an icon image, or
		 * * An object representing a resolution independent resource (See {@link ui/resolution})
		 *
		 * @see {@link limestone/Icon.IconBase.children}
		 * @type {String|Object}
		 * @default	'circle'
		 * @public
		 */
		children: PropTypes.string,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `radio` - The root class name
		 * * `selected` - Applied when the `selected` prop is true
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Disables Radio and becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * The label of the `Radio`.
		 *
		 * @type {String}
		 * @public
		 */
		label: PropTypes.string,

		/**
		 * Sets whether this control is in the 'on' or 'off' state. `true` for 'on', `false` for 'off'.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		selected: PropTypes.bool,


		/**
		 * Sets standalone rules to show spotlight background color.
		 *
		 * @type {Boolean}
		 * @private
		 */
		standalone: PropTypes.bool
	},

	defaultProps: {
		children: 'circle',
		selected: false
	},

	styles: {
		css: componentCss,
		className: 'radio',
		publicClassNames: ['radio', 'selected']
	},

	computed: {
		className: ({selected, standalone, styler}) => styler.append({selected, standalone})
	},

	render: ({children, css, disabled, label, selected, ...rest}) => {
		delete rest.standalone;

		return (
			<>
				<div
					{...rest}
					aria-checked={selected}
					aria-disabled={disabled}
					disabled={disabled}
					role="checkbox"
				>
					<div className={css.bg}/>
					<Icon
						size="tiny"
						className={css.icon}
					>
						{children}
					</Icon>
				</div>
				{label ? <Cell className={css.label} component={Marquee} marqueeOn="render" shrink>{label}</Cell> : null}
			</>
		);
	}
});

/**
 * Adds interactive functionality to `Radio`.
 *
 * @class RadioDecorator
 * @memberof limestone/Radio
 * @mixes ui/Toggleable.Toggleable
 * @mixes limestone/Skinnable.Skinnable
 * @mixes spotlight/Spottable.Spottable
 * @hoc
 * @public
 */
const RadioDecorator = compose(
	Toggleable({toggleProp: 'onClick'}),
	Touchable,
	Spottable,
	Skinnable
);

/**
 * A Limestone-styled Radio component.
 *
 * `Radio` will manage its `selected` state via {@link ui/Toggleable|Toggleable} unless set
 * directly.
 *
 * @class Radio
 * @memberof limestone/Radio
 * @extends limestone/Radio.RadioBase
 * @mixes limestone/Radio.RadioDecorator
 * @ui
 * @public
 */
const Radio = RadioDecorator(RadioBase);

export default Radio;
export {
	Radio,
	RadioBase,
	RadioDecorator
};
