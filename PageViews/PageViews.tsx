import handle, {forProp, forwardCustomWithPrevent} from '@enact/core/handle';
import EnactPropTypes, {EnactPropTypeShapes} from '@enact/core/internal/prop-types';
import {is} from '@enact/core/keymap';
import kind from '@enact/core/kind';
import {cap} from '@enact/core/util';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import Spotlight from '@enact/spotlight';
import SpotlightContainerDecorator, {spotlightDefaultClass} from '@enact/spotlight/SpotlightContainerDecorator';
import Spottable from '@enact/spotlight/Spottable';
import Changeable from '@enact/ui/Changeable';
import {Row, Column, Cell} from '@enact/ui/Layout';
import ViewManager, {shape} from '@enact/ui/ViewManager';
import classNames from 'classnames';
import IString from 'ilib/lib/IString';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {Children, isValidElement} from 'react';
import type {ComponentType, ReactNode} from 'react';

import Button from '../Button';
import $L from '../internal/$L';
import {BasicArranger} from '../internal/Panels';
import Skinnable from '../Skinnable';
import Steps from '../Steps';

import {PageViewsRouter} from './PageViewsRouter';

import componentCss from './PageViews.module.less';

export interface PageViewsBaseProps {
	arranger?: any;
	bannerMode?: boolean;
	children?: ReactNode;
	componentRef?: EnactPropTypeShapes.ref;
	css?: Record<string, string>;
	footerCloseLabel?: string;
	fullContents?: boolean;
	index?: number;
	noAnimation?: boolean;
	onFooterCloseClick?: (...args: any[]) => any;
	onFooterNextClick?: (...args: any[]) => any;
	onNextClick?: (...args: any[]) => any;
	onPrevClick?: (...args: any[]) => any;
	onStepsClick?: (...args: any[]) => any;
	onTransition?: (...args: any[]) => any;
	onWillTransition?: (...args: any[]) => any;
	pageIndicatorPosition?: 'top' | 'bottom';
	pageIndicatorType?: 'dot' | 'number';
	reverseTransition?: boolean;
	rtl?: boolean;
	showFooterButtons?: boolean;
	totalIndex?: number;
	uniqueId?: string;
}

const RowLayout = Row as ComponentType<any>;
const CellLayout = Cell as ComponentType<any>;
const ButtonComponent = Button as ComponentType<any>;
const StepsComponent = Steps as ComponentType<any>;

const isLeft = is('left');
const isRight = is('right');

const handlePageChange = (index: number, onChange?: (...args: any[]) => any, totalIndex?: number) => {
	if (onChange && index !== totalIndex && totalIndex) {
		const nextIndex = index < (totalIndex - 1) ? (index + 1) : index;

		onChange({type: 'onChange', index: nextIndex});
	} else if (onChange && index !== 0) {
		const prevIndex = index > 0 ? (index - 1) : index;

		onChange({type: 'onChange', index: prevIndex});
	}
};

const SpottableCell = Spottable(Cell) as ComponentType<any>;
const SpottableColumn = SpotlightContainerDecorator(Column) as ComponentType<any>;

/**
 * A PageViews that has page indicator with corresponding pages.
 *
 * @example
 * 	<PageViews>
 *		<PageViews.Page aria-label="This is a description for page">
 *			lorem ipsum ...
 *		</PageViews.Page>
 *	</PageViews>
 *
 * @class PageViewsBase
 * @memberof limestone/PageViews
 * @ui
 * @public
 */
const PageViewsBase = kind({
	name: 'PageViews',

	_propTypes: {} as PageViewsBaseProps,

	propTypes: /** @lends limestone/PageViews.PageViewsBase.prototype */ {
		/**
		 * Set of functions that control how the pages are transitioned into and out of the
		 * viewport.
		 *
		 * @see {@link ui/ViewManager.SlideArranger}
		 * @type {ui/ViewManager.Arranger}
		 * @default ui/ViewManager.SlideLeftArranger
		 * @private
		 */
		arranger: shape,

		/**
		 * When `true`, disables Spotlight outside the container and enables 5-way navigation between panels.
		 * Footer buttons are hidden when bannerMode is true.
		 *
		 * @type {Boolean}
		 * @public
		 */
		bannerMode: PropTypes.bool,

		/**
		 * {@link limestone/PageViews.Page|Page} to be rendered.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Obtains a reference to the root node.
		 *
		 * @type {Function|Object}
		 * @public
		 */
		componentRef: EnactPropTypes.ref,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `pageViews` - The root component class
		 * * `contentsArea` - The contentsArea component class
		 * * `footerButtons` - The footerButtons component class
		 * * `navButton` - The navButton component class
		 * * `navButtonContainer` - Applied to the container containing navButtons in fullContents mode
		 * * `stepsRow` - The step component class
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object as PropTypes.Validator<Record<string, string> | undefined>,

		/**
		 * The label of the footer Close button.
		 *
		 * @type {String}
		 * @default 'Close'
		 * @public
		 */
		footerCloseLabel: PropTypes.string,

		/**
		 * When `true`, maximize its contents area.
		 *
		 * @type {Boolean}
		 * @public
		 */
		fullContents: PropTypes.bool,

		/**
		 * Index of the active page.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		index: PropTypes.number,

		/**
		 * Disables page transitions.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAnimation: PropTypes.bool,

		/**
		 * Called when the footer Close button is clicked.
		 *
		 * @type {Function}
		 * @public
		 */
		onFooterCloseClick: PropTypes.func,

		/**
		 * Called when a transition completes.
		 *
		 * @type {Function}
		 * @public
		 */
		onTransition: PropTypes.func,

		/**
		 * Called before a transition begins.
		 *
		 * @type {Function}
		 * @public
		 */
		onWillTransition: PropTypes.func,

		/**
		 * Specifies on which side (`'top'` or `'bottom'`) the page indicator appears.
		 *
		 * @type {('top'|'bottom')}
		 * @default 'bottom'
		 * @public
		 */
		pageIndicatorPosition: PropTypes.oneOf(['top', 'bottom']),

		/**
		 * Type of page indicator.
		 *
		 * There are two types:
		 *
		 * * `dot` - Indicates pages by dots.
		 * * `number` - Indicates pages by current page number and total number of pages.
		 *
		 * @type {('dot'|'number')}
		 * @default 'dot'
		 * @public
		 */
		pageIndicatorType: PropTypes.oneOf(['dot', 'number']),

		/**
		 * Explicitly sets the ViewManager transition direction.
		 *
		 * @type {Boolean}
		 * @private
		 */
		reverseTransition: PropTypes.bool,

		/**
		 * When `true`, renders footer Close and Next buttons below the page content.
		 * Footer buttons are hidden when `bannerMode` is true.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		showFooterButtons: PropTypes.bool,

		/**
		 * The total number of pages.
		 *
		 * @type {Number}
		 * @private
		 */
		totalIndex: PropTypes.number,

		/**
		 * A unique identifier for each PageViews component.
		 *
		 * @type {String}
		 * @private
		 */
		uniqueId: PropTypes.string
	},

	defaultProps: {
		arranger: BasicArranger,
		noAnimation: true,
		pageIndicatorPosition: 'bottom',
		pageIndicatorType: 'dot',
		showFooterButtons: false
	},

	styles: {
		css: componentCss,
		className: 'pageViews',
		publicClassNames: true
	},

	handlers: {
		onKeyDown: handle(
			forProp('bannerMode', true),
			(ev: any, {index, onChange, rtl, totalIndex, uniqueId}: any) => {
				Spotlight.set('banner-container' + uniqueId, {
					navigableFilter: (node: any) => node.classList.contains(componentCss.viewManager)
				});

				if ((!rtl && isRight(ev.keyCode)) || (rtl && isLeft(ev.keyCode))) {
					handlePageChange(index, onChange, totalIndex);
				} else if ((!rtl && isLeft(ev.keyCode)) || (rtl && isRight(ev.keyCode))) {
					handlePageChange(index, onChange);
				}
			}
		),
		onMouseOver: handle(
			forProp('bannerMode', true),
			(ev: any, {uniqueId}: any) => Spotlight.set('banner-container' + uniqueId, {navigableFilter: null})
		),
		onFooterNextClick: handle(
			forwardCustomWithPrevent('onFooterNextClick'),
			(ev: any, {index, onChange, totalIndex}: any) => {
				handlePageChange(index, onChange, totalIndex);
			}
		),
		onNextClick: handle(
			forwardCustomWithPrevent('onNextClick'),
			(ev: any, {index, onChange, totalIndex}: any) => {
				handlePageChange(index, onChange, totalIndex);
			}
		),
		onPrevClick: handle(
			forwardCustomWithPrevent('onPrevClick'),
			(ev: any, {index, onChange}: any) => {
				handlePageChange(index, onChange);
			}
		),
		onPointerOver: handle(
			forProp('bannerMode', true),
			(ev: any, {uniqueId}: any) => Spotlight.set('banner-container' + uniqueId, {navigableFilter: null})
		),
		onStepsClick: handle(
			forProp('bannerMode', true),
			forwardCustomWithPrevent('onStepsClick'),
			(ev: any, {onChange}: any) => {
				const node = ev.target;
				const index = parseInt(node.getAttribute('data-index'));

				if (node.children.length) return;

				onChange({type: 'onChange', index: index});
			}
		),
		onTransition: (ev: any, {index, onTransition, uniqueId}: any) => {
			Spotlight.focus('banner-view-manager' + uniqueId);
			Spotlight.resume();
			if (onTransition) {
				onTransition({type: 'onTransition', index});
			}
		},
		onWillTransition: (ev: any, {index, onWillTransition}: any) => {
			Spotlight.pause();
			if (onWillTransition) {
				onWillTransition({type: 'onWillTransition', index});
			}
		}
	},

	computed: {
		className: ({fullContents, pageIndicatorPosition, pageIndicatorType, styler}) => styler.append({fullContents}, `indicator${cap(pageIndicatorPosition)}`, pageIndicatorType),
		renderFooterButtons: ({bannerMode, css = componentCss, footerCloseLabel, index = 0, onFooterCloseClick, onFooterNextClick, showFooterButtons, totalIndex = 0, uniqueId}) => {
			if (!showFooterButtons || bannerMode) return null;

			const isLastPage = index >= totalIndex - 1;

			return (
				<RowLayout className={css.footerButtons}>
					<ButtonComponent
						className={isLastPage ? spotlightDefaultClass : null}
						spotlightId={"PageViews-footer-close" + uniqueId}
						onClick={onFooterCloseClick}
					>
						{footerCloseLabel || $L('Close')}
					</ButtonComponent>
					{!isLastPage ? (
						<ButtonComponent
							className={spotlightDefaultClass}
							spotlightId={"PageViews-footer-next" + uniqueId}
							onClick={onFooterNextClick}
						>
							{$L('Next')}
						</ButtonComponent>
					) : null}
				</RowLayout>
			);
		},
		renderNextButton: ({css = componentCss, onNextClick, index = 0, totalIndex = 0}) => {
			const isNextButtonVisible = index < totalIndex - 1;

			return (
				<CellLayout className={css.navButtonCell} shrink>
					{isNextButtonVisible ? <ButtonComponent aria-label={$L('Next')} className={css.navButton} icon="arrowlargeright" iconFlip="auto" id="NextNavButton" onClick={onNextClick} /> : null}
				</CellLayout>
			);
		},
		renderPrevButton: ({css = componentCss, index = 0, onPrevClick}) => {
			const isPrevButtonVisible = index !== 0;
			return (
				<CellLayout className={css.navButtonCell} shrink>
					{isPrevButtonVisible ? <ButtonComponent aria-label={$L('Previous')} className={css.navButton} icon="arrowlargeleft" iconFlip="auto" id="PrevNavButton" onClick={onPrevClick} /> : null}
				</CellLayout>
			);
		},
		renderViewManager: ({arranger, bannerMode, css = componentCss, index, noAnimation, onTransition, onWillTransition, reverseTransition, uniqueId, children}) => {
			const CellComponent = bannerMode ? SpottableCell : CellLayout;
			const props: Record<string, any> = {};
			if (bannerMode) props.spotlightId = "banner-view-manager" + uniqueId;

			return (
				<CellComponent
					arranger={arranger}
					className={css.viewManager}
					component={ViewManager}
					duration={400}
					index={index}
					noAnimation={(typeof ENACT_PACK_NO_ANIMATION !== 'undefined' && ENACT_PACK_NO_ANIMATION) || noAnimation}
					onTransition={onTransition}
					onWillTransition={onWillTransition}
					reverseTransition={reverseTransition}
					{...props}
				>
					{children}
				</CellComponent>
			);
		},
		stepHintAriaLabel: ({children, index = 0, totalIndex}) => {
			const pageHint = new IString($L('Page {current} out of {total}')).format({current: index + 1, total: totalIndex});
			const page = Children.toArray(children)[index];
			const ariaLabel = isValidElement<{['aria-label']?: string}>(page) ? page.props['aria-label'] : '';
			return `${pageHint} ${ariaLabel || ''}`;
		},
		steps: ({bannerMode, css = componentCss, index = 0, onNextClick, onPrevClick, onStepsClick, pageIndicatorType, totalIndex = 0}) => {
			const isPrevButtonVisible = index !== 0;
			const isNextButtonVisible = index < totalIndex - 1;
			const isStepVisible = totalIndex !== 1;

			return (
				<>
					{pageIndicatorType !== 'number' ?
						<RowLayout className={classNames(css.stepsRow, {[css.hidden]: !isStepVisible})}>
							<StepsComponent
								css={css}
								current={index + 1}
								highlightCurrentOnly
								onClick={onStepsClick}
								total={totalIndex}
							/>
						</RowLayout> :
						<RowLayout className={css.stepsRow}>
							<CellLayout className={css.navButtonCell} shrink>
								{isPrevButtonVisible ? <ButtonComponent spotlightDisabled={bannerMode} aria-label={$L('Previous')} className={css.navButton} icon="arrowlargeleft" iconFlip="auto" id="PrevNavButton" onClick={onPrevClick} /> : null}
							</CellLayout>
							<CellLayout className={css.pageNumber} shrink>{index + 1}<CellLayout className={css.separator} shrink>/</CellLayout>{totalIndex}</CellLayout>
							<CellLayout className={css.navButtonCell} shrink>
								{isNextButtonVisible ? <ButtonComponent spotlightDisabled={bannerMode} aria-label={$L('Next')} className={css.navButton} icon="arrowlargeright" iconFlip="auto" id="NextNavButton" onClick={onNextClick} /> : null}
							</CellLayout>
						</RowLayout>}
				</>
			);
		}
	},

	render: ({
		arranger,
		bannerMode,
		children,
		css = componentCss,
		componentRef,
		footerCloseLabel,
		fullContents,
		index = 0,
		noAnimation,
		onFooterCloseClick,
		onFooterNextClick,
		onNextClick,
		onPrevClick,
		onStepsClick,
		onTransition,
		onWillTransition,
		pageIndicatorPosition,
		pageIndicatorType,
		renderFooterButtons,
		renderNextButton,
		renderPrevButton,
		renderViewManager,
		reverseTransition,
		rtl,
		showFooterButtons,
		stepHintAriaLabel,
		steps,
		totalIndex,
		uniqueId,
		...rest
	}) => {
		void [arranger, bannerMode, children, footerCloseLabel, noAnimation, onFooterCloseClick, onFooterNextClick, onNextClick, onPrevClick, onStepsClick, onTransition, onWillTransition, reverseTransition, rtl, showFooterButtons, totalIndex];

		return (
			<div role="region" aria-labelledby={`pageViews_index_${index}`} ref={componentRef} {...rest}>
				{!fullContents && pageIndicatorPosition === 'top' ? steps : null}
				<SpottableColumn aria-label={stepHintAriaLabel} className={css.contentsArea} id={`pageViews_index_${index}`} spotlightId={"banner-container" + uniqueId}>
					{fullContents ?
						<>
							<RowLayout className={css.horizontalLayout}>{renderViewManager}</RowLayout>
							<RowLayout className={css.navButtonContainer}>{pageIndicatorType === 'dot' ? renderPrevButton : null}<CellLayout />{pageIndicatorType === 'dot' ? renderNextButton : null}</RowLayout>
							{steps}
						</> :
						<RowLayout className={css.horizontalLayout}>
							{pageIndicatorType === 'dot' ? renderPrevButton : null}
							{renderViewManager}
							{pageIndicatorType === 'dot' ? renderNextButton : null}
						</RowLayout>
					}
				</SpottableColumn>
				{!fullContents && pageIndicatorPosition === 'bottom' ? steps : null}
				{renderFooterButtons}
			</div>
		);
	}
});

/**
 * Sets the strategy used to automatically focus an element within the PageViews upon render.
 * When set to 'none', focus is not set only on the first render.
 *
 * @name autoFocus
 * @type {('default-element'|'last-focused'|'none'|String)}
 * @memberof limestone/PageViews.PageViews.prototype
 * @default 'last-focused'
 * @public
 */

const PageViewsDecorator = compose(
	(Changeable as any)({prop: 'index'}),
	(SpotlightContainerDecorator as any)({
		continue5WayHold: true,
		defaultElement: [`.${spotlightDefaultClass}`, `.${componentCss.viewManager} *`, `.${componentCss.navButtonCell} *`],
		enterTo: 'last-focused'
	}),
	(I18nContextDecorator as any)({rtlProp: 'rtl'}),
	PageViewsRouter as any,
	Skinnable as any
);

/**
 * A PageViews that can navigate through different pages.
 * Expects {@link limestone/PageViews.Page|Page} as children.
 *
 * @class PageViews
 * @memberof limestone/PageViews
 * @extends limestone/PageViews.PageViewsBase
 * @mixes ui/Changeable.Changeable
 * @ui
 * @public
 */
const PageViews = PageViewsDecorator(PageViewsBase) as ComponentType<PageViewsBaseProps>;

export default PageViews;
export {
	PageViews
};
