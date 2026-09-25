import useChainRefs from '@enact/core/useChainRefs';
import {checkPropTypes, setDefaultProps, usePrevious} from '@enact/core/util';
import Spotlight from '@enact/spotlight';
import EnactPropTypes, {EnactPropTypeShapes} from '@enact/core/internal/prop-types';
import PropTypes from 'prop-types';
import {useCallback, useEffect, useId, Children, useRef} from 'react';
import type {ComponentType, ReactNode} from 'react';

import {useAutoFocus, useFocusOnTransition, useToggleRole} from '../internal/Panels';

export interface PageViewsRouterProps {
	autoFocus?: string;
	bannerMode?: boolean;
	children?: ReactNode;
	componentRef?: EnactPropTypeShapes.ref;
	'data-spotlight-id'?: string;
	index?: number;
	noAnimation?: boolean;
	onFooterCloseClick?: (...args: any[]) => any;
	onFooterNextClick?: (...args: any[]) => any;
	onNextClick?: (...args: any[]) => any;
	onPrevClick?: (...args: any[]) => any;
	onTransition?: (...args: any[]) => any;
	onWillTransition?: (...args: any[]) => any;
	rtl?: boolean;
	showFooterButtons?: boolean;
}

// single-index ViewManagers need some help knowing when the transition direction needs to change
// because the index is always 0 from its perspective.
function useReverseTransition (index: number, rtl?: boolean) {
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
function PageViewsRouter (Wrapped: ComponentType<any>) {
	const PageViewsProvider = (props: PageViewsRouterProps & Record<string, any>) => {
		const pageViewsProviderProps = setDefaultProps(props, {
			index: 0
		}) as PageViewsRouterProps & Record<string, any>;

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
		const {reverseTransition} = useReverseTransition(index ?? 0, rtl);

		const navigationSource = useRef<'internal-next' | 'internal-prev' | 'footer' | null>(null);

		useEffect(() => {
			if (showFooterButtons && !bannerMode) {
				Spotlight.focus(spotlightId, {enterTo: 'default-element'});
			}
		}, [bannerMode, showFooterButtons, spotlightId]);

		const handleNextClick = useCallback((ev: any) => {
			navigationSource.current = 'internal-next';
			onNextClick?.(ev);
		}, [onNextClick]);

		const handlePrevClick = useCallback((ev: any) => {
			navigationSource.current = 'internal-prev';
			onPrevClick?.(ev);
		}, [onPrevClick]);

		const handleFooterNextClick = useCallback((ev: any) => {
			navigationSource.current = 'footer';
			onFooterNextClick?.(ev);
		}, [onFooterNextClick]);

		const handleTransition = useCallback((ev: any) => {
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

		const handleWillTransition = useCallback((ev: any) => {
			(focusOnWillTransition as any)(ev);
			(a11yOnWillTransition as any)(ev);
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
