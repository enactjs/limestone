import kind from '@enact/core/kind';
import {isRtlText} from '@enact/i18n/util';
import {scaleToRem} from '@enact/ui/resolution';
import PropTypes from 'prop-types';

import Image from '../Image';
import Marquee from '../Marquee';

import componentCss from './Tooltip.module.less';


/**
 * {@link limestone/TooltipDecorator.TooltipLabel} is a stateless tooltip component with
 * Limestone styling applied.
 *
 * @class TooltipLabel
 * @memberof limestone/TooltipDecorator
 * @ui
 * @private
 */
const TooltipLabel = kind({
	name: 'TooltipLabel',

	propTypes: /** @lends limestone/TooltipDecorator.TooltipLabel.prototype */ {
		children: PropTypes.node.isRequired,
		centered: PropTypes.bool,
		marquee: PropTypes.bool,
		noArrow: PropTypes.bool,
		tooltipImage: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		tooltipImagePosition: PropTypes.oneOf(['above', 'below']),
		tooltipImageSize: PropTypes.shape({
			height: PropTypes.number,
			width: PropTypes.number
		}),
		width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
	},

	defaultProps: {
		tooltipImagePosition: 'above'
	},

	styles: {
		css: componentCss,
		name: 'tooltipLabel',
		publicClassNames: true
	} as any,

	computed: {
		className: ({tooltipImage, tooltipImagePosition, marquee, noArrow, styler, width}: Record<string, any>) => styler.append({
			multi: (!marquee && (!!width || !!tooltipImage)),
			marquee,
			noArrow: !!noArrow,
			image: !!tooltipImage,
			imageBelow: !!tooltipImage && tooltipImagePosition === 'below'
		}),
		style: ({children, width, tooltipImageSize, style}: Record<string, any>) => {
			const enforcedWidth = typeof width === 'number' ? scaleToRem(width) : width;

			return {
				...style,
				direction: isRtlText(children) ? 'rtl' : 'ltr',
				'--lime-tooltip-label-width': (tooltipImageSize?.width ? scaleToRem(tooltipImageSize?.width) : enforcedWidth),
				'--lime-tooltip-image-width': tooltipImageSize?.width && scaleToRem(tooltipImageSize?.width),
				'--lime-tooltip-image-height': tooltipImageSize?.width && scaleToRem(tooltipImageSize?.height)
			};
		}
	},

	render: ({centered, children, css, tooltipImage, tooltipImagePosition, marquee, ...rest}: Record<string, any>) => {
		delete rest.noArrow;
		delete rest.tooltipImagePosition;
		delete rest.tooltipImageSize;
		delete rest.width;

		if (marquee) {
			return (
				<div {...rest}>
					{tooltipImage && <Image className={css.tooltipImage} src={tooltipImage} />}
					<Marquee alignment={centered ? 'center' : null} marqueeOn="render">
						{children}
					</Marquee>
				</div>
			);
		} else {
			return (
				<div {...rest}>
					{tooltipImage && <Image className={css.tooltipImage} src={tooltipImage} />}
					{children}
				</div>
			);
		}
	}
});

export default TooltipLabel;
export {
	TooltipLabel
};
