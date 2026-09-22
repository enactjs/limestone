/**
 * Provides Limestone-themed item component and interactive toggleable switch.
 *
 * @example
 * <SwitchItem>
 * 	Item
 * </SwitchItem>
 *
 * @module limestone/SwitchItem
 * @exports SwitchItem
 * @exports SwitchItemBase
 */

import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import Pure from '@enact/ui/internal/Pure';
import Slottable from '@enact/ui/Slottable';
import Toggleable from '@enact/ui/Toggleable';
import {createElement} from 'react';
import type {ComponentType, ReactNode} from 'react';

import {ItemBase, ItemDecorator} from '../Item';
import type {ItemBaseProps} from '../Item';
import Skinnable from '../Skinnable';
import {SwitchBase} from '../Switch';

import componentCss from './SwitchItem.module.less';

// `ItemDecorator` is a ramda `compose()` chain, which doesn't preserve `kind()`'s overloaded
// factory typing through composition (a known ramda/TS limitation -- see Item.tsx's own final
// export, which casts for the same reason). Cast here too rather than leaving `Item` untyped.
const Item = ItemDecorator(ItemBase) as ComponentType<ItemBaseProps>;

const Switch = Skinnable(SwitchBase);
Switch.displayName = 'Switch';

export interface SwitchItemBaseProps {
	children?: ReactNode;
	css?: Record<string, string>;
	selected?: boolean;
	slotAfter?: ReactNode;
}

/**
 * Renders an item with a {@link limestone/Switch|Switch}.
 *
 * @class SwitchItemBase
 * @memberof limestone/SwitchItem
 * @extends limestone/Item.Item
 * @omit iconComponent
 * @ui
 * @public
 */
const SwitchItemBase = kind({
	name: 'SwitchItem',

	_propTypes: {} as SwitchItemBaseProps,

	propTypes: /** @lends limestone/SwitchItem.SwitchItemBase.prototype */ {
		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `switchItem` - The root class name
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object as PropTypes.Validator<Record<string, string> | undefined>,

		/**
		 * If true the switch will be selected.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		selected: PropTypes.bool,

		/**
		 * Nodes to be inserted after `children` and before the switch.
		 *
		 * @type {Node}
		 * @public
		 */
		slotAfter: PropTypes.node
	},

	defaultProps: {
		selected: false
	},

	styles: {
		css: componentCss,
		className: 'switchItem',
		publicClassNames: ['switchItem']
	},

	render: ({children, css, selected, slotAfter, ...rest}) => (
		<Item
			{...({
				'data-webos-voice-intent': 'SetToggleItem',
				role: 'button',
				...rest,
				'aria-pressed': selected,
				css,
				selected
			} as Record<string, any>)}
		>
			{children}
			{/* `Slottable` (used by the decorator below) extracts this into the `slotAfter` prop by
			  * matching the element's string `type`, exactly like a DOM tag -- but it isn't a real
			  * intrinsic element, so it's built with `createElement` rather than JSX to avoid needing
			  * a `slotAfter` entry in the global JSX namespace. */}
			{createElement('slotAfter', null,
				slotAfter,
				<Switch selected={selected} css={css} />
			)}
		</Item>
	)
});

/**
 * Adds interactive functionality to `SwitchItem`.
 *
 * @class SwitchItemDecorator
 * @memberof limestone/SwitchItem
 * @mixes ui/Toggleable.Toggleable
 * @hoc
 * @public
 */
const SwitchItemDecorator = compose(
	Toggleable({toggleProp: 'onClick'}),
	Slottable({slots: ['label', 'slotAfter', 'slotBefore']})
);

/**
 * A Limestone-styled item with a switch component.
 *
 * `SwitchItem` will manage its `selected` state via {@link ui/Toggleable|Toggleable} unless set
 * directly.
 *
 * @class SwitchItem
 * @memberof limestone/SwitchItem
 * @extends limestone/SwitchItem.SwitchItemBase
 * @mixes limestone/SwitchItem.SwitchItemDecorator
 * @ui
 * @public
 */
const SwitchItem = Pure(
	SwitchItemDecorator(
		SwitchItemBase
	)
) as ComponentType<SwitchItemBaseProps>;

export default SwitchItem;
export {
	SwitchItem,
	SwitchItemBase,
	SwitchItemDecorator
};
