/**
 * Text measurement and line breaking for {@link limestone/CanvasScroller}.
 *
 * The whole premise of painting a content block to a canvas is that the block is *static*: the
 * expensive part (measuring glyphs and choosing break points) is paid once, up front, and the
 * per-frame cost collapses to "draw the handful of lines that are currently on screen".
 *
 * The output is a flat, y-sorted array of lines so that the painter can binary-search straight to
 * the first visible line instead of walking the block list.
 *
 * @module limestone/CanvasScroller/textLayout
 * @private
 */

import ri from '@enact/ui/resolution';

let measureContext = null;

const getMeasureContext = () => {
	if (!measureContext) {
		measureContext = document.createElement('canvas').getContext('2d');
	}
	return measureContext;
};

/**
 * Default type scale, expressed in 1080p design pixels and scaled through `ri.scale` so the canvas
 * matches the rest of the app on UHD panels.
 *
 * @private
 */
const defaultMetrics = {
	bodySize: 24,
	bodyFamily: 'LG Smart UI, sans-serif',
	bodyColor: '#e6e6e6',
	bodyLineHeight: 36,
	headingSize: 34,
	headingFamily: 'LG Smart UI, sans-serif',
	headingWeight: 'bold',
	headingColor: '#ffffff',
	headingLineHeight: 52,
	paragraphGap: 18,
	blockGap: 40,
	paddingX: 24,
	paddingY: 12,
	background: 'transparent'
};

const resolveMetrics = (metrics) => {
	const m = Object.assign({}, defaultMetrics, metrics);

	return Object.assign({}, m, {
		bodyFont: `${ri.scale(m.bodySize)}px ${m.bodyFamily}`,
		headingFont: `${m.headingWeight} ${ri.scale(m.headingSize)}px ${m.headingFamily}`,
		bodyLineHeightPx: ri.scale(m.bodyLineHeight),
		headingLineHeightPx: ri.scale(m.headingLineHeight),
		paragraphGapPx: ri.scale(m.paragraphGap),
		blockGapPx: ri.scale(m.blockGap),
		paddingXPx: ri.scale(m.paddingX),
		paddingYPx: ri.scale(m.paddingY)
	});
};

/**
 * Breaks `blocks` into absolutely-positioned lines that fit within `width`.
 *
 * @param {Object[]} blocks Content model; each entry is `{type: 'heading'|'paragraph', text}`
 * @param {Number} width Content width in CSS pixels, including horizontal padding
 * @param {Object} [metrics] Type scale overrides, in 1080p design pixels
 * @returns {{lines: Object[], height: Number, metrics: Object}} Flat, y-sorted line list
 * @private
 */
const layoutBlocks = (blocks, width, metrics) => {
	const m = resolveMetrics(metrics);
	const ctx = getMeasureContext();
	const maxWidth = width - m.paddingXPx * 2;
	const lines = [];
	let y = m.paddingYPx;

	const pushWrapped = (text, font, color, lineHeight) => {
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

		if (block.type === 'heading') {
			pushWrapped(block.text, m.headingFont, m.headingColor, m.headingLineHeightPx);
		} else {
			pushWrapped(block.text, m.bodyFont, m.bodyColor, m.bodyLineHeightPx);
			y += m.paragraphGapPx;
		}

		if (block.type === 'heading' || i === blocks.length - 1 || blocks[i + 1].type === 'heading') {
			y += m.blockGapPx;
		}
	}

	return {lines, height: Math.ceil(y + m.paddingYPx), metrics: m};
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

export default layoutBlocks;
export {
	defaultMetrics,
	firstLineAtOrAfter,
	layoutBlocks
};
