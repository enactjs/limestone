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
import {checkPropTypes} from '@enact/core/util';
import Group from '@enact/ui/Group';
import Pure from '@enact/ui/internal/Pure';
import Slottable from '@enact/ui/Slottable';
import Toggleable from '@enact/ui/Toggleable';
import IString from 'ilib/lib/IString';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {createElement} from 'react';
import type {ComponentType, ReactNode} from 'react';

import Icon from '../Icon';
import $L from '../internal/$L';
import {ItemBase, ItemDecorator} from '../Item';
import type {ItemBaseProps} from '../Item';

import componentCss from './RadioItem.module.less';

// `ItemDecorator` is a ramda `compose()` chain, which doesn't preserve `kind()`'s overloaded
// factory typing through composition (a known ramda/TS limitation -- see Item.tsx's own final
// export, which casts for the same reason). Cast here too rather than leaving `Item` untyped.
const Item = ItemDecorator(ItemBase) as ComponentType<ItemBaseProps>;

// `@enact/ui/Group`'s own final export isn't cast to a `ComponentType`, so it isn't usable as a
// JSX component as-is; cast locally rather than reaching into the `ui` package for this.
const GroupComponent = Group as ComponentType<any>;

export interface RadioItemBaseProps {
	children?: ReactNode;
	css?: Record<string, string>;
	disabled?: boolean;
	icon?: string;
	selected?: boolean;
	slotBefore?: ReactNode;
}

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

	_propTypes: {} as RadioItemBaseProps,

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
		css: PropTypes.object as PropTypes.Validator<Record<string, string> | undefined>,

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
				{...({
					'data-webos-voice-intent': 'SelectRadioItem',
					role: 'checkbox',
					...rest,
					'aria-checked': selected,
					css,
					selected
				} as Record<string, any>)}
			>
				{/* `Slottable` (used by the decorator below) extracts this into the `slotBefore` prop by
				  * matching the element's string `type`, exactly like a DOM tag -- but it isn't a real
				  * intrinsic element, so it's built with `createElement` rather than JSX to avoid needing
				  * a `slotBefore` entry in the global JSX namespace. */}
				{createElement('slotBefore', null,
					<Icon className={css!.icon} size="tiny">{icon}</Icon>,
					slotBefore
				)}
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
) as ComponentType<RadioItemBaseProps & {
	className?: string;
	onToggle?: (...args: any[]) => any;
}>;

export interface RadioItemGroupProps {
	children: any;
	groupId?: string;
	itemProps?: Record<string, any>;
	[key: string]: any;
}

/**
 * A container that surrounds multiple RadioItems.
 *
 * A list of multiple RadioItems wrapped with a RadioItemGroup component gets
 * required audio guidance.
 *
 * @class RadioItemGroup
 * @memberof limestone/RadioItem
 * @ui
 * @public
 */
const RadioItemGroup = (props: RadioItemGroupProps) => {
	checkPropTypes(RadioItemGroup, props);
	const {children, groupId, itemProps, ...rest} = props;

	if (typeof children[0] === 'string') {  // The case of multiple radio items are represented by string array instead of `RadioItem` components using `ui/Group`
		return (
			<div role="region" aria-labelledby={groupId || "radioItemGroup"}>
				<GroupComponent
					{...rest}
					id={groupId || "radioItemGroup"}
					aria-label={new IString($L('{total} items in total')).format({'total': children.length})}
					childComponent={RadioItem}
					childSelect="onToggle"
					itemProps={{...itemProps}}
				>
					{children}
				</GroupComponent>
			</div>
		);
	} else {  // The case of multiple radio items are represented by `RadioItem` components
		return (
			<div role="region" aria-labelledby={groupId || "radioItemGroup"}>
				<div
					{...rest}
					role="group"
					id={groupId || "radioItemGroup"}
					aria-label={new IString($L('{total} items in total')).format({'total': children.length})}
				>
					{children.map((child: any, index: number) => {
						const {children: itemValue, ...childRest} = child.props;
						return <RadioItem key={index} {...childRest} {...itemProps}>{itemValue}</RadioItem>;
					})}
				</div>
			</div>
		);
	}
};

RadioItemGroup.propTypes = {
	groupId: PropTypes.string,
	itemProps: PropTypes.object
};

export default RadioItem;
export {
	RadioItem,
	RadioItemBase,
	RadioItemDecorator,
	RadioItemGroup
};
