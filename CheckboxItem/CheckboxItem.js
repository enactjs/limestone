/**
 * Limestone styled item components with a toggleable checkbox.
 *
 * @example
 * <CheckboxItem onToggle={console.log}>
 * 	Item with a Checkbox
 * </CheckboxItem>
 *
 * @module limestone/CheckboxItem
 * @exports CheckboxItem
 * @exports CheckboxItemBase
 * @exports CheckboxItemDecorator
 */

import kind from '@enact/core/kind';
import Group from '@enact/ui/Group';
import Pure from '@enact/ui/internal/Pure';
import Slottable from '@enact/ui/Slottable';
import Toggleable from '@enact/ui/Toggleable';
import IString from 'ilib/lib/IString';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';

import $L from '../internal/$L';
import {CheckboxBase} from '../Checkbox';
import {ItemBase, ItemDecorator} from '../Item';
import Skinnable from '../Skinnable';

import componentCss from './CheckboxItem.module.less';

const Item = ItemDecorator(ItemBase);

const Checkbox = Skinnable(CheckboxBase);
Checkbox.displayName = 'Checkbox';

/**
 * A Limestone-styled item with a checkbox component.
 *
 * `CheckboxItem` may be used to allow the user to select a single option or used as part of a
 * {@link ui/Group|Group} when multiple {@link ui/Group.Group.select|selections} are possible.
 *
 * Usage:
 * ```
 * <CheckboxItem
 * 	defaultSelected={selected}
 * 	onToggle={handleToggle}
 * >
 *  Item with a Checkbox
 * </CheckboxItem>
 * ```
 *
 * @class CheckboxItemBase
 * @memberof limestone/CheckboxItem
 * @extends limestone/Item.Item
 * @omit iconComponent
 * @ui
 * @public
 */
const CheckboxItemBase = kind({
	name: 'CheckboxItem',

	propTypes: /** @lends limestone/CheckboxItem.CheckboxItemBase.prototype */ {
		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `checkboxItem` - The root class name
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * The icon content.
		 *
		 * May be specified as either:
		 *
		 * * A string that represents an icon from the {@link limestone/Icon.iconList|iconList},
		 * * An HTML entity string, Unicode reference or hex value (in the form '0x...'),
		 * * A URL specifying path to an icon image, or
		 * * An object representing a resolution independent resource (See {@link ui/resolution})
		 *
		 * @type {String|Object}
		 * @public
		 */
		icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

		/**
		 * Enables the "indeterminate" state.
		 *
		 * An indeterminate, mixed, or half-selected state is typically used in a hierarchy or group
		 * to represent that some, not all, children are selected.
		 *
		 * NOTE: This does not prevent updating the `selected` state. Applications must control this
		 * property directly.
		 *
		 * @type {Boolean}
		 * @public
		 */
		indeterminate: PropTypes.bool,

		/**
		 * The icon to be used in the `indeterminate` state.
		 *
		 * May be specified as either:
		 *
		 * * A string that represents an icon from the {@link limestone/Icon.iconList|iconList},
		 * * An HTML entity string, Unicode reference or hex value (in the form '0x...'),
		 * * A URL specifying path to an icon image, or
		 * * An object representing a resolution independent resource (See {@link ui/resolution})
		 *
		 * @type {String}
		 * @public
		 */
		indeterminateIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

		/**
		 * If true the checkbox will be selected.
		 *
		 * @type {Boolean}
		 * @public
		 */
		selected: PropTypes.bool,

		/**
		 * Nodes to be inserted after the checkbox and before `children`.
		 *
		 * @type {Node}
		 * @public
		 */
		slotBefore: PropTypes.node
	},

	styles: {
		css: componentCss,
		className: 'checkboxItem',
		publicClassNames: ['checkboxItem', 'bg', 'selected']
	},

	computed: {
		className: ({label, styler}) => styler.append({hasLabel: label != null})
	},

	render: ({children, css, icon, indeterminate, indeterminateIcon, selected, slotBefore, ...rest}) => (
		<Item
			data-webos-voice-intent="SelectCheckItem"
			role="checkbox"
			{...rest}
			aria-checked={selected}
			css={css}
			selected={selected}
		>
			<slotBefore>
				<Checkbox
					className={slotBefore ? css.checkbox : null}
					selected={selected}
					indeterminate={indeterminate}
					indeterminateIcon={indeterminateIcon}
				>
					{icon}
				</Checkbox>
				{slotBefore}
			</slotBefore>
			{children}
		</Item>
	)
});

/**
 * Adds interactive functionality to `CheckboxItem`.
 *
 * @class CheckboxItemDecorator
 * @memberof limestone/CheckboxItem
 * @mixes ui/Toggleable.Toggleable
 * @hoc
 * @public
 */
const CheckboxItemDecorator = compose(
	Toggleable({toggleProp: 'onClick'}),
	Slottable({slots: ['label', 'slotAfter', 'slotBefore']})
);

/**
 * A Limestone-styled item with a checkbox component.
 *
 * `CheckboxItem` will manage its `selected` state via {@link ui/Toggleable|Toggleable} unless set
 * directly.
 *
 * @class CheckboxItem
 * @memberof limestone/CheckboxItem
 * @extends limestone/CheckboxItem.CheckboxItemBase
 * @mixes limestone/CheckboxItem.CheckboxItemDecorator
 * @ui
 * @public
 */
const CheckboxItem = Pure(
	CheckboxItemDecorator(
		CheckboxItemBase
	)
);

/**
 * A container that surrounds multiple CheckboxItems.
 *
 * A list of multiple CheckboxItems wrapped with a CheckboxItemGroup component gets
 * required audio guidance.
 *
 * @class CheckboxItemGroup
 * @memberof limestone/CheckboxItem
 * @ui
 * @public
 */
const CheckboxItemGroup = (props) => {
	const {children, itemProps, ...rest} = props;

	CheckboxItemGroup.propTypes = {
		groupId: PropTypes.string,
		itemProps: PropTypes.object
	};

	if (typeof children[0] === 'string') {  // The case of multiple checkbox items are represented by string array instead of `CheckboxItem` components using `ui/Group`
		return (
			<Group
				{...rest}
				aria-label={new IString($L('{total} items in total')).format({'total': children.length})}
				childComponent={CheckboxItem}
				childSelect="onToggle"
				itemProps={{...itemProps}}
			>
				{children}
			</Group>
		);
	} else {  // The case of multiple checkbox items are represented by `CheckboxItem` components
		return (
			<div
				{...rest}
				role="group"
				aria-label={new IString($L('{total} items in total')).format({'total': children.length})}
			>
				{children.map((child, index) => {
					const {children: itemValue, ...childRest} = child.props;
					return <CheckboxItem key={index} {...childRest} {...itemProps}>{itemValue}</CheckboxItem>;
				})}
			</div>
		);
	}
};

export default CheckboxItem;
export {
	CheckboxItem,
	CheckboxItemBase,
	CheckboxItemDecorator,
	CheckboxItemGroup
};
