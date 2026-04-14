import EnactPropTypes from '@enact/core/internal/prop-types';
import useChainRefs from '@enact/core/useChainRefs';
import {checkPropTypes, setDefaultProps, usePrevious} from '@enact/core/util';
import Spotlight from '@enact/spotlight';
import PropTypes from 'prop-types';
import {useCallback, useEffect, useId, Children, useRef} from 'react';

import {useAutoFocus, useFocusOnTransition, useToggleRole} from '../internal/Panels';

// single-index ViewManagers need some help knowing when the transition direction needs to change
// because the index is always 0 from its perspective.
function useReverseTransition (index, rtl) {
	const prevIndex = usePrevious(index);

	let reverse = false;

	if (prevIndex !== index) {
		reverse = rtl ? (index > prevIndex) : (index < prevIndex);
	}

	return {reverseTransition: reverse};
}

/**
 * PageViewsRouter passes children, index and transition handlers.
 *
 * @class PageViewsRouter
 * @memberof limestone/PageViews
 * @private
 */
function PageViewsRouter (Wrapped) {
	const PageViewsProvider = (props) => {
		const pageViewsProviderProps = setDefaultProps(props, {
			index: 0
		});

		checkPropTypes(PageViewsProvider, pageViewsProviderProps);

		const {
			autoFocus,
			bannerMode,
			children,
			componentRef,
			'data-spotlight-id': spotlightId,
			index,
			onFooterCloseClick,
			onFooterNextClick,
			onNextClick,
			onPrevClick,
			onTransition,
			onWillTransition,
			rtl,
			showFooterButtons,
			...rest
		} = pageViewsProviderProps;

		const uniqueId = useId();
		const totalIndex = Children.count(children);
		const {ref: a11yRef, onWillTransition: a11yOnWillTransition} = useToggleRole();
		const autoFocusRef = useAutoFocus({autoFocus});
		const ref = useChainRefs(autoFocusRef, a11yRef, componentRef);
		const {reverseTransition} = useReverseTransition(index, rtl);

		const navigationSource = useRef(null);  // 'internal-next' | 'internal-prev' | 'footer' | null

		useEffect(() => {
			if (showFooterButtons && !bannerMode) {
				Spotlight.focus(spotlightId, {enterTo: 'default-element'});
			}
		}, []);

		const handleNextClick = useCallback((ev) => {
			navigationSource.current = 'internal-next';
			onNextClick?.(ev);
		}, [onNextClick]);

		const handlePrevClick = useCallback((ev) => {
			navigationSource.current = 'internal-prev';
			onPrevClick?.(ev);
		}, [onPrevClick]);

		const handleFooterNextClick = useCallback((ev) => {
			navigationSource.current = 'footer';
			onFooterNextClick?.(ev);
		}, [onFooterNextClick]);

		const handleTransition = useCallback((ev) => {
			if (showFooterButtons && !bannerMode) {
				const source = navigationSource.current;
				const newIndex = ev.index;

				if (source === 'footer' ||
						(source === 'internal-next' && newIndex === totalIndex - 1) ||
						(source === 'internal-prev' && newIndex === 0)) {
					Spotlight.focus(spotlightId, {enterTo: 'default-element'});
				}
			}

			navigationSource.current = null;
			onTransition?.(ev);
		}, [bannerMode, onTransition, showFooterButtons, spotlightId, totalIndex]);

		const {
			onWillTransition: focusOnWillTransition,
			...transition
		} = useFocusOnTransition({onTransition: handleTransition, onWillTransition, spotlightId});

		const handleWillTransition = useCallback((ev) => {
			focusOnWillTransition(ev);
			a11yOnWillTransition(ev);
		}, [a11yOnWillTransition, focusOnWillTransition]);

		useEffect(() => {
			return () => {
				Spotlight.resume();
			};
		}, []);

		return (
			<Wrapped
				{...rest}
				{...transition}
				bannerMode={bannerMode}
				componentRef={ref}
				data-spotlight-id={spotlightId}
				index={index}
				onFooterCloseClick={onFooterCloseClick}
				onFooterNextClick={handleFooterNextClick}
				onNextClick={handleNextClick}
				onPrevClick={handlePrevClick}
				onWillTransition={handleWillTransition}
				reverseTransition={reverseTransition}
				rtl={rtl}
				showFooterButtons={showFooterButtons}
				totalIndex={totalIndex}
				uniqueId={uniqueId}
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
