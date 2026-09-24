import kind from '@enact/core/kind';
import {unit} from '@enact/ui/resolution';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import type {CSSProperties} from 'react';

import Skinnable from '../Skinnable';

import css from './HolePunchScrim.module.less';

const autoUnit = (size: number | string) => (typeof size === 'number' ? unit(size, 'rem') : size);

export interface HolePunchScrimBaseProps {
	holeBounds?: {
		height?: number | string;
		left?: number | string;
		right?: number | string;
		top?: number | string;
		width?: number | string;
	};
	style?: CSSProperties;
}

const HolePunchScrimBase = kind({
	name: 'HolePunchScrim',

	_propTypes: {} as HolePunchScrimBaseProps,

	propTypes: {
		holeBounds: PropTypes.shape({
			height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
			right: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
			top: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
			width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
		}) as PropTypes.Validator<HolePunchScrimBaseProps['holeBounds'] | undefined>
	},

	defaultProps: {
		holeBounds: {}
	},

	styles: {
		css,
		className: 'holePunchScrim'
	},

	computed: {
		style: ({holeBounds: {top = 0, left = 0, width = 0, height = 0}, style}: Record<string, any>) => {
			return {
				...style,
				'--hole-height': autoUnit(height),
				'--hole-width': autoUnit(width),
				'--hole-top': autoUnit(top),
				'--hole-left': autoUnit(left)
			};
		}
	},

	render: ({...rest}) => {
		const restProps = rest as Record<string, any>;
		delete restProps.holeBounds;
		return (
			<div {...restProps} />
		);
	}
});

const HolePunchScrimDecorator = (compose as any)(
	Skinnable
);

const HolePunchScrim = HolePunchScrimDecorator(HolePunchScrimBase);

export default HolePunchScrim;
export {
	HolePunchScrim,
	HolePunchScrimBase,
	HolePunchScrimDecorator
};
