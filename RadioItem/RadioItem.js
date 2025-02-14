/**
 * Provides a Limestone-themed Item component with an interactive radio toggle icon.
 *
 * @example
 * <RadioItem>Item</RadioItem>
 *
 * @module limestone/RadioItem
 * @exports RadioItem
 * @exports RadioItemBase
 */

import kind from '@enact/core/kind';
import Pure from '@enact/ui/internal/Pure';
import Slottable from '@enact/ui/Slottable';
import Toggleable from '@enact/ui/Toggleable';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';

import Icon from '../Icon';
import {ItemBase, ItemDecorator} from '../Item';

import componentCss from './RadioItem.module.less';

const Item = ItemDecorator(ItemBase);

/**
 * An item component with a radio toggle icon.
 *
 * This component is most often not used directly but may be composed within another component as it
 * is within {@link limestone/RadioItem.RadioItem|RadioItem}.
 *
 * @class RadioItemBase
 * @memberof limestone/RadioItem
 * @extends limestone/Item.Item
 * @ui
 * @public
 */
const RadioItemBase = kind({
	name: 'RadioItem',

	propTypes: /** @lends limestone/RadioItem.RadioItem.prototype */ {
		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `radioItem` - The root class name
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * The icon to display when selected.
		 *
		 * @type {String}
		 * @default 'circle'
		 * @see {@link limestone/Icon.Icon}
		 */
		icon: PropTypes.string,

		/**
		 * If true it will be selected.
		 *
		 * @type {Boolean}
		 * @public
		 */
		selected: PropTypes.bool,

		/**
		 * Nodes to be inserted after the radio button and before `children`.
		 *
		 * @type {Node}
		 * @public
		 */
		slotBefore: PropTypes.node
	},

	defaultProps: {
		icon: 'circle'
	},

	styles: {
		css: componentCss,
		className: 'radioItem',
		publicClassNames: ['radioItem']
	},

	render: ({children, css, icon, selected, slotBefore, ...rest}) => {
		return (
			<Item
				data-webos-voice-intent="SelectRadioItem"
				role="checkbox"
				{...rest}
				aria-checked={selected}
				css={css}
				selected={selected}
			>
				<slotBefore>
					<Icon className={css.icon} size="tiny">{icon}</Icon>
					{slotBefore}
				</slotBefore>
				{children}
			</Item>
		);
	}
});

/**
 * Limestone specific behaviors to apply to {@link limestone/RadioItem.RadioItemBase|RadioItem}.
 *
 * @hoc
 * @memberof limestone/RadioItem
 * @mixes ui/Toggleable.Toggleable
 * @public
 */
const RadioItemDecorator = compose(
	Toggleable({toggleProp: 'onClick'}),
	Slottable({slots: ['label', 'slotAfter', 'slotBefore']})
);

/**
 * Renders an `Item` with a radio-dot component. Useful to show a selected state on an Item.
 *
 * @class RadioItem
 * @memberof limestone/RadioItem
 * @extends limestone/RadioItem.RadioItemBase
 * @mixes limestone/RadioItem.RadioItemDecorator
 * @ui
 * @public
 */
const RadioItem = Pure(
	RadioItemDecorator(
		RadioItemBase
	)
);

export default RadioItem;
export {
	RadioItem,
	RadioItemBase,
	RadioItemDecorator
};
