/**
 * A vertical marquee for multi-line text that overflows its visible area.
 *
 * Wraps {@link ui/Marquee.Marquee|ui/Marquee} with `orientation="vertical"`. The text scrolls
 * through one full pass, pauses, then repeats while the trigger (focus, hover, or render)
 * is active.
 *
 * @example
 * <VerticalMarquee maxLines={3}>
 *   A long paragraph that needs more than three lines.
 * </VerticalMarquee>
 *
 * @module limestone/VerticalMarquee
 * @exports VerticalMarquee
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';

import {MarqueeBase, MarqueeDecorator} from '../Marquee';

import componentCss from './VerticalMarquee.module.less';

const Marquee = MarqueeDecorator({component: MarqueeBase}, 'div');

/**
 * Vertically scrolls children that overflow `maxLines`.
 *
 * The component needs a bounded width so the text wraps. When the wrapped text is
 * taller than `maxLines`, and the marquee trigger is active, the text scrolls
 * upward by the laid-out block height plus `marqueeSpacing` (one cycle), pauses, then repeats.
 *
 * When `marqueeOn` is `'focus'`, this component does not become focusable on its own.
 * Focus must land on this node, usually from a parent such as
 * {@link spotlight/Spottable.Spottable|Spottable}.
 *
 * @class VerticalMarquee
 * @memberof limestone/VerticalMarquee
 * @extends ui/Marquee.Marquee
 * @ui
 * @public
 */
const VerticalMarquee = ({className, css, marqueeSpeed = 30, maxLines = 3, ...rest}) => (
	<Marquee
		{...rest}
		className={classNames(componentCss.verticalMarquee, css && css.verticalMarquee, className)}
		css={css}
		marqueeSpeed={marqueeSpeed}
		maxLines={maxLines}
		orientation="vertical"
	/>
);

VerticalMarquee.displayName = 'VerticalMarquee';

VerticalMarquee.propTypes = /** @lends limestone/VerticalMarquee.VerticalMarquee.prototype */ {
	/**
	 * The text to scroll.
	 *
	 * @type {Node}
	 * @public
	 */
	children: PropTypes.node,

	/**
	 * Custom CSS class name applied to the root.
	 *
	 * @type {String}
	 * @public
	 */
	className: PropTypes.string,

	/**
	 * Custom CSS classes.
	 *
	 * The following classes are supported:
	 *
	 * * `verticalMarquee` - The root
	 * * `marquee` - The marquee root
	 * * `text` - The track
	 * * `content` - The text block
	 * * `spacing` - The space between the text and its duplicate
	 * * `animate` - Applied while the text is scrolling
	 * * `willAnimate` - Applied shortly before scrolling
	 *
	 * @type {Object}
	 * @public
	 */
	css: PropTypes.object,

	/**
	 * Passed through to the wrapped component.
	 *
	 * A `marqueeOn="focus"` marquee still starts on focus, the same as `limestone/Marquee`.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	disabled: PropTypes.bool,

	/**
	 * Delay in milliseconds before the text starts scrolling.
	 *
	 * @type {Number}
	 * @default 1000
	 * @public
	 */
	marqueeDelay: PropTypes.number,

	/**
	 * Stops the marquee and renders the children without the scrolling markup.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	marqueeDisabled: PropTypes.bool,

	/**
	 * What starts the marquee.
	 *
	 * @type {('focus'|'hover'|'render')}
	 * @default 'focus'
	 * @public
	 */
	marqueeOn: PropTypes.oneOf(['focus', 'hover', 'render']),

	/**
	 * Delay in milliseconds before a `marqueeOn="render"` marquee starts.
	 *
	 * @type {Number}
	 * @default 1000
	 * @public
	 */
	marqueeOnRenderDelay: PropTypes.number,

	/**
	 * Delay in milliseconds after a cycle before the next one.
	 *
	 * @type {Number}
	 * @default 1000
	 * @public
	 */
	marqueeResetDelay: PropTypes.number,

	/**
	 * Space between the text and its duplicate. A percentage is of the visible height.
	 *
	 * @type {Number|String}
	 * @default '50%'
	 * @public
	 */
	marqueeSpacing: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

	/**
	 * Speed in pixels per second.
	 *
	 * @type {Number}
	 * @default 30
	 * @public
	 */
	marqueeSpeed: PropTypes.number,

	/**
	 * How many lines stay visible.
	 *
	 * @type {Number}
	 * @default 3
	 * @public
	 */
	maxLines: PropTypes.number
};

export default VerticalMarquee;
export {
	VerticalMarquee
};
