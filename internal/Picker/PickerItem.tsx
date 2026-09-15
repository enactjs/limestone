import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import type {CSSProperties, ReactNode} from 'react';

import Marquee from '../../Marquee';

import css from './Picker.module.less';

export interface PickerItemBaseProps {
	children?: ReactNode;
	marqueeDisabled?: boolean;
	style?: CSSProperties;
}

const PickerItemBase = kind({
	name: 'PickerItem',

	_propTypes: {} as PickerItemBaseProps,

	propTypes: {
		children: PropTypes.node,
		marqueeDisabled: PropTypes.bool,
		style: PropTypes.object as PropTypes.Validator<CSSProperties | undefined>
	},

	styles: {
		css,
		className: 'item',
		publicClassNames: false
	},

	computed: {
		className: ({children, styler}) => styler.append({numeric: !isNaN(Number(children))})
	},

	render: (props) => (
		<Marquee {...props} alignment="center" />
	)
});

export default PickerItemBase;
export {
	PickerItemBase as PickerItem,
	PickerItemBase
};
