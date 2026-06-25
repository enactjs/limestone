/**
 * Limestone styled tooltip components.
 *
 * @module limestone/TooltipDecorator
 * @exports Tooltip
 * @exports TooltipBase
 * @exports TooltipDecorator
 */

import hoc from '@enact/core/hoc';
import {checkPropTypes} from '@enact/core/util';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import PropTypes from 'prop-types';

import {Tooltip, TooltipBase} from './Tooltip';
import {defaultScreenEdgeKeepout, useTooltip} from './useTooltip';

/**
 * Default config for {@link limestone/TooltipDecorator.TooltipDecorator|TooltipDecorator}
 *
 * @memberof limestone/TooltipDecorator.TooltipDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * The boundary around the screen which the tooltip should never cross, typically involving
	 * flipping to an alternate orientation or adjusting its offset to remain on screen.
	 * The default of 48 is derived from a standard 24px screen-keepout size plus the standard
	 * Spotlight-outset (24px) margin/padding value which keeps elements and text aligned inside a
	 * {@link limestone/Panels.Panel|Panel}. Note: This value will be scaled according to the
	 * resolution.
	 *
	 * @type {Number}
	 * @default 48
	 * @memberof limestone/TooltipDecorator.TooltipDecorator.defaultConfig
	 */
	screenEdgeKeepout: defaultScreenEdgeKeepout,

	/**
	 * The name of the property which will receive the tooltip node.
	 *
	 * By default, `TooltipDecorator` will add a new child to the wrapped component, following any
	 * other children passed in. If a component needs to, it can specify another property to receive
	 * the tooltip and the `children` property will not be modified.
	 *
	 * @type {String}
	 * @default 'children'
	 * @memberof limestone/TooltipDecorator.TooltipDecorator.defaultConfig
	 */
	tooltipDestinationProp: 'children'
};

/**
 * A higher-order component which positions {@link limestone/TooltipDecorator.Tooltip|Tooltip} in
 * relation to the wrapped component.
 *
 * The tooltip is automatically displayed when the decorated component is focused after a set
 * period of time.
 *
 * The tooltip is positioned around the decorator where there is available window space.
 *
 * Note that the direction of tooltip will be flipped horizontally in RTL locales.
 *
 * @class TooltipDecorator
 * @memberof limestone/TooltipDecorator
 * @hoc
 * @public
 */
const TooltipDecorator = hoc(defaultConfig, (config, Wrapped) => {

	const {screenEdgeKeepout, tooltipDestinationProp} = config;

	const Decorator = (props) => {
		checkPropTypes(Decorator, props);
		const {tooltip, handlers, restProps} = useTooltip({screenEdgeKeepout, ...props});
		const tooltipRestProps = Object.assign({}, restProps);

		if (tooltip) {
			if (tooltipDestinationProp === 'children') {
				Object.assign(tooltipRestProps, {children: [props.children, tooltip]});
			} else {
				Object.assign(tooltipRestProps, {[tooltipDestinationProp]: tooltip});
			}
		}

		return <Wrapped {...tooltipRestProps} {...handlers} />;
	};

	Decorator.displayName = 'TooltipDecorator';

	Decorator.propTypes = /** @lends limestone/TooltipDecorator.TooltipDecorator.prototype */ {
		/**
		 * Disables the component but does not affect tooltip operation.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * `Tooltip` without the arrow.
		 *
		 * @type {Boolean}
		 * @public
		 */
		noArrow: PropTypes.bool,

		/**
		 * Indicates the tooltip text direction is right-to-left.
		 *
		 * @type {Boolean}
		 * @private
		 */
		rtl: PropTypes.bool,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `tooltip` - The root class name
		 *
		 * @type {Object}
		 * @public
		 */
		tooltipCss: PropTypes.object,

		/**
		 * Time to wait (in milliseconds) before showing tooltip on hover.
		 *
		 * @type {Number}
		 * @default 500
		 * @public
		 */
		tooltipDelay: PropTypes.number,

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
		 * Allows the tooltip to marquee.
		 *
		 * Specifying a {@link limestone/TooltipDecorator.TooltipDecorator.tooltipWidth|tooltipWidth}
		 * restricts the marquee to that size.
		 *
		 * @type {Boolean}
		 * @public
		 */
		tooltipMarquee: PropTypes.bool,

		/**
		 * Position of the tooltip with respect to the wrapped component.
		 *
		 * | *Value* | *Tooltip Direction* |
		 * |---|---|
		 * | `'above'` | Above component, flowing to the right |
		 * | `'above center'` | Above component, centered |
		 * | `'above left'` | Above component, flowing to the left |
		 * | `'above right'` | Above component, flowing to the right |
		 * | `'below'` | Below component, flowing to the right |
		 * | `'below center'` | Below component, centered |
		 * | `'below left'` | Below component, flowing to the left |
		 * | `'below right'` | Below component, flowing to the right |
		 * | `'left bottom'` | Left of the component, contents at the bottom |
		 * | `'left middle'` | Left of the component, contents middle aligned |
		 * | `'left top'` | Left of the component, contents at the top |
		 * | `'right bottom'` | Right of the component, contents at the bottom |
		 * | `'right middle'` | Right of the component, contents middle aligned |
		 * | `'right top'` | Right of the component, contents at the top |
		 *
		 * `TooltipDecorator` attempts to choose the best direction to meet layout and language
		 * requirements. Left and right directions will reverse for RTL languages. Additionally,
		 * the tooltip will reverse direction if it will prevent overflowing off the viewport
		 *
		 * For `type="balloon"`, the default is `"top right"`
		 * For `type="transparent"`, the default is `"bottom center"`
		 *
		 * @type {('above'|'above center'|'above left'|'above right'|'below'|
		 *  'below center'|'below left'|'below right'|'left bottom'|'left middle'|'left top'|
		 * 	'right bottom'|'right middle'|'right top')}
		 * @public
		 */
		tooltipPosition: PropTypes.oneOf([
			'above', 'above center', 'above left', 'above right',
			'below', 'below center', 'below left', 'below right',
			'left bottom', 'left middle', 'left top',
			'right bottom', 'right middle', 'right top']),

		/**
		 * Properties to be passed to tooltip component.
		 *
		 * @type {Object}
		 * @public
		 */
		tooltipProps: PropTypes.object,

		/**
		 * Positions the tooltip relative to its container.
		 *
		 * Determines whether your tooltip should position itself relative to its container or
		 * relative to the screen (absolute positioning on the floating layer). When setting to
		 * `true`, to enable relative positioning, it may be important to specify the
		 * `tooltipDestinationProp` key in this HoC's config object. A relatively positioned
		 * Tooltip for a `Button`, for example, must be placed in the `decoration` prop.
		 *
		 * It may be necessary to assign the CSS rule `position` to the containing element so
		 * relatively positioned Tooltip has a frame to "stick to" the edge of.
		 *
		 * Anchoring points can be visualized as follows:
		 * ```
		 * ┌───◎───┐
		 * ◎       ◎
		 * └───◎───┘
		 * ```
		 *
		 * @type {Boolean}
		 * @public
		 */
		tooltipRelative: PropTypes.bool,

		/**
		 * Tooltip content.
		 *
		 * @type {String|Node}
		 * @public
		 */
		tooltipText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

		/**
		 * Type of tooltip.
		 *
		 * | *Value* | *Tooltip Appearance* |
		 * |---|---|
		 * | `'balloon'` | Tooltip with a border, background and arrow to the activator |
		 * | `'transparent'` | Text only without any of the decorations above |
		 *
		 * @type {('balloon'|'transparent')}
		 * @default 'balloon'
		 * @public
		 */
		tooltipType: PropTypes.oneOf(['balloon', 'transparent']),

		/**
		 * The interval (in milliseconds) to recheck the math for a currently showing tooltip's
		 * positioning and orientation. Useful if your anchor element moves.
		 *
		 * @type {Number}
		 * @default 400
		 * @public
		 */
		tooltipUpdateDelay: PropTypes.number,

		/**
		 * The width of tooltip content.
		 *
		 * Value expects a number of pixels, which will be automatically scaled to the
		 * appropriate size given the current screen resolution, or a string value containing a
		 * measurement and a valid CSS unit included. If the content goes over the given width,
		 * it will automatically wrap, or marquee if `marquee` is enabled.
		 *
		 * When `null`, content will auto-size and not wrap. If `tooltipMarquee` is also
		 * enabled, marqueeing will begin when the width is greater than the default (theme
		 * specified) width.
		 *
		 * @type {Number|String}
		 * @public
		 */
		tooltipWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
	};

	return I18nContextDecorator(
		{rtlProp: 'rtl'},
		Decorator
	);
});

export default TooltipDecorator;
export {
	Tooltip,
	TooltipBase,
	TooltipDecorator,
	useTooltip
};
