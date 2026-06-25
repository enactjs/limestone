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
		/**
		 * The node to be displayed as the main content of the tooltip.
		 *
		 * @type {Node}
		 * @required
		 */
		children: PropTypes.node.isRequired,

		/**
		 * Centers the text when `marquee` is also set.
		 *
		 * @type {Boolean}
		 * @public
		 */
		centered: PropTypes.bool,

		/**
		 * Apply a marquee to support long text.
		 *
		 * It is recommended that you specify a `width` also. If none is specified, a default width
		 * of 600px will be used.
		 *
		 * @type {Boolean}
		 * @public
		 */
		marquee: PropTypes.bool,

		/**
		 * `Tooltip` without the arrow.
		 *
		 * @type {Boolean}
		 * @public
		 */
		noArrow: PropTypes.bool,

		/**
		 * Source for the image.
		 * String value or Object of values used to determine which image will appear on
		 * a specific screenSize.
		 *
		 * @type {String|Object}
		 * @public
		 */
		tooltipImage: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

		/**
		 * The size of the image.
		 *
		 * The following properties should be provided:
		 * * `height` - The height of the image
		 * * `width` - The width of the image
		 *
		 * @type {Object}
		 * @public
		 */
		tooltipImageSize: PropTypes.shape({
			height: PropTypes.number,
			width: PropTypes.number
		}),

		/**
		 * The width of tooltip content.
		 *
		 * Value expects a number of pixels, which will be automatically scaled to the appropriate
		 * size given the current screen resolution, or a string value containing a measurement and
		 * a valid CSS unit included.
		 * If the content goes over the given width, it will automatically wrap, or marquee if
		 * `marquee` is enabled.
		 *
		 * When `null`, content will auto-size and not wrap. If `marquee` is also enabled,
		 * marqueeing will begin when the width is greater than the default (theme specified) width.
		 *
		 * @type {Number|String}
		 * @public
		 */
		width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
	},

	styles: {
		css: componentCss,
		name: 'tooltipLabel',
		publicClassNames: true
	},

	computed: {
		className: ({tooltipImage, marquee, noArrow, styler, width}) => styler.append({
			multi: (!marquee && (!!width || !!tooltipImage)),
			marquee,
			noArrow: !!noArrow,
			image: !!tooltipImage
		}),
		style: ({children, width, tooltipImageSize, style}) => {
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

	render: ({centered, children, css, tooltipImage, marquee, ...rest}) => {
		delete rest.noArrow;
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
