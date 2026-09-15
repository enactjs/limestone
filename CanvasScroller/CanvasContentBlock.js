/**
 * A large, static block of text painted into a 2D canvas instead of a DOM subtree.
 *
 * Designed to be dropped *inside* an existing {@link limestone/Scroller.Scroller} — it does not
 * replace the scroll engine. The browser still owns scrolling; this component owns painting.
 *
 * How it works:
 * - the wrapper reserves the full content height, so the scroller's bounds and scrollbar are
 *   unchanged and 5-way/wheel/drag scrolling behave exactly as they do for DOM content;
 * - a single viewport-sized `<canvas>` is stuck to the top of the scrollport with `position: sticky`
 *   and repainted with the slice of text currently on screen. Painting is O(visible lines), not
 *   O(content), so cost is flat no matter how long the block is;
 * - the text is mirrored once into a visually-hidden node so screen readers and text search still
 *   see real text. That mirror is one element, not one per paragraph.
 *
 * @module limestone/CanvasScroller/CanvasContentBlock
 * @private
 */

import PropTypes from 'prop-types';
import {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';

import {firstLineAtOrAfter, layoutBlocks} from './textLayout';

import css from './CanvasScroller.module.less';

// Frames to keep repainting after the last scroll event, so the final resting position is correct
// even though `scroll` fires before the compositor settles.
const IDLE_FRAMES = 6;

const findScrollParent = (node) => {
	let el = node && node.parentElement;

	while (el) {
		const {overflowY} = window.getComputedStyle(el);

		if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') {
			return el;
		}
		el = el.parentElement;
	}

	return null;
};

/**
 * Paints a static content model to a canvas inside a scroller.
 *
 * @class CanvasContentBlock
 * @memberof limestone/CanvasScroller
 * @ui
 * @private
 */
const CanvasContentBlock = ({blocks, metrics, width, ...rest}) => {
	const rootRef = useRef(null);
	const canvasRef = useRef(null);
	const ctxRef = useRef(null);
	const scrollParentRef = useRef(null);
	const layoutRef = useRef(null);
	const offsetRef = useRef(0);      // our top edge, in the scroller's content space
	const rafRef = useRef(0);
	const idleRef = useRef(0);
	const dprRef = useRef(1);

	// `width` is optional: when omitted the block measures the space the Scroller gives it.
	const [measuredWidth, setMeasuredWidth] = useState(0);
	const effectiveWidth = width || measuredWidth;

	const layout = useMemo(
		() => (effectiveWidth > 0 ? layoutBlocks(blocks, effectiveWidth, metrics) : null),
		[blocks, effectiveWidth, metrics]
	);

	layoutRef.current = layout;

	// One text node for assistive tech, instead of one DOM node per paragraph.
	const plainText = useMemo(() => blocks.map((b) => b.text).join('\n\n'), [blocks]);

	const paint = useCallback(() => {
		const canvas = canvasRef.current;
		const ctx = ctxRef.current;
		const scrollParent = scrollParentRef.current;
		const current = layoutRef.current;

		if (!canvas || !ctx || !scrollParent || !current) return;

		const dpr = dprRef.current;
		const viewWidth = canvas.width / dpr;
		const viewHeight = canvas.height / dpr;
		const maxTop = Math.max(0, current.height - viewHeight);
		const top = Math.min(Math.max(0, scrollParent.scrollTop - offsetRef.current), maxTop);
		const {lines, metrics: m} = current;

		ctx.save();
		ctx.scale(dpr, dpr);
		ctx.clearRect(0, 0, viewWidth, viewHeight);

		if (m.background && m.background !== 'transparent') {
			ctx.fillStyle = m.background;
			ctx.fillRect(0, 0, viewWidth, viewHeight);
		}

		ctx.textBaseline = 'top';

		// Start one heading-height above the fold so a line straddling the top edge is still drawn.
		let i = firstLineAtOrAfter(lines, top - m.headingLineHeightPx);
		let font = null;
		let fill = null;

		for (; i < lines.length; i++) {
			const line = lines[i];

			if (line.y > top + viewHeight) break;

			if (line.font !== font) {
				ctx.font = line.font;
				font = line.font;
			}
			if (line.color !== fill) {
				ctx.fillStyle = line.color;
				fill = line.color;
			}
			ctx.fillText(line.text, m.paddingXPx, line.y - top);
		}

		ctx.restore();
	}, []);

	const pump = useCallback(() => {
		paint();

		if (++idleRef.current < IDLE_FRAMES) {
			rafRef.current = requestAnimationFrame(pump);
		} else {
			rafRef.current = 0;
		}
	}, [paint]);

	const requestPaint = useCallback(() => {
		idleRef.current = 0;

		if (!rafRef.current) {
			rafRef.current = requestAnimationFrame(pump);
		}
	}, [pump]);

	const measure = useCallback(() => {
		const root = rootRef.current;
		const canvas = canvasRef.current;
		const scrollParent = scrollParentRef.current;

		if (!root || !canvas || !scrollParent) return;

		const dpr = window.devicePixelRatio || 1;
		const viewWidth = scrollParent.clientWidth;
		const viewHeight = scrollParent.clientHeight;

		dprRef.current = dpr;
		offsetRef.current = root.getBoundingClientRect().top -
			scrollParent.getBoundingClientRect().top + scrollParent.scrollTop;

		if (!width) {
			const available = (root.parentElement || scrollParent).clientWidth;

			if (available > 0) {
				setMeasuredWidth((prev) => (prev === available ? prev : available));
			}
		}

		// Setting width/height clears the canvas, so only do it when the size actually changed.
		if (canvas.width !== Math.round(viewWidth * dpr) || canvas.height !== Math.round(viewHeight * dpr)) {
			canvas.width = Math.round(viewWidth * dpr);
			canvas.height = Math.round(viewHeight * dpr);
			canvas.style.width = `${viewWidth}px`;
			canvas.style.height = `${viewHeight}px`;
		}
	}, [width]);

	useLayoutEffect(() => {
		const canvas = canvasRef.current;

		scrollParentRef.current = findScrollParent(rootRef.current);
		ctxRef.current = canvas && canvas.getContext('2d');

		measure();
		paint();
	}, [measure, paint, layout]);

	useEffect(() => {
		const scrollParent = scrollParentRef.current;

		if (!scrollParent) return;

		const onScroll = () => requestPaint();

		scrollParent.addEventListener('scroll', onScroll, {passive: true});

		const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(() => {
			measure();
			requestPaint();
		}) : null;

		if (ro) ro.observe(scrollParent);

		return () => {
			scrollParent.removeEventListener('scroll', onScroll);
			if (ro) ro.disconnect();
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
				rafRef.current = 0;
			}
		};
	}, [measure, requestPaint]);

	return (
		<div
			{...rest}
			className={css.canvasContentBlock}
			ref={rootRef}
			style={{
				height: layout ? `${layout.height}px` : 0,
				width: effectiveWidth ? `${effectiveWidth}px` : '100%'
			}}
		>
			<canvas aria-hidden className={css.canvas} ref={canvasRef} />
			<div className={css.textMirror}>{plainText}</div>
		</div>
	);
};

CanvasContentBlock.displayName = 'CanvasContentBlock';

CanvasContentBlock.propTypes = /** @lends limestone/CanvasScroller.CanvasContentBlock.prototype */ {
	/**
	 * Static content model.
	 *
	 * @type {Object[]}
	 * @required
	 * @private
	 */
	blocks: PropTypes.arrayOf(PropTypes.shape({
		text: PropTypes.string.isRequired,
		type: PropTypes.oneOf(['heading', 'paragraph'])
	})).isRequired,

	/**
	 * Type scale overrides, in 1080p design pixels.
	 *
	 * @type {Object}
	 * @private
	 */
	metrics: PropTypes.object,

	/**
	 * Content width in CSS pixels. Measured from the available space when omitted.
	 *
	 * @type {Number}
	 * @private
	 */
	width: PropTypes.number
};

export default CanvasContentBlock;
export {
	CanvasContentBlock
};
