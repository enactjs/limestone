/**
 * Limestone styled RadioButton component.
 *
 * @example
 * <RadioButton onToggle={console.log} />
 *
 * @module limestone/RadioButton
 * @exports RadioButton
 * @exports RadioButtonBase
 */

import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import Spottable from '@enact/spotlight/Spottable';
import Layout, {Cell} from '@enact/ui/Layout';
import Toggleable from '@enact/ui/Toggleable';
import Touchable from '@enact/ui/Touchable';
import compose from 'ramda/src/compose';

import Button from '../Button';
import Icon from '../Icon';
import Skinnable from '../Skinnable';

import componentCss from './RadioButton.module.less';

/**
 * A RadioButton component, ready to use in Limestone applications.
 *
 * `RadioButton` may be used independently to represent a selectable state but is more commonly used as
 * part of {@link limestone/RadioItem|RadioItem}.
 *
 * Usage:
 * ```
 * <RadioButton selected />
 * ```
 *
 * @class RadioButtonBase
 * @memberof limestone/RadioButton
 * @extends limestone/Icon.Icon
 * @ui
 * @public
 */
const RadioButtonBase = kind({
	name: 'RadioButton',

	propTypes: /** @lends limestone/RadioButton.RadioButtonBase.prototype */ {
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
		 * * `radioButton` - The root class name
		 * * `selected` - Applied when the `selected` prop is true
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Disables RadioButton and becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * The label of the `RadioButton`.
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
		selected: PropTypes.bool
	},

	defaultProps: {
		children: 'circle',
		selected: false
	},

	styles: {
		css: componentCss,
		className: 'radioButton',
		publicClassNames: ['radioButton', 'selected']
	},

	computed: {
		className: ({selected, styler}) => styler.append({selected})
	},

	render: ({children, css, disabled, label, selected, ...rest}) => {
		return (
			<Layout>
				<Button
					{...rest}
					aria-checked={selected}
					aria-disabled={disabled}
					backgroundOpacity="transparent"
					css={css}
					disabled={disabled}
					minWidth={false}
					role="checkbox"
					selected={selected}
				>
					<div className={css.bg} />
					<Icon
						size="tiny"
						className={css.icon}
					>
						{children}
					</Icon>
				</Button>
				<Cell align="center" className={css.label}>
					{label}
				</Cell>
			</Layout>

		);
	}
});

/**
 * Adds interactive functionality to `RadioButton`.
 *
 * @class RadioButtonDecorator
 * @memberof limestone/RadioButton
 * @mixes ui/Toggleable.Toggleable
 * @mixes limestone/Skinnable.Skinnable
 * @mixes spotlight/Spottable.Spottable
 * @hoc
 * @public
 */
const RadioButtonDecorator = compose(
	Toggleable({toggleProp: 'onClick'}),
	Touchable,
	Spottable,
	Skinnable
);

/**
 * A Limestone-styled RadioButton component.
 *
 * `RadioButton` will manage its `selected` state via {@link ui/Toggleable|Toggleable} unless set
 * directly.
 *
 * @class RadioButton
 * @memberof limestone/RadioButton
 * @extends limestone/RadioButton.RadioButtonBase
 * @mixes limestone/RadioButton.RadioButtonDecorator
 * @ui
 * @public
 */
const RadioButton = RadioButtonDecorator(RadioButtonBase);

export default RadioButton;
export {
	RadioButton,
	RadioButtonBase,
	RadioButtonDecorator
};
