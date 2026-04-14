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

		// 네비게이션 소스를 추적하는 ref
		// 'internal-next' | 'internal-prev' | 'footer' | null
		const navigationSource = useRef(null);

		// 요구사항 2: 처음 로드될 때 footer Next 버튼에 포커스 (bannerMode 아닐 때)
		useEffect(() => {
			if (showFooterButtons && !bannerMode) {
				Spotlight.focus(spotlightId, {enterTo: 'default-element'});
			}
			// 마운트 시 1회만 실행
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		// 내부 Next 버튼 클릭 시 소스 기록
		const handleNextClick = useCallback((ev) => {
			navigationSource.current = 'internal-next';
			onNextClick?.(ev);
		}, [onNextClick]);

		// 내부 Prev 버튼 클릭 시 소스 기록
		const handlePrevClick = useCallback((ev) => {
			navigationSource.current = 'internal-prev';
			onPrevClick?.(ev);
		}, [onPrevClick]);

		// 요구사항 4: 하단 Next 버튼 클릭 — 소스 기록 후 Base handler(forwardCustomWithPrevent)에 위임
		const handleFooterNextClick = useCallback((ev) => {
			navigationSource.current = 'footer';
			onFooterNextClick?.(ev);
		}, [onFooterNextClick]);

		// 트랜지션 완료 후 포커스 결정
		const handleTransition = useCallback((ev) => {
			// 요구사항 4 & 5: bannerMode가 아닐 때만 footer 포커스 관리
			if (showFooterButtons && !bannerMode) {
				const source = navigationSource.current;
				const newIndex = ev.index;

				if (source === 'footer' ||
						(source === 'internal-next' && newIndex === totalIndex - 1) ||
						(source === 'internal-prev' && newIndex === 0)) {
					// spotlightDefaultClass가 isLastPage 기반으로 Close/Next 버튼에 적용되어 있으므로
					// 컨테이너 포커스 시 default-element 전략으로 올바른 버튼을 찾음
					Spotlight.focus(spotlightId, {enterTo: 'default-element'});
				}
				// 그 외 내부 navigate → Spotlight이 내부 버튼 포커스 자연 유지
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
