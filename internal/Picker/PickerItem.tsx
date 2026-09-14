import kind from '@enact/core/kind';

import Marquee from '../../Marquee';
import type {TypedKindComponent} from '../kindComponent.type';

import css from './Picker.module.less';

const PickerItemBase = kind({
	name: 'PickerItem',

	styles: {
		css,
		className: 'item',
		publicClassNames: false
	},

	computed: {
		className: ({children, styler}: Record<string, any>) => styler.append({numeric: !isNaN(Number(children))})
	},

	render: (props: Record<string, any>) => (
		<Marquee {...props} alignment="center" />
	)
}) as TypedKindComponent<Record<string, any>>;

export default PickerItemBase;
export {
	PickerItemBase as PickerItem,
	PickerItemBase
};
