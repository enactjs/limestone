/**
 * Text measurement and line breaking for {@link limestone/CanvasScroller}.
 *
 * The whole premise of painting a content block to a canvas is that the block is *static*: the
 * expensive part (measuring glyphs and choosing break points) is paid once, up front, and the
 * per-frame cost collapses to "draw the handful of lines that are currently on screen".
 *
 * Type is **not** described here. A canvas has no cascade, so sizes, weights, families and colors
 * are read out of real themed elements by {@link limestone/CanvasScroller.CanvasContentBlock} and
 * handed in as a resolved `style`, already in CSS pixels. Restating limestone's type scale as
 * numbers in this file would silently drift from the theme, and would miss resolution scaling and
 * the locale overrides entirely.
 *
 * The output is a flat, y-sorted array of lines so that the painter can binary-search straight to
 * the first visible line instead of walking the block list.
 *
 * @module limestone/CanvasScroller/textLayout
 * @private
 */

let measureContext = null;

/**
 * Returns `null` during isomorphic prerender, where there is no canvas to measure with. The block
 * then lays out as empty and fills in on the client, on mount.
 *
 * @private
 */
const getMeasureContext = () => {
	if (typeof window === 'undefined') return null;

	if (!measureContext) {
		measureContext = window.document.createElement('canvas').getContext('2d');
	}

	return measureContext;
};

/**
 * Breaks `blocks` into absolutely-positioned lines that fit within `width`.
 *
 * @param {Object[]} blocks Content model; each entry is `{type: 'heading'|'paragraph', text}`
 * @param {Number} width Content width in CSS pixels, including horizontal padding
 * @param {Object} style Resolved type, in CSS pixels, from {@link readThemeStyle}
 * @returns {{lines: Object[], height: Number, style: Object}} Flat, y-sorted line list
 * @private
 */
const layoutBlocks = (blocks, width, style) => {
	const ctx = getMeasureContext();

	if (!ctx || !style) {
		return {lines: [], height: 0, style};
	}

	const maxWidth = width - style.paddingX * 2;
	const lines = [];
	let y = style.paddingY;

	const pushWrapped = (text, role) => {
		const {font, color, lineHeight} = style[role];

		ctx.font = font;

		const words = String(text).split(/\s+/);
		let current = '';

		for (let i = 0; i < words.length; i++) {
			const candidate = current ? `${current} ${words[i]}` : words[i];

			// measureText is the expensive call; it runs once per word at layout time and never again
			if (current && ctx.measureText(candidate).width > maxWidth) {
				lines.push({text: current, y, font, color});
				y += lineHeight;
				current = words[i];
			} else {
				current = candidate;
			}
		}

		if (current) {
			lines.push({text: current, y, font, color});
			y += lineHeight;
		}
	};

	for (let i = 0; i < blocks.length; i++) {
		const block = blocks[i];
		const isHeading = block.type === 'heading';

		pushWrapped(block.text, isHeading ? 'heading' : 'body');

		// Mirrors the bottom margin the themed element would have contributed in the DOM.
		y += isHeading ? style.heading.marginBottom : style.body.marginBottom;
	}

	return {lines, height: Math.ceil(y + style.paddingY), style};
};

/**
 * Index of the first line whose `y` is at or after `target`.
 *
 * @param {Object[]} lines y-sorted lines from {@link layoutBlocks}
 * @param {Number} target Content-space y coordinate
 * @returns {Number} Index, or `lines.length` when every line sits above `target`
 * @private
 */
const firstLineAtOrAfter = (lines, target) => {
	let lo = 0;
	let hi = lines.length - 1;
	let ans = lines.length;

	while (lo <= hi) {
		const mid = (lo + hi) >> 1;

		if (lines[mid].y >= target) {
			ans = mid;
			hi = mid - 1;
		} else {
			lo = mid + 1;
		}
	}

	return ans;
};

/**
 * Reads one probe element's resolved type into the shape the painter and `ctx.font` want.
 *
 * `line-height: normal` has no numeric value to read, so it falls back to the ratio browsers use.
 *
 * @param {Node} node A themed, hidden probe element
 * @returns {Object} `{font, color, lineHeight, marginBottom, marginLeft}` in CSS pixels
 * @private
 */
const readProbe = (node) => {
	const cs = window.getComputedStyle(node);
	const fontSize = parseFloat(cs.fontSize) || 0;
	const parsedLineHeight = parseFloat(cs.lineHeight);

	return {
		// The canvas font shorthand ignores any line-height component, so it is carried separately.
		font: `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`,
		color: cs.color,
		lineHeight: isNaN(parsedLineHeight) ? Math.round(fontSize * 1.2) : parsedLineHeight,
		marginBottom: parseFloat(cs.marginBottom) || 0,
		marginLeft: parseFloat(cs.marginLeft) || 0
	};
};

/**
 * Resolves limestone's type off the live probe elements.
 *
 * @param {Node} bodyNode Probe carrying the body-text mixin
 * @param {Node} headingNode Probe carrying the heading styles
 * @returns {Object} Resolved style for {@link layoutBlocks}, or `null` before the probes exist
 * @private
 */
const readThemeStyle = (bodyNode, headingNode) => {
	if (typeof window === 'undefined' || !bodyNode || !headingNode) return null;

	const body = readProbe(bodyNode);
	const heading = readProbe(headingNode);

	return {
		body,
		heading,
		// The themed elements carry their own horizontal margin; reuse it so canvas text lines up
		// with DOM content elsewhere in the same scroller.
		paddingX: body.marginLeft,
		paddingY: 0
	};
};

export default layoutBlocks;
export {
	firstLineAtOrAfter,
	layoutBlocks,
	readThemeStyle
};
