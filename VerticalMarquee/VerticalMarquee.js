/**
 * A vertical marquee for multi-line text that overflows its visible area.
 *
 * Proof of concept for NXT-20756. Behavior is not final. The current cycle matches
 * {@link limestone/Marquee.Marquee|Marquee}: the text scrolls through one full pass,
 * pauses, then repeats while the trigger (focus, hover, or render) is active.
 *
 * @example
 * <VerticalMarquee maxLines={3}>
 *   A long paragraph that needs more than three lines.
 * </VerticalMarquee>
 *
 * @module limestone/VerticalMarquee
 * @exports VerticalMarquee
 */

/* global ResizeObserver */

import {on, off} from '@enact/core/dispatcher';
import {is} from '@enact/core/keymap';
import {scale} from '@enact/ui/resolution';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';

import componentCss from './VerticalMarquee.module.less';

// Lead time, in ms, to promote the text (drop the ellipsis) before the scroll starts.
const PROMOTE_LEAD_TIME = 200;

// Matches ui/Marquee so a finished cycle can snap back before the next transition.
const MINIMUM_MARQUEE_RESET_DELAY = 40;

const emptyMetrics = {
	clipHeight: 0,
	contentHeight: 0,
	lineHeight: 0,
	measured: false,
	overflows: false
};

const round2 = (value) => Math.round(value * 100) / 100;

const prefersReducedMotion = () => (
	typeof window !== 'undefined' &&
	typeof window.matchMedia === 'function' &&
	window.matchMedia('(prefers-reduced-motion: reduce)').matches
);

const readLineHeight = (node) => {
	const style = window.getComputedStyle(node);
	const parsed = Number.parseFloat(style.lineHeight);
	const fontSize = Number.parseFloat(style.fontSize);
	let raw = 0;

	if (parsed > 0) {
		raw = parsed;
	} else if (fontSize > 0) {
		raw = fontSize * 1.2;
	}

	return round2(raw);
};

const stripIds = (node) => {
	if (!node || node.nodeType !== 1) return;

	node.removeAttribute('id');
	node.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
};

const cloneContentInto = (source, target) => {
	if (!source || !target) return;

	target.replaceChildren(...Array.from(source.childNodes, (child) => child.cloneNode(true)));
	stripIds(target);
};

/*
 * Group client rects into line boxes. Fragments of one line share a top edge.
 * A later line starts about one line-height lower, so half a line keeps them apart.
 */
const sameLine = (box, top, height) => {
	const lineHeight = box.bottom - box.top;
	return Math.abs(box.top - top) <= Math.min(lineHeight, height) / 2;
};

const lineBoxes = (node) => {
	const doc = node.ownerDocument;
	if (!doc || typeof doc.createRange !== 'function') return [];

	const range = doc.createRange();
	range.selectNodeContents(node);
	if (typeof range.getClientRects !== 'function') return [];

	const boxes = [];
	Array.from(range.getClientRects()).forEach((rect) => {
		if (!(rect.height > 0) || !(rect.width > 0)) return;

		const top = round2(rect.top);
		const bottom = round2(rect.bottom);
		const match = boxes.find((box) => sameLine(box, top, rect.height));

		if (match) {
			match.bottom = Math.max(match.bottom, bottom);
			return;
		}

		boxes.push({bottom, top});
	});

	boxes.sort((a, b) => a.top - b.top);
	return boxes;
};

const measureNode = (node, maxLines) => {
	const boxes = lineBoxes(node);
	// Glyph boxes omit the half-leading, or overhang the block when the line-height is tight.
	// The duplicate is placed after the laid-out block, so the cycle uses that height.
	const blockHeight = round2(node.getBoundingClientRect().height);

	if (boxes.length > 0) {
		const overflows = boxes.length > maxLines;
		const glyphHeight = round2(boxes[0].bottom - boxes[0].top);
		const gap = boxes.length > 1 ? round2(boxes[1].top - boxes[0].top) : 0;
		const lineHeight = gap > 0 ? gap : glyphHeight;
		// The next line's top is the bottom of the last visible line, including its descenders.
		// Text that fits uses the block height so the last line is not clipped.
		let clipHeight = blockHeight;
		if (overflows) {
			const nextTop = boxes[maxLines] ? round2(boxes[maxLines].top - boxes[0].top) : 0;
			clipHeight = nextTop > 0 ? nextTop : round2(lineHeight * maxLines);
		}

		return {
			clipHeight,
			contentHeight: blockHeight,
			lineHeight,
			measured: clipHeight > 0,
			overflows
		};
	}

	const fallbackLineHeight = readLineHeight(node);
	const fallbackContentHeight = blockHeight;
	const fallbackClipHeight = round2(fallbackLineHeight * maxLines);

	return {
		clipHeight: fallbackClipHeight,
		contentHeight: fallbackContentHeight,
		lineHeight: fallbackLineHeight,
		measured: fallbackLineHeight > 0,
		overflows: fallbackLineHeight > 0 && fallbackContentHeight > fallbackClipHeight + 1
	};
};

/*
 * Spacing between the text and its duplicate.
 * A percentage is relative to the visible area (maxLines * line-height).
 * A number is a 1920x1080 pixel value scaled for the current resolution.
 */
const getSpacing = (visibleHeight, marqueeSpacing) => {
	if (typeof marqueeSpacing === 'number' && Number.isFinite(marqueeSpacing)) {
		return scale(marqueeSpacing);
	}

	if (typeof marqueeSpacing === 'string' && /^\d+(\.\d+)?%$/.test(marqueeSpacing)) {
		return visibleHeight * Number.parseFloat(marqueeSpacing) / 100;
	}

	return 0;
};

/**
 * Vertically scrolls children that overflow `maxLines`.
 *
 * The component needs a bounded width so the text wraps. When the wrapped text is
 * taller than `maxLines`, and the marquee trigger is active, the text scrolls
 * upward by the laid-out block height plus `marqueeSpacing` (one cycle), pauses, then repeats.
 *
 * @class VerticalMarquee
 * @memberof limestone/VerticalMarquee
 * @ui
 * @public
 */
const VerticalMarquee = ({
	children,
	className,
	css,
	disabled,
	maxLines = 3,
	marqueeDelay = 1000,
	marqueeDisabled = false,
	marqueeOn = 'focus',
	marqueeOnRenderDelay = 1000,
	marqueeResetDelay = 1000,
	marqueeSpacing = '50%',
	marqueeSpeed = 30,
	onBlur,
	onFocus,
	onMouseEnter,
	onMouseLeave,
	style,
	tabIndex,
	...rest
}) => {
	const lines = Number.isFinite(maxLines) && maxLines > 0 ? Math.floor(maxLines) : 1;
	const mergedCss = css ? {...componentCss, ...css} : componentCss;

	const [metrics, setMetrics] = useState(emptyMetrics);
	const [promoted, setPromoted] = useState(false);
	const [animating, setAnimating] = useState(false);
	const [cycleDistance, setCycleDistance] = useState(0);

	const contentRef = useRef(null);
	const duplicateRef = useRef(null);
	const measurerRef = useRef(null);
	const metricsRef = useRef(emptyMetrics);
	const timersRef = useRef([]);
	const sessionRef = useRef(false);
	const animatingRef = useRef(false);
	const configRef = useRef({});

	const clearTimers = useCallback(() => {
		if (typeof window === 'undefined') return;

		timersRef.current.forEach((id) => window.clearTimeout(id));
		timersRef.current = [];
	}, []);

	const later = useCallback((fn, time) => {
		const id = window.setTimeout(() => {
			timersRef.current = timersRef.current.filter((item) => item !== id);
			fn();
		}, time);
		timersRef.current.push(id);
	}, []);

	const stopVisual = useCallback(() => {
		animatingRef.current = false;
		setAnimating(false);
		setPromoted(false);
	}, []);

	const travelDistance = useCallback(() => {
		const current = metricsRef.current;
		if (!current.overflows) return 0;

		const clip = current.clipHeight > 0 ? current.clipHeight : current.lineHeight * lines;
		const gap = clip > 0 ? getSpacing(clip, configRef.current.marqueeSpacing) : 0;
		return round2(current.contentHeight + gap);
	}, [lines]);

	const startScroll = useCallback(() => {
		if (!sessionRef.current || !metricsRef.current.overflows) return;

		const nextDistance = travelDistance();
		if (!(nextDistance > 0)) return;

		setCycleDistance(nextDistance);
		setPromoted(true);
		animatingRef.current = true;
		setAnimating(true);
	}, [travelDistance]);

	const arm = useCallback((delay) => {
		clearTimers();
		if (!sessionRef.current || configRef.current.marqueeDisabled) return;
		if (prefersReducedMotion() || !(configRef.current.marqueeSpeed > 0)) return;
		if (!metricsRef.current.measured || !metricsRef.current.overflows) return;

		const startDelay = Math.max(0, delay);
		later(() => {
			if (sessionRef.current) setPromoted(true);
		}, Math.max(0, startDelay - PROMOTE_LEAD_TIME));
		later(startScroll, startDelay);
	}, [clearTimers, later, startScroll]);

	const begin = useCallback((delay) => {
		sessionRef.current = true;
		arm(delay);
	}, [arm]);

	const end = useCallback(() => {
		sessionRef.current = false;
		clearTimers();
		stopVisual();
	}, [clearTimers, stopVisual]);

	const pauseThenRestart = useCallback(() => {
		animatingRef.current = false;
		setAnimating(false);
		clearTimers();
		const pause = Math.max(
			MINIMUM_MARQUEE_RESET_DELAY,
			configRef.current.marqueeResetDelay + configRef.current.marqueeDelay
		);
		later(startScroll, pause);
	}, [clearTimers, later, startScroll]);

	const syncToMetrics = useCallback(() => {
		if (!sessionRef.current) return;

		const canAnimate = metricsRef.current.overflows &&
			!prefersReducedMotion() &&
			configRef.current.marqueeSpeed > 0;

		if (!canAnimate) {
			clearTimers();
			stopVisual();
			return;
		}

		// A running cycle keeps its distance. Restarting here snaps the text back to the top.
		if (animatingRef.current || timersRef.current.length > 0) return;

		arm(configRef.current.marqueeDelay);
	}, [arm, clearTimers, stopVisual]);

	useLayoutEffect(() => {
		configRef.current = {
			disabled,
			marqueeDelay,
			marqueeDisabled,
			marqueeOn,
			marqueeOnRenderDelay,
			marqueeResetDelay,
			marqueeSpacing,
			marqueeSpeed,
			onBlur,
			onFocus,
			onMouseEnter,
			onMouseLeave
		};
	}, [
		disabled,
		marqueeDelay,
		marqueeDisabled,
		marqueeOn,
		marqueeOnRenderDelay,
		marqueeResetDelay,
		marqueeSpacing,
		marqueeSpeed,
		onBlur,
		onFocus,
		onMouseEnter,
		onMouseLeave
	]);

	useLayoutEffect(() => {
		animatingRef.current = animating;
	}, [animating]);

	useLayoutEffect(() => {
		if (marqueeDisabled) return;

		const content = contentRef.current;
		const measurer = measurerRef.current;
		if (!content || !measurer) return;

		// The measurer holds a clone only while measuring, so textContent is not doubled.
		const update = () => {
			cloneContentInto(content, measurer);

			let next;
			try {
				next = measureNode(measurer, lines);
			} finally {
				measurer.replaceChildren();
			}

			const prev = metricsRef.current;
			const changed = prev.measured !== next.measured ||
				prev.lineHeight !== next.lineHeight ||
				prev.clipHeight !== next.clipHeight ||
				prev.contentHeight !== next.contentHeight ||
				prev.overflows !== next.overflows;

			if (!changed) return;

			metricsRef.current = next;
			setMetrics(next);
			if (sessionRef.current) {
				syncToMetrics();
			}
		};

		update();

		let observer = null;
		if (typeof ResizeObserver === 'function') {
			observer = new ResizeObserver(() => update());
			observer.observe(content);
		}

		let removeFonts = null;
		const fonts = typeof document !== 'undefined' ? document.fonts : null;
		if (fonts && typeof fonts.addEventListener === 'function') {
			const onFonts = () => update();
			fonts.addEventListener('loadingdone', onFonts);
			removeFonts = () => fonts.removeEventListener('loadingdone', onFonts);
		}

		return () => {
			if (observer) observer.disconnect();
			if (removeFonts) removeFonts();
			measurer.replaceChildren();
		};
	}, [children, lines, marqueeDisabled, syncToMetrics]);

	const duplicate = promoted && metrics.overflows;

	useLayoutEffect(() => {
		if (!duplicate) return;

		cloneContentInto(contentRef.current, duplicateRef.current);
	}, [children, duplicate]);

	useEffect(() => {
		if (marqueeOn !== 'render' || marqueeDisabled) return;

		begin(marqueeOnRenderDelay);
		return () => end();
	}, [begin, end, marqueeDisabled, marqueeOn, marqueeOnRenderDelay]);

	useEffect(() => () => {
		sessionRef.current = false;
		clearTimers();
	}, [clearTimers]);

	useEffect(() => {
		if (marqueeDisabled) end();
	}, [end, marqueeDisabled]);

	useEffect(() => {
		if (marqueeOn !== 'hover') return;

		const handleKeyDown = (ev) => {
			if (is('pointerHide', ev.keyCode)) end();
		};

		on('keydown', handleKeyDown, document);
		return () => off('keydown', handleKeyDown, document);
	}, [end, marqueeOn]);

	const handleFocus = useCallback((ev) => {
		const config = configRef.current;
		if (config.onFocus) config.onFocus(ev);
		if (config.marqueeDisabled || config.marqueeOn !== 'focus' || config.disabled) return;
		if (sessionRef.current) return;

		begin(config.marqueeDelay);
	}, [begin]);

	const handleBlur = useCallback((ev) => {
		const config = configRef.current;
		if (config.onBlur) config.onBlur(ev);
		if (config.marqueeOn === 'focus' && !config.disabled) {
			end();
		}
	}, [end]);

	const handleMouseEnter = useCallback((ev) => {
		const config = configRef.current;
		if (config.onMouseEnter) config.onMouseEnter(ev);

		const hoverStarts = config.marqueeOn === 'hover' || (config.marqueeOn === 'focus' && config.disabled);
		if (config.marqueeDisabled || !hoverStarts || sessionRef.current) return;

		begin(config.marqueeDelay);
	}, [begin]);

	const handleMouseLeave = useCallback((ev) => {
		const config = configRef.current;
		if (config.onMouseLeave) config.onMouseLeave(ev);

		const hoverStarts = config.marqueeOn === 'hover' || (config.marqueeOn === 'focus' && config.disabled);
		if (!hoverStarts) return;

		end();
	}, [end]);

	const handleTransitionEnd = useCallback((ev) => {
		if (ev.target !== ev.currentTarget || !animatingRef.current) return;
		if (ev.propertyName && ev.propertyName !== 'transform') return;

		ev.stopPropagation();
		pauseThenRestart();
	}, [pauseThenRestart]);

	if (marqueeDisabled) {
		return (
			<div
				{...rest}
				className={classNames(mergedCss.verticalMarquee, className)}
				onBlur={handleBlur}
				onFocus={handleFocus}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				style={style}
				tabIndex={tabIndex}
			>
				{children}
			</div>
		);
	}

	const visibleHeight = metrics.clipHeight > 0 ? metrics.clipHeight : metrics.lineHeight * lines;
	const spacing = visibleHeight > 0 ? getSpacing(visibleHeight, marqueeSpacing) : 0;
	const distance = metrics.overflows ? metrics.contentHeight + spacing : 0;

	const rootStyle = {
		...style,
		'--vertical-marquee-lines': lines,
		'--vertical-marquee-spacing': spacing
	};

	if (visibleHeight > 0) {
		rootStyle.maxHeight = `${visibleHeight}px`;
	}

	const travel = animating ? cycleDistance : distance;
	const trackStyle = animating && travel > 0 && marqueeSpeed > 0 ? {
		transform: `translateY(${-travel}px)`,
		transitionDuration: `${travel / marqueeSpeed}s`
	} : {
		transform: 'translateY(0)',
		transitionDuration: '0s'
	};

	return (
		<div
			{...rest}
			className={classNames(mergedCss.verticalMarquee, className, {
				[mergedCss.willAnimate]: promoted
			})}
			onBlur={handleBlur}
			onFocus={handleFocus}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			style={rootStyle}
			tabIndex={tabIndex}
		>
			<div
				className={mergedCss.track}
				data-vertical-marquee-track
				onTransitionEnd={handleTransitionEnd}
				style={trackStyle}
			>
				<div className={mergedCss.content} data-vertical-marquee-content ref={contentRef}>
					{children}
				</div>
				{duplicate ? (
					<Fragment>
						<div className={mergedCss.spacing} />
						<div
							aria-hidden
							className={mergedCss.content}
							data-vertical-marquee-content
							inert
							ref={duplicateRef}
						/>
					</Fragment>
				) : null}
			</div>
			<div
				aria-hidden
				className={mergedCss.measurer}
				data-vertical-marquee-measurer
				inert
				ref={measurerRef}
			/>
		</div>
	);
};

VerticalMarquee.displayName = 'VerticalMarquee';

VerticalMarquee.propTypes = /** @lends limestone/VerticalMarquee.VerticalMarquee.prototype */ {
	/**
	 * Text or components to marquee when they overflow `maxLines`.
	 *
	 * @type {Node}
	 * @public
	 */
	children: PropTypes.node,

	/**
	 * Customizes the component by mapping the supplied collection of CSS class names to the
	 * corresponding internal elements and states of this component.
	 *
	 * The following classes are supported:
	 *
	 * * `verticalMarquee` - The root component class
	 * * `track` - The translating content wrapper
	 * * `content` - Each copy of the children
	 * * `spacing` - The gap between the children and the duplicate copy
	 * * `willAnimate` - Applied shortly before and between scroll cycles
	 *
	 * @type {Object}
	 * @public
	 */
	css: PropTypes.object,

	/**
	 * Disables focus-triggered marquee.
	 *
	 * When `marqueeOn` is `'focus'`, a disabled marquee starts on hover instead, matching
	 * {@link limestone/Marquee.Marquee|Marquee}.
	 *
	 * @type {Boolean}
	 * @public
	 */
	disabled: PropTypes.bool,

	/**
	 * Milliseconds to wait before the first scroll, and before each scroll after a pause.
	 *
	 * @type {Number}
	 * @default 1000
	 * @public
	 */
	marqueeDelay: PropTypes.number,

	/**
	 * Disables marquee behavior and renders the children in a plain block.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	marqueeDisabled: PropTypes.bool,

	/**
	 * Determines what triggers the marquee.
	 *
	 * When `marqueeOn` is `'focus'`, this component does not become focusable on its own.
	 * Focus must land on this node, usually from a parent such as
	 * {@link spotlight/Spottable.Spottable|Spottable}.
	 *
	 * @type {('focus'|'hover'|'render')}
	 * @default 'focus'
	 * @public
	 */
	marqueeOn: PropTypes.oneOf(['focus', 'hover', 'render']),

	/**
	 * Milliseconds to wait before the first scroll when `marqueeOn` is `'render'`.
	 *
	 * @type {Number}
	 * @default 1000
	 * @public
	 */
	marqueeOnRenderDelay: PropTypes.number,

	/**
	 * Milliseconds to pause after a full cycle before the next one starts.
	 *
	 * The effective pause is `marqueeResetDelay + marqueeDelay`, with a minimum of 40ms,
	 * matching {@link limestone/Marquee.Marquee|Marquee}.
	 *
	 * @type {Number}
	 * @default 1000
	 * @public
	 */
	marqueeResetDelay: PropTypes.number,

	/**
	 * Gap between the text and its duplicate during a cycle.
	 *
	 * A number is a pixel value based on 1920x1080 and scaled for the current resolution.
	 * A percentage is relative to the visible area (`maxLines` times the line height).
	 *
	 * @type {String|Number}
	 * @default '50%'
	 * @public
	 */
	marqueeSpacing: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

	/**
	 * Scroll rate in pixels per second.
	 *
	 * @type {Number}
	 * @default 30
	 * @public
	 */
	marqueeSpeed: PropTypes.number,

	/**
	 * Number of text lines that stay visible.
	 *
	 * The marquee runs only when the wrapped text is taller than this area.
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
