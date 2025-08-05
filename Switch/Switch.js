/**
 * Provides a Limestone-themed pill-shaped toggle switch component.
 *
 * @example
 * <Switch />
 *
 * @module limestone/Switch
 * @exports Switch
 * @exports SwitchBase
 */

import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';

import Spottable from '@enact/spotlight/Spottable';
import Touchable from '@enact/ui/Touchable';
import Toggleable from '@enact/ui/Toggleable';

import Motion from '../Motion';
import Skinnable from '../Skinnable';

import componentCss from './Switch.module.less';

/**
 * Renders the base level DOM structure of the component.
 *
 * @class SwitchBase
 * @memberof limestone/Switch
 * @ui
 * @public
 */
const SwitchBase = kind({
	name: 'Switch',

	propTypes: /** @lends limestone/Switch.SwitchBase.prototype */ {
		css: PropTypes.object,

		/**
		 * Disables Switch and becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Disables animation.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAnimation: PropTypes.bool,

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
		noAnimation: typeof ENACT_PACK_NO_ANIMATION !== 'undefined' && ENACT_PACK_NO_ANIMATION,
		selected: false
	},

	styles: {
		css: componentCss,
		className: 'switch',
		publicClassNames: ['switch', 'selected', 'client']
	},

	computed: {
		className: ({noAnimation, selected, styler}) => styler.append({
			animated: !noAnimation,
			selected
		}),

		icon: ({css, selected}) => {
			return (
				<Motion triggerMotion={selected} type="bounce">
					<div className={css.icon} />
				</Motion>
			)
		}
	},

	render: ({css, disabled, icon, selected, ...rest}) => {
		delete rest.noAnimation;

		return (
			<div
				{...rest}
				aria-pressed={selected}
				aria-disabled={disabled}
				disabled={disabled}
				role="button"
			>
				<div className={css.bg} />
				<div className={css.client}>
					{icon}
				</div>
			</div>
		);
	}
});

/**
 * Adds interactive functionality to `Switch`.
 *
 * @class SwitchDecorator
 * @memberof limestone/Switch
 * @mixes ui/Toggleable.Toggleable
 * @mixes spotlight/Spottable.Spottable
 * @hoc
 * @public
 */
const SwitchDecorator = compose(
	Toggleable({toggleProp: 'onClick'}),
	Touchable,
	Spottable,
	Skinnable
);

/**
 * A Limestone-styled component that looks like a toggle switch.
 *
 * `Switch` will manage its `selected` state via {@link ui/Toggleable|Toggleable} unless set
 * directly.
 *
 * @class Switch
 * @memberof limestone/Switch
 * @extends limestone/Switch.SwitchBase
 * @mixes limestone/Switch.SwitchDecorator
 * @ui
 * @public
 */
const Switch = SwitchDecorator(SwitchBase);

export default Switch;
export {
	Switch,
	SwitchBase,
	SwitchDecorator
};
