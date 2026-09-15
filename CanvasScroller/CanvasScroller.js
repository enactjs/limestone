/**
 * Provides a Limestone-styled Scroller that paints a large, static content block into a canvas
 * instead of building a DOM subtree for it.
 *
 * This is a *content* strategy, not a scroll strategy: {@link limestone/Scroller.Scroller} still
 * owns scrolling, Spotlight, scrollbars and overscroll. Only the rendering of the block changes.
 * Use it for genuinely static, non-interactive prose — EULAs, terms, release notes, open-source
 * notices, long help articles. Do not use it for anything containing focusable children, marquee
 * text, or content that changes after mount; those lose Spotlight and will not paint correctly.
 *
 * @example
 * <CanvasScroller
 * 	blocks={[
 * 		{type: 'heading', text: 'Terms of Service'},
 * 		{type: 'paragraph', text: 'Lorem ipsum dolor sit amet…'}
 * 	]}
 * />
 *
 * @module limestone/CanvasScroller
 * @exports CanvasContentBlock
 * @exports CanvasScroller
 */

import PropTypes from 'prop-types';

import Scroller from '../Scroller';

import CanvasContentBlock from './CanvasContentBlock';

/**
 * A Limestone-styled Scroller whose content is a canvas-painted static text block.
 *
 * Accepts every {@link limestone/Scroller.Scroller} prop; `blocks`, `contentWidth` and `metrics`
 * are consumed here and the rest are forwarded.
 *
 * @class CanvasScroller
 * @memberof limestone/CanvasScroller
 * @extends limestone/Scroller.Scroller
 * @ui
 * @public
 */
const CanvasScroller = ({blocks, contentWidth, metrics, ...rest}) => (
	<Scroller direction="vertical" focusableScrollbar="byEnter" {...rest}>
		<CanvasContentBlock blocks={blocks} metrics={metrics} width={contentWidth} />
	</Scroller>
);

CanvasScroller.displayName = 'CanvasScroller';

CanvasScroller.propTypes = /** @lends limestone/CanvasScroller.CanvasScroller.prototype */ {
	/**
	 * The static content to paint.
	 *
	 * Each entry is `{type: 'heading' | 'paragraph', text: String}`. The model is measured and
	 * broken into lines once; mutating it re-runs that pass, so keep the reference stable.
	 *
	 * @type {Object[]}
	 * @required
	 * @public
	 */
	blocks: PropTypes.arrayOf(PropTypes.shape({
		text: PropTypes.string.isRequired,
		type: PropTypes.oneOf(['heading', 'paragraph'])
	})).isRequired,

	/**
	 * Content width in CSS pixels.
	 *
	 * Measured from the space the Scroller provides when omitted.
	 *
	 * @type {Number}
	 * @public
	 */
	contentWidth: PropTypes.number,

	/**
	 * Type scale overrides, in 1080p design pixels.
	 *
	 * Recognized keys: `bodySize`, `bodyFamily`, `bodyColor`, `bodyLineHeight`, `headingSize`,
	 * `headingFamily`, `headingWeight`, `headingColor`, `headingLineHeight`, `paragraphGap`,
	 * `blockGap`, `paddingX`, `paddingY`, `background`.
	 *
	 * Like `blocks`, this takes part in the layout memo — pass a hoisted constant, not an inline
	 * object literal, or every render re-runs the measure pass.
	 *
	 * @type {Object}
	 * @public
	 */
	metrics: PropTypes.object
};

export default CanvasScroller;
export {
	CanvasContentBlock,
	CanvasScroller
};
