import kind from '@enact/core/kind';
import {memoize} from '@enact/core/util';
import ilib from '@enact/i18n';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import NumFmt from 'ilib/lib/NumFmt';
import PropTypes from 'prop-types';
import type {ComponentType, ReactNode} from 'react';

import Tooltip from '../TooltipDecorator/Tooltip';

import componentCss from './ProgressBarTooltip.module.less';

const verticalPositions = ['before', 'after', 'left', 'right'];
const isVerticalModeRadial = (orientation: string, position: string) => orientation === 'radial' && verticalPositions.includes(position);

// prop-type validator that warns on invalid orientation + position
/* istanbul ignore next */
const validatePosition = (base: any) => (props: Record<string, any>, key: string, componentName: string, location: string, propFullName: string, ...rest: any[]) => {
	const {position} = props;
	let result = base(props, key, componentName, location, propFullName, ...rest);

	if (!result && position) {
		const orientation = props.orientation || 'horizontal';
		const hasVerticalValue = verticalPositions.includes(position);
		if (
			(orientation === 'vertical' && !hasVerticalValue) ||
			(orientation === 'horizontal' && hasVerticalValue)
		) {
			result = new Error(
				`'${key}' value '${position}' is not a valid value for the orientation '${orientation}'`
			);
		}
	}

	return result;
};

const memoizedPercentFormatter = memoize((/* locale */) => new NumFmt({
	type: 'percentage',
	useNative: false
}));

const getDefaultPosition = (orientation: string) => orientation === 'horizontal' ? 'above' : 'after';

// Returns an array of keywords with horizontal first and vertical second
const getSide = (orientation: string, position?: string): string[] => {
	position = position || getDefaultPosition(orientation);

	if (orientation === 'horizontal') {
		switch (position) {
			case 'above':
			case 'below':
				return ['auto', position];
			case 'above after':
			case 'above before':
			case 'above center':
			case 'above left':
			case 'above right':
			case 'below after':
			case 'below before':
			case 'below center':
			case 'below left':
			case 'below right':
				return position.split(' ').reverse();
			default:
				// invalid values for horizontal so use defaults
				return ['auto', 'above'];
		}
	} else if (orientation === 'vertical') {
		switch (position) {
			case 'after':
			case 'before':
			case 'left':
			case 'right':
				return [position, 'above'];
			default:
				// invalid values for horizontal so use defaults
				return ['after', 'auto'];
		}
	} else {
		switch (position) {
			case 'above':
			case 'below':
				return ['auto', position];
			case 'above after':
			case 'above before':
			case 'above center':
			case 'above left':
			case 'above right':
			case 'below after':
			case 'below before':
			case 'below center':
			case 'below left':
			case 'below right':
				return position.split(' ').reverse();
			case 'after':
			case 'before':
			case 'left':
			case 'right':
				return [position, 'above'];
			default:
				// invalid values for radial so use defaults
				return ['auto', 'above'];
		}
	}
};

export interface ProgressBarTooltipBaseProps {
	children?: ReactNode;
	css?: Record<string, string>;
	orientation?: 'horizontal' | 'vertical' | 'radial';
	percent?: boolean;
	position?: 'above' | 'above before' | 'above left' | 'above after' | 'above center' | 'above right' |
		'below' | 'below left' | 'below before' | 'below center' | 'below right' | 'below after' |
		'left' | 'before' | 'right' | 'after';
	proportion?: number;
	rtl?: boolean;
	visible?: boolean;
}

/**
 * A {@link limestone/TooltipDecorator.Tooltip|Tooltip} specifically adapted for use with
 * {@link limestone/ProgressBar.ProgressBar|ProgressBar} or
 * {@link limestone/Slider.Slider|Slider}.
 *
 * @class ProgressBarTooltip
 * @memberof limestone/ProgressBar
 * @ui
 * @public
 */
const ProgressBarTooltipBase = kind({
	name: 'ProgressBarTooltip',

	_propTypes: {} as ProgressBarTooltipBaseProps,

	propTypes: /** @lends limestone/ProgressBar.ProgressBarTooltip.prototype */{
		css: PropTypes.object as PropTypes.Validator<Record<string, string> | undefined>,

		orientation: PropTypes.oneOf(['horizontal', 'vertical', 'radial']) as PropTypes.Validator<'horizontal' | 'vertical' | 'radial' | undefined>,

		percent: PropTypes.bool,

		position: validatePosition(PropTypes.oneOf([
			// horizontal or radial
			'above',
			'above before',
			'above left',
			'above center',
			'above after',
			'above right',
			'below',
			'below left',
			'below before',
			'below center',
			'below right',
			'below after',

			// vertical or radial
			'left',
			'before',
			'right',
			'after'
		])) as PropTypes.Validator<ProgressBarTooltipBaseProps['position']>,

		proportion: PropTypes.number,

		rtl: PropTypes.bool,

		visible: PropTypes.bool
	},

	defaultProps: {
		orientation: 'horizontal',
		percent: false,
		proportion: 0,
		visible: false
	},

	styles: {
		css: componentCss,
		className: 'tooltip',
		publicClassNames: true
	},

	computed: {
		children: ({children, proportion, percent}) => {
			if (percent) {
				const formatter = memoizedPercentFormatter(ilib.getLocale());

				return formatter.format(Math.round((proportion as number) * 100));
			}

			return children;
		},
		className: ({orientation, position, proportion, styler}) => {
			const [h, v] = getSide(orientation as string, position);

			return styler.append(
				orientation,
				{
					above: (v === 'above' && !isVerticalModeRadial(orientation as string, position as string)),
					below: (v === 'below' && !isVerticalModeRadial(orientation as string, position as string)),
					before: (h === 'before'),
					after: (h === 'after'),
					center: (h === 'center'),
					left: (h === 'left' || (h === 'auto' && (proportion as number) <= 0.5)),
					right: (h === 'right' || (h === 'auto' && (proportion as number) > 0.5))
				}
			);
		},
		arrowAnchor: ({orientation, position, rtl}) => {
			if (orientation === 'vertical' || isVerticalModeRadial(orientation as string, position as string)) return 'middle';

			const [h] = getSide(orientation as string, position);
			switch (h) {
				case 'auto':
					return 'center';
				case 'before':
					return rtl ? 'right' : 'left';
				case 'after':
					return rtl ? 'left' : 'right';
				case 'left':
				case 'right':
				case 'center':
					return h;
			}
		},
		direction: ({orientation, position, rtl}) => {
			const [h, v] = getSide(orientation as string, position);

			let dir = 'right';
			if (orientation === 'vertical' || isVerticalModeRadial(orientation as string, position as string)) {
				if (
					// forced to the left
					h === 'left' ||
					// LTR before
					(!rtl && h === 'before') ||
					// RTL after
					(rtl && h === 'after')
				) {
					dir = 'left';
				}
			} else {
				dir = v !== 'below' ? 'above' : 'below';
			}
			return dir;
		},
		style: ({proportion, style}) => ({
			...style,
			'--tooltip-progress-proportion': proportion
		})
	},

	render: ({children, css, visible, ...rest}) => {
		if (!visible) return null;

		const restProps = rest as Record<string, any>;
		delete restProps.orientation;
		delete restProps.percent;
		delete restProps.position;
		delete restProps.proportion;
		delete restProps.rtl;

		return (
			<Tooltip {...restProps} css={css}>
				{children}
			</Tooltip>
		);
	}
});

const ProgressBarTooltip = I18nContextDecorator(
	{rtlProp: 'rtl'},
	ProgressBarTooltipBase
) as ComponentType<ProgressBarTooltipBaseProps>;
(ProgressBarTooltip as any).defaultSlot = 'tooltip';

export default ProgressBarTooltip;
export {
	ProgressBarTooltip,
	ProgressBarTooltipBase
};
