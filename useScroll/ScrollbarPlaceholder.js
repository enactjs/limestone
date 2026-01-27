import Spotlight from '@enact/spotlight';
import Spottable from '@enact/spotlight/Spottable';
import {useCallback, useLayoutEffect, useRef, useState} from 'react';

const SpotlightPlaceholder = Spottable('div');

/**
 * ScrollbarPlaceholder component.
 *
 * @class ScrollbarPlaceholder
 * @memberof limestone/useScroll
 * @ui
 * @private
 */
const ScrollbarPlaceholder = () => {
	const [showPlaceholder, setShowPlaceholder] = useState(true);
	const hasHiddenRef = useRef(false);

	// Intentional: hide placeholder after first layout (imperative handle pattern)
	/* eslint-disable react-hooks/set-state-in-effect */
	useLayoutEffect(() => {
		if (showPlaceholder && !hasHiddenRef.current) {
			hasHiddenRef.current = true;
			setShowPlaceholder(false);
		}
	}, [showPlaceholder]);
	/* eslint-enable react-hooks/set-state-in-effect */

	const resetFocus = useCallback(() => {
		setTimeout(() => {
			if (!Spotlight.getPointerMode() && !Spotlight.getCurrent()) {
				if (!Spotlight.isPaused()) {
					Spotlight.focus(Spotlight.getActiveContainer(), {toOuterContainer:true});
				} else {
					setTimeout(() => {
						if (!Spotlight.getPointerMode() && !Spotlight.getCurrent() && !Spotlight.isPaused()) {
							Spotlight.focus(Spotlight.getActiveContainer(), {toOuterContainer:true});
						}
					}, 400); // Wait again for finishing animation (ex. panel transition).
				}
			}
		}, 0); // Wait for unmounting placeholder node.
	}, []);

	return (showPlaceholder ? (<SpotlightPlaceholder aria-hidden onSpotlightDisappear={resetFocus} data-spotlight-ignore-restore />) : null);
};

ScrollbarPlaceholder.displayName = 'ScrollbarPlaceholder';

export default ScrollbarPlaceholder;
export {
	ScrollbarPlaceholder
};
