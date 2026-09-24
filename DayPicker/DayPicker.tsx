/**
 * Limestone styled day picker components.
 *
 * @example
 * <DayPicker
 *   selected={[2, 3]}
 *   onSelect={console.log}
 * />
 *
 * @module limestone/DayPicker
 * @exports DayPicker
 * @exports DayPickerBase
 * @exports getSelectedDayString
 */

import kind from '@enact/core/kind';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import Changeable from '@enact/ui/Changeable';
import Group from '@enact/ui/Group';
import Pure from '@enact/ui/internal/Pure';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import type {ComponentType} from 'react';

import CheckboxItem from '../CheckboxItem';
import Skinnable from '../Skinnable';

import {DaySelectorDecorator, getSelectedDayString} from './DaySelectorDecorator';

import css from './DayPicker.module.less';

// `@enact/ui/Group`'s own final export isn't cast to a `ComponentType` -- see the identical note
// in CheckboxItem.tsx.
const GroupComponent = Group as ComponentType<any>;

const CheckboxItemComponent = (props: Record<string, any>) => <CheckboxItem css={css} {...props} />;

export interface DayPickerBaseProps {
	children?: any;
	disabled?: boolean;
	onSelect?: (...args: any[]) => any;
	selected?: number | number[];
}

/**
 * A day of the week selection component.
 *
 * This component is most often not used directly but may be composed within another component as it
 * is within {@link limestone/DayPicker.DayPicker|DayPicker}.
 *
 * @class DayPickerBase
 * @memberof limestone/DayPicker
 * @extends ui/Group.Group
 * @omit children
 * @ui
 * @public
 */
const DayPickerBase = kind({
	name: 'DayPicker',

	_propTypes: {} as DayPickerBaseProps,

	propTypes: /** @lends limestone/DayPicker.DayPicker.prototype */ {
		/**
		 * Disables all days in this picker.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Called when a day is selected or unselected.
		 *
		 * The event payload will be an object with the following members:
		 * * `selected` - An array of numbers representing the selected days, 0 indexed where Sunday
		 *   is represented by 0
		 *
		 * @type {Function}
		 * @public
		 */
		onSelect: PropTypes.func,

		/**
		 * An array of numbers (0 indexed where Sunday is 0) representing the selected days of the
		 * week.
		 *
		 * @type {Number|Number[]}
		 * @public
		 */
		selected: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.arrayOf(PropTypes.number)
		]) as PropTypes.Validator<number | number[] | undefined>
	},

	styles: {
		css,
		className: 'dayPicker'
	},

	computed: {
		children: ({children}: Record<string, any>) => children.map((child: Record<string, any>) => child['aria-label'])
	},

	render: ({disabled, ...rest}) => {
		return (
			<GroupComponent
				{...rest}
				childComponent={CheckboxItemComponent}
				component="div"
				itemProps={{disabled}}
				role={null}
				select="multiple"
				selectedProp="selected"
			/>
		);
	}
});

const DayPickerDecorator = compose(
	Pure,
	Changeable({change: 'onSelect', prop: 'selected'}),
	I18nContextDecorator({localeProp: 'locale'}),
	DaySelectorDecorator,
	Skinnable
);

/**
 * A day of the week selection component, ready to use in Limestone applications.
 *
 * By default, `DayPicker` maintains the state of its `selected` property. Supply the
 * `selected` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `selected` at creation time and update it in response to
 * `onChange` events.
 *
 * Usage:
 * ```
 * <DayPicker
 *   selected={[2, 3]}
 *   onSelect={handleSelect}
 * />
 * ```
 *
 * @class DayPicker
 * @memberof limestone/DayPicker
 * @extends limestone/DayPicker.DayPickerBase
 * @mixes ui/Changeable.Changeable
 * @omit onChange
 * @omit value
 * @omit defaultValue
 * @ui
 * @public
 */
const DayPicker = DayPickerDecorator(DayPickerBase) as ComponentType<DayPickerBaseProps & {
	dayNameLength?: 'short' | 'medium' | 'long' | 'full';
	locale?: string;
}>;

/**
 * The "aria-label" for the component.
 *
 * By default, "aria-label" is set to the full names of the selected days or
 * the custom text when the weekend, week days, or all days is selected.
 *
 * @name aria-label
 * @type {String}
 * @memberof limestone/DayPicker.DayPicker.prototype
 * @public
 */

/**
 * The initial value used when `selected` is not set.
 *
 * @name selected
 * @type {Number|Number[]}
 * @memberof limestone/DayPicker.DayPicker.prototype
 * @public
 */

/**
 * Disables DayPicker and the control becomes non-interactive.
 *
 * @name disabled
 * @type {Boolean}
 * @default false
 * @memberof limestone/DayPicker.DayPicker.prototype
 * @public
 */

export default DayPicker;
export {
	DayPicker,
	DayPickerBase,
	getSelectedDayString
};
