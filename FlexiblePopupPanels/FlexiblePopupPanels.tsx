import kind from '@enact/core/kind';
import {mapAndFilterChildren} from '@enact/core/util';
import {I18nContextDecorator} from "@enact/i18n/I18nDecorator";
import PropTypes from 'prop-types';
import {Children, cloneElement} from 'react';
import type {ComponentType, ReactElement, ReactNode} from 'react';

import {FadeAndSlideArranger, PopupDecorator, Viewport} from '../internal/Panels';

const ViewportComponent = Viewport as ComponentType<any>;

import {NavButtonFocusDecorator} from './useNavButtonFocus';

import css from './FlexiblePopupPanels.module.less';

export interface FlexiblePopupPanelsBaseProps {
	children?: ReactNode;
	nextButtonVisibility?: 'auto' | 'always' | 'never';
	noAnimation?: boolean;
	onChange?: (...args: any[]) => any;
	onNextClick?: (...args: any[]) => any;
	onPrevClick?: (...args: any[]) => any;
	prevButtonVisibility?: 'auto' | 'always' | 'never';
	rtl?: boolean;
}

/**
 * An instance of {@link limestone/Panels.Panels|Panels} which restricts the `Panel` to the left
 * or right side of the screen inside a popup. This panel flexes both horizontally and vertically,
 * with the Header positioned outside the Panel background area. This is typically used for a single
 * setting or control at a time, for maximum background area viewing.
 *
 * @class FlexiblePopupPanels
 * @memberof limestone/FlexiblePopupPanels
 * @ui
 * @public
 */
const FlexiblePopupPanelsBase = kind({
	name: 'FlexiblePopupPanels',

	_propTypes: {} as FlexiblePopupPanelsBaseProps,

	propTypes: /** @lends limestone/FlexiblePopupPanels.FlexiblePopupPanels.prototype */ {
		/**
		 * Specifies when and how to show `nextButton` on `FlexiblePopupPanels.Panel`.
		 *
		 * * `'auto'` will display the `nextButton` if more than one `FlexiblePopupPanels.Panel` exists
		 * * `'always'` will always display the `nextButton`
		 * * `'never'` will always hide the `nextButton`
		 *
		 * Note, children values will override the generalized parent visibility settings. In this
		 * case, a customized `nextButton` on `FlexiblePopupPanels.Panel` will take precedence over the
		 * `nextButtonVisibility` value.
		 *
		 * @type {('auto'|'always'|'never')}
		 * @default 'auto'
		 * @public
		 */
		nextButtonVisibility: PropTypes.oneOf(['auto', 'always', 'never']),

		/**
		* Called when the index value is changed.
		*
		* @type {Function}
		* @param {Object} event
		* @public
		*/
		onChange: PropTypes.func,

		/**
		 * Called when the next button is clicked in `FlexiblePopupPanels.Panel`.
		 *
		 * Calling `preventDefault` on the passed event will prevent advancing to the next panel.
		 *
		 * @type {Function}
		 * @public
		 */
		onNextClick: PropTypes.func,

		/**
		 * Called when the previous button is clicked in `FlexiblePopupPanels.Panel`.
		 *
		 * Calling `preventDefault` on the passed event will prevent navigation to the previous panel.
		 *
		 * @type {Function}
		 * @public
		 */
		onPrevClick: PropTypes.func,

		/**
		 * Specifies when and how to show `prevButton` on `FlexiblePopupPanels.Panel`.
		 *
		 * * `'auto'` will display the `prevButton` if more than one `FlexiblePopupPanels.Panel` exists
		 * * `'always'` will always display the `prevButton`
		 * * `'never'` will always hide the `prevButton`
		 *
		 * Note, children values will override the generalized parent visibility settings. In this case,
		 * if user provides a customized `prevButton` on `FlexiblePopupPanels.Panel` will take precedence over the `prevButtonVisibility` value.
		 *
		 * @type {('auto'|'always'|'never')}
		 * @default 'auto'
		 * @public
		 */
		prevButtonVisibility: PropTypes.oneOf(['auto', 'always', 'never']),

		/**
		 * Indicates the locale's text direction is right-to-left.
		 *
		 * @type {Boolean}
		 * @private
		 */
		rtl: PropTypes.bool
	},

	defaultProps: {
		nextButtonVisibility: 'auto',
		prevButtonVisibility: 'auto'
	},

	styles: {
		css,
		className: 'viewport'
	},

	computed: {
		children: ({children, nextButtonVisibility, onChange, onNextClick, onPrevClick, prevButtonVisibility}) => mapAndFilterChildren(children, (child: ReactElement) => {
			const props = {
				nextButtonVisibility,
				onChange,
				onNextClick,
				onPrevClick,
				prevButtonVisibility
			};

			return cloneElement(child, props);
		}),
		onBack: ({onChange}) => onChange,
		className: ({children, nextButtonVisibility, prevButtonVisibility, rtl, styler}) => {
			const childCount = Children.count(children);
			const isPrevButtonVisible = Boolean(prevButtonVisibility === 'always' || (prevButtonVisibility === 'auto' && childCount > 1));
			const isNextButtonVisible = Boolean(nextButtonVisibility === 'always' || (nextButtonVisibility === 'auto' && childCount > 1));

			return styler.append(
				{
					noNavButton: ((rtl && !isNextButtonVisible) || (!rtl && !isPrevButtonVisible))
				}
			);
		}
	},

	render: ({nextButtonVisibility, noAnimation, onChange, onNextClick, onPrevClick, prevButtonVisibility, ...props}) => {
		void [nextButtonVisibility, onChange, onNextClick, onPrevClick, prevButtonVisibility];

		return (<ViewportComponent {...props} noAnimation={(typeof ENACT_PACK_NO_ANIMATION !== 'undefined' && ENACT_PACK_NO_ANIMATION) || noAnimation} />);
	}
});

const FlexiblePopupPanels = PopupDecorator(
	{
		className: 'flexiblePopupPanels',
		css,
		noAlertRole: true,
		noOutline: true,
		panelArranger: FadeAndSlideArranger,
		panelType: 'flexiblePopup'
	},
	NavButtonFocusDecorator(
		I18nContextDecorator({rtlProp: 'rtl'}, FlexiblePopupPanelsBase) as any
	) as any
) as ComponentType<FlexiblePopupPanelsBaseProps> & {defaultProps?: Record<string, any>};

// Directly set the defaultProps for position to the left side so it initially draws on the correct
// side. The real default is assigned in PopupDecorator, but should still be overridable by an app.
FlexiblePopupPanels.defaultProps = {
	...FlexiblePopupPanels.defaultProps,
	position: 'left'
};

export default FlexiblePopupPanels;
export {
	FlexiblePopupPanels,
	FlexiblePopupPanelsBase
};
