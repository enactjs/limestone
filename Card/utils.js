import ri from '@enact/ui/resolution';
import {cloneElement, isValidElement} from 'react';

/**
 * Renders a badge or team logo as an element with optional size.
 *
 * @param {Element|String} badge	Badge content
 * @param {Object|Number} size		Font size or `{width, height}`
 * @param {String} className		CSS class applied to the element
 * @returns {Element}
 * @private
 */
const getBadge = (badge, size, className) => {
	let element = <div>{badge}</div>;
	let elementSize = {};

	if (isValidElement(badge)) element = badge;
	if (size) {
		elementSize = typeof size === 'object' ? {
			width: ri.scaleToRem(size.width), height: ri.scaleToRem(size.height)
		} : {
			fontSize: ri.scaleToRem(size)
		};
	}

	return cloneElement(element, {className: className, style: {...elementSize}});
};

export {
	getBadge
};
