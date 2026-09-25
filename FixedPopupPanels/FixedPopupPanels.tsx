/**
 * Provides Limestone styled fixed-width, popup-styled Panels component.
 *
 * @module limestone/FixedPopupPanels
 * @exports FixedPopupPanels
 * @exports FixedPopupPanelsBase
 * @exports FixedPopupPanelsDecorator
 * @exports Panel
 * @exports Header
 */

import {forKey, forProp, forward, forwardCustom, handle, preventDefault, stop} from '@enact/core/handle';
import type {HandlerFunction} from '@enact/core/types';
import useHandlers from '@enact/core/useHandlers';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import Spotlight from '@enact/spotlight';
import {getTargetByDirectionFromElement} from '@enact/spotlight/src/target';
import compose from 'ramda/src/compose';
import type {ComponentProps, ComponentType} from 'react';

import {BasicArranger, PopupDecorator, Viewport} from '../internal/Panels';

const ViewportComponent = Viewport as ComponentType<any>;
import DefaultPanel from '../Panels/Panel';
import DefaultHeader from '../Panels/Header';

import css from './FixedPopupPanels.module.less';

export interface FixedPopupPanelsBaseProps {
	index?: number;
	noAnimation?: boolean;
	onBack?: (...args: any[]) => any;
	onKeyDown?: (...args: any[]) => any;
	rtl?: boolean;
	[key: string]: any;
}

/**
 * Adds popup functionality and `rtl` prop to {@link limestone/FixedPopupPanels|FixedPopupPanels}.
 *
 * @class FixedPopupPanelsDecorator
 * @memberof limestone/FixedPopupPanels
 * @hoc
 * @public
 */
const FixedPopupPanelsDecorator = compose(
	(I18nContextDecorator as any)({rtlProp: 'rtl'}),
	PopupDecorator({
		className: 'fixedPopupPanels',
		css,
		noAlertRole: true,
		noOutline: true,
		panelArranger: BasicArranger,
		panelType: 'fixedPopup'
	}) as any
);

const fixedPopupPanelsHandlers = {
	onKeyDown: handle(
		forward('onKeyDown'),
		({target}: any) => (target.tagName !== 'INPUT'),
		forProp('rtl', false),
		forKey('left') as HandlerFunction,
		(ev: any, {index}: any) => (index > 0),
		({target}: any) => (document.querySelector(`section.${css.body}`)?.contains(target as Node)),
		({target}: any) => (getTargetByDirectionFromElement('left', target) === null),
		forwardCustom('onBack'),
		() => {
			Spotlight.setPointerMode(false);
			return true;
		},
		preventDefault,
		stop
	)
};

/**
 * A base panels component for {@link limestone/FixedPopupPanels|FixedPopupPanels} that has
 * left key handler to navigate panels.
 *
 * @class FixedPopupPanelsBase
 * @memberof limestone/FixedPopupPanels
 * @ui
 * @public
 */
const FixedPopupPanelsBase = ({noAnimation, ...props}: FixedPopupPanelsBaseProps) => {
	const handlers = useHandlers(fixedPopupPanelsHandlers, props);
	return <ViewportComponent {...props} {...handlers} noAnimation={(typeof ENACT_PACK_NO_ANIMATION !== 'undefined' && ENACT_PACK_NO_ANIMATION) || noAnimation} />;
};

/**
 * An instance of {@link limestone/Panels.Panels|Panels} which restricts the `Panel` to the right
 * or left side of the screen inside a popup. Typically used for overlaying panels over other
 * content.
 *
 * @class FixedPopupPanels
 * @memberof limestone/FixedPopupPanels
 * @extends limestone/FixedPopupPanels.FixedPopupPanelsBase
 * @mixes limestone/FixedPopupPanels.FixedPopupPanelsDecorator
 * @ui
 * @public
 */
const FixedPopupPanels = FixedPopupPanelsDecorator(FixedPopupPanelsBase) as ComponentType<FixedPopupPanelsBaseProps>;

/**
 * Size of the popup.
 *
 * @memberof limestone/FixedPopupPanels.FixedPopupPanels.prototype
 * @name width
 * @type {('narrow'|'half')}
 * @default 'narrow'
 * @public
 */

/**
 * The standard view container used inside a
 * {@link limestone/FixedPopupPanels.FixedPopupPanels|FixedPopupPanels} view manager instance.
 *
 * @class Panel
 * @extends limestone/Panels.Panel
 * @memberof limestone/FixedPopupPanels
 * @ui
 * @public
 */
const Panel = (props: ComponentProps<typeof DefaultPanel>) => (<DefaultPanel {...props} css={css} hideChildren={false} />);

/**
 * A shortcut to access {@link limestone/FixedPopupPanels.Panel}
 *
 * @name Panel
 * @static
 * @memberof limestone/FixedPopupPanels.FixedPopupPanels
 */
(FixedPopupPanels as ComponentType<FixedPopupPanelsBaseProps> & {Panel: typeof Panel}).Panel = Panel;

/**
 * A header component for a Panel with a `title` and `subtitle`, supporting several configurable
 * {@link ui/Slottable.Slottable|`slots`} for components.
 *
 * @class Header
 * @extends limestone/Panels.Header
 * @memberof limestone/FixedPopupPanels
 * @ui
 * @public
 */
const Header = (props: ComponentProps<typeof DefaultHeader>) => (<DefaultHeader type="compact" {...props} css={css} />);
// Relay the defaultSlot property to our version of Header
Header.defaultSlot = (DefaultHeader as ComponentType<any> & {defaultSlot?: string}).defaultSlot;

/**
 * A shortcut to access {@link limestone/FixedPopupPanels.Header}
 *
 * @name Header
 * @static
 * @memberof limestone/FixedPopupPanels.FixedPopupPanels
 */
(FixedPopupPanels as ComponentType<FixedPopupPanelsBaseProps> & {Header: typeof Header}).Header = Header;

export default FixedPopupPanels;
export {
	FixedPopupPanels,
	FixedPopupPanelsBase,
	FixedPopupPanelsDecorator,
	Header,
	Panel
};
