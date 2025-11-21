import EnactPropTypes from '@enact/core/internal/prop-types';
import useChainRefs from '@enact/core/useChainRefs';
import PropTypes from 'prop-types';
import {useRef, useCallback, useEffect, useState, Children} from 'react';
import {is} from '@enact/core/keymap';
import Spotlight from '@enact/spotlight';

import {useAutoFocus, useFocusOnTransition, useToggleRole} from '../internal/Panels';

// single-index ViewManagers need some help knowing when the transition direction needs to change
// because the index is always 0 from its perspective.
function useReverseTransition (index, rtl) {
	const prevIndex = useRef(index);
	let reverse = false;
	if (prevIndex.current !== index) {
		reverse = rtl ? (index > prevIndex.current) : (index < prevIndex.current);
	}
	prevIndex.current = index;
	return  {reverseTransition: reverse};
}

const isLeft = is('left');
const isRight = is('right');

/**
 * PageViewsRouter passes children, index and transition handlers
 *
 * @class PageViewsRouter
 * @memberof limestone/PageViews
 * @private
 */
function PageViewsRouter (Wrapped) {
	const PageViewsProvider = ({
		autoFocus,
		bannerMode,
		children,
		componentRef,
		'data-spotlight-id': spotlightId,
		index = 0,
		onTransition,
		onWillTransition,
		rtl,
		...rest
	}) => {
		const [indexValue, setIndexValue] = useState(index);
		const totalIndex = Children.count(children);
		const {ref: a11yRef, onWillTransition: a11yOnWillTransition} = useToggleRole();
		const autoFocusRef = useAutoFocus({autoFocus});
		const ref = useChainRefs(autoFocusRef, a11yRef, componentRef);
		const {reverseTransition} = useReverseTransition(index, rtl);
		const {
			onWillTransition: focusOnWillTransition,
			...transition
		} = useFocusOnTransition({onTransition, onWillTransition, spotlightId});

		const handleWillTransition = useCallback((ev) => {
			focusOnWillTransition(ev);
			a11yOnWillTransition(ev);
		}, [a11yOnWillTransition, focusOnWillTransition]);

		useEffect(() => {
			setIndexValue(index);

			const handleKeyDown = (ev) => {
				if ((!rtl && isLeft(ev.keyCode)) || (rtl && isRight(ev.keyCode))) {
					ev.preventDefault();
					setIndexValue(value => {
						if (value === 0) return value;
						return value - 1;
					});
					Spotlight.pause();

				}

				if ((!rtl && isRight(ev.keyCode)) || (rtl && isLeft(ev.keyCode))) {
					ev.preventDefault();
					setIndexValue(value => {
						if (value + 1 < totalIndex) return value + 1;
						return value;
					});
					Spotlight.pause();
				}

			};

			if (bannerMode === true) {
				document.addEventListener('keydown', handleKeyDown, {capture: true});
			} else {
				Spotlight.resume();
			}

			return () => {
				document.removeEventListener('keydown', handleKeyDown, {capture: true});
			};
		}, [bannerMode, index, rtl, totalIndex]);

		return (
			<Wrapped
				{...rest}
				{...transition}
				bannerMode={bannerMode}
				componentRef={ref}
				data-spotlight-id={spotlightId}
				index={indexValue}
				totalIndex={totalIndex}
				onWillTransition={handleWillTransition}
				reverseTransition={reverseTransition}
			>
				{children}
			</Wrapped>
		);
	};

	PageViewsProvider.propTypes =  /** @lends limestone/PageViews.PageViewsRouter.prototype */  {
		/**
		 * Sets the strategy used to automatically focus an element within the PageViews upon render.
		 * When set to 'none', focus is not set only on the first render.
		 *
		 * @type {('default-element'|'last-focused'|'none'|String)}
		 * @default 'last-focused'
		 * @private
		 */
		autoFocus: PropTypes.string,

		/**
		 * Obtains a reference to the root node.
		 *
		 * @type {Function|Object}
		 * @private
		 */
		componentRef: EnactPropTypes.ref,

		/**
		* The spotlight id for the panel.
		*
		* @type {String}
		* @private
		*/
		'data-spotlight-id': PropTypes.string,

		/**
		* The currently selected step.
		*
		* @type {Number}
		* @default 0
		* @private
		*/
		index: PropTypes.number,

		/**
		 * Disables panel transitions.
		 *
		 * @type {Boolean}
		 * @public
		 */
		noAnimation: PropTypes.bool,

		/**
		* Called when a transition completes.
		*
		* @type {Function}
		* @private
		*/
		onTransition: PropTypes.func,

		/**
		* Called when a transition begins.
		*
		* @type {Function}
		* @private
		*/
		onWillTransition: PropTypes.func,

		/**
		 * Used to determine the transition direction.
		 *
		 * @type {Boolean}
		 * @private
		 */
		rtl: PropTypes.bool
	};

	return PageViewsProvider;
}

export default PageViewsRouter;
export {
	PageViewsRouter
};
