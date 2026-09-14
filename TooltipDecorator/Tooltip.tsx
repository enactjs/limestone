import EnactPropTypes, {EnactPropTypeShapes} from '@enact/core/internal/prop-types';
import kind from '@enact/core/kind';
import {usePublicClassNames} from '@enact/core/usePublicClassNames';
import PropTypes from 'prop-types';
import type {ComponentType, Ref} from 'react';

import Skinnable from '../Skinnable';

import TooltipLabel from './TooltipLabel';
import componentCss from './Tooltip.module.less';


// Set the default Arrow Anchor value based on the type of tooltip
function defaultArrowAnchor (type: string) {
	return (type === 'transparent' ? 'center' : 'right');
}

// Set the default Direction of tooltip based on the type of tooltip
function defaultDirection (type: string) {
	return (type === 'transparent' ? 'below' : 'above');
}

/**
 * A stateless tooltip component with Limestone styling applied.
 *
 * @class TooltipBase
 * @memberof limestone/TooltipDecorator
 * @ui
 * @public
 */
const TooltipBase = kind({
	name: 'Tooltip',

	propTypes: /** @lends limestone/TooltipDecorator.TooltipBase.prototype */ {
		children: PropTypes.node.isRequired,
		arrowAnchor: PropTypes.oneOf(['left', 'center', 'right', 'top', 'middle', 'bottom']),
		css: PropTypes.object,
		direction: PropTypes.oneOf(['above', 'below', 'left', 'right']),
		labelOffset: PropTypes.number,
		marquee: PropTypes.bool,
		noArrow: PropTypes.bool,
		position: PropTypes.shape({
			bottom: PropTypes.number,
			left: PropTypes.number,
			right: PropTypes.number,
			top: PropTypes.number
		}),
		relative: PropTypes.bool,
		tooltipCss: PropTypes.object,
		tooltipImage: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		tooltipImagePosition: PropTypes.oneOf(['above', 'below']),
		tooltipImageSize: PropTypes.shape({
			height: PropTypes.number,
			width: PropTypes.number
		}),
		tooltipRef: EnactPropTypes.ref as PropTypes.Validator<EnactPropTypeShapes.ref | undefined>,
		type: PropTypes.oneOf(['balloon', 'transparent']),
		width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
	},

	defaultProps: {
		tooltipCss: {},
		tooltipImagePosition: 'above',
		type: 'balloon',
		labelOffset: 0
	},

	styles: {
		css: componentCss,
		className: 'tooltip',
		publicClassNames: ['tooltip', 'tooltipLabel']
	},

	computed: {
		labelOffset: ({labelOffset}: Record<string, any>) => {
			if (labelOffset) {
				const cappedPosition = Math.max(-0.5, Math.min(0.5, labelOffset));
				return {transform: `translateX(${cappedPosition * 100}%)`};
			}
		},
		className: ({direction, arrowAnchor, noArrow, relative, tooltipCss, type, styler}: Record<string, any>) => styler.append(direction || defaultDirection(type), `${arrowAnchor || defaultArrowAnchor(type)}Arrow`, tooltipCss.tooltip, {relative, absolute: !relative, noArrow}, type),
		style: ({position, style}: Record<string, any>) => {
			return {
				...style,
				...position
			};
		}
	},

	render: ({arrowAnchor, children, css, tooltipImage, tooltipImagePosition, noArrow, tooltipCss, tooltipImageSize, tooltipRef, width, labelOffset, marquee, ...rest}: Record<string, any>) => {
		delete rest.labelOffset;
		delete rest.direction;
		delete rest.position;
		delete rest.relative;
		delete rest.type;

		// eslint-disable-next-line react-hooks/rules-of-hooks
		const mergedCss = usePublicClassNames({componentCss: css, customCss: tooltipCss, publicClassNames: true}) as Record<string, string>;

		return (
			<div {...rest}>
				<div className={mergedCss.tooltipAnchor} ref={tooltipRef as Ref<HTMLDivElement>} >
					{!noArrow && <div className={mergedCss.tooltipArrow} />}
					<TooltipLabel
						className={mergedCss.tooltipLabel}
						tooltipImage={tooltipImage}
						tooltipImagePosition={tooltipImagePosition}
						marquee={marquee}
						noArrow={noArrow}
						centered={arrowAnchor === 'center'}
						width={width}
						style={labelOffset}
						tooltipImageSize={tooltipImageSize}
					>
						{children}
					</TooltipLabel>
				</div>
			</div>
		);
	}
});

/**
 * A tooltip component with Limestone styling applied.
 *
 * @class Tooltip
 * @memberof limestone/TooltipDecorator
 * @ui
 * @public
 */
const Tooltip = Skinnable(TooltipBase) as ComponentType<any>;

export default Tooltip;
export {Tooltip, TooltipBase, defaultArrowAnchor, defaultDirection};
