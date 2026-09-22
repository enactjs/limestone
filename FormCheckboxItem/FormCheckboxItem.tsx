/**
 * Provides Limestone styled form item component and interactive toggleable checkbox.
 *
 * @example
 * <FormCheckboxItem>A Checkbox for a form</FormCheckboxItem>
 *
 * @deprecated Will be removed in 2.0.0. Use {@link limestone/CheckboxItem} instead.
 * @module limestone/FormCheckboxItem
 * @exports FormCheckboxItem
 * @exports FormCheckboxItemBase
 * @exports FormCheckboxItemDecorator
 */

import kind from '@enact/core/kind';
import Pure from '@enact/ui/internal/Pure';
import Slottable from '@enact/ui/Slottable';
import Toggleable from '@enact/ui/Toggleable';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {Children, createElement} from 'react';
import type {ComponentType, ReactNode} from 'react';

import Skinnable from '../Skinnable';
import {CheckboxBase} from '../Checkbox';
import {ItemBase, ItemDecorator} from '../Item';
import type {ItemBaseProps} from '../Item';

import componentCss from './FormCheckboxItem.module.less';

// See the identical note in CheckboxItem.tsx: ramda's compose() doesn't preserve kind()'s
// overloaded factory typing through composition, so this needs an explicit cast.
const Item = ItemDecorator(ItemBase) as ComponentType<ItemBaseProps>;

const Checkbox = Skinnable(CheckboxBase);

const hasChildren = (children: ReactNode) => (Children.toArray(children).filter(Boolean).length > 0);

export interface FormCheckboxItemBaseProps {
	children?: ReactNode;
	css?: Record<string, string>;
	icon?: string | Record<string, string>;
	indeterminate?: boolean;
	indeterminateIcon?: string | Record<string, string>;
	selected?: boolean;
	slotBefore?: ReactNode;
}

/**
 * A Limestone-styled form item with a checkbox component.
 *
 * Useful to show a selected state on an item inside a form.
 *
 * @class FormCheckboxItemBase
 * @memberof limestone/FormCheckboxItem
 * @extends limestone/Item.Item
 * @ui
 * @public
 */
const FormCheckboxItemBase = kind({
	name: 'FormCheckboxItem',

	_propTypes: {} as FormCheckboxItemBaseProps,

	propTypes: /** @lends limestone/FormCheckboxItem.FormCheckboxItemBase.prototype */ {
		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `formCheckboxItem` - The root class name
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object as PropTypes.Validator<Record<string, string> | undefined>,

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
		icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]) as PropTypes.Validator<string | Record<string, string> | undefined>,

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
		indeterminateIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]) as PropTypes.Validator<string | Record<string, string> | undefined>,

		/**
		 * Controls the presence of the checkmark icon.
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
		className: 'formCheckboxItem',
		publicClassNames: ['formCheckboxItem']
	},

	computed: {
		className: ({slotBefore, styler}) => styler.append({hasSlotBefore: hasChildren(slotBefore)})
	},

	render: ({children, css, icon, indeterminate, indeterminateIcon, selected, slotBefore, ...rest}) => (
		<Item
			{...({
				'data-webos-voice-intent': 'SelectCheckItem',
				role: 'checkbox',
				...rest,
				'aria-checked': selected,
				css,
				selected
			} as Record<string, any>)}
		>
			{/* See the identical note in CheckboxItem.tsx: built with `createElement` rather than
			  * JSX since `slotBefore` is a `Slottable` slot name, not a real intrinsic element. */}
			{createElement('slotBefore', null,
				<Checkbox
					className={css!.checkbox}
					indeterminate={indeterminate}
					indeterminateIcon={indeterminateIcon}
					selected={selected}
					standalone
				>
					{icon}
				</Checkbox>,
				slotBefore
			)}
			{children}
		</Item>
	)
});

/**
 * Adds interactive functionality to `FormCheckboxItem`.
 *
 * @class FormCheckboxItemDecorator
 * @memberof limestone/FormCheckboxItem
 * @mixes ui/Toggleable.Toggleable
 * @hoc
 * @public
 */
const FormCheckboxItemDecorator = compose(
	Toggleable({toggleProp: 'onClick'}),
	Slottable({slots: ['label', 'slotAfter', 'slotBefore']})
);

/**
 * A Limestone-styled form item with a checkbox component.
 *
 * `FormCheckboxItem` will manage its `selected` state via {@link ui/Toggleable|Toggleable} unless
 * set directly.
 *
 * @class FormCheckboxItem
 * @memberof limestone/FormCheckboxItem
 * @extends limestone/FormCheckboxItem.FormCheckboxItemBase
 * @mixes limestone/FormCheckboxItem.FormCheckboxItemDecorator
 * @ui
 * @public
 */
const FormCheckboxItem = Pure(
	FormCheckboxItemDecorator(
		FormCheckboxItemBase
	)
) as ComponentType<FormCheckboxItemBaseProps>;

export default FormCheckboxItem;
export {
	FormCheckboxItem,
	FormCheckboxItemBase,
	FormCheckboxItemDecorator
};
