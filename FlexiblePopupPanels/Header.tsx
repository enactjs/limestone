import {forwardCustom} from '@enact/core/handle';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';

import $L from '../internal/$L';
import {PanelsStateContext} from '../internal/Panels';
import {ContextAsDefaults} from '../internal/Panels/util';
import DefaultHeader from '../Panels/Header';
import type {ComponentType} from 'react';

import css from './FlexiblePopupPanels.module.less';

export interface HeaderBaseProps {
	closeButtonAriaLabel?: string;
	closeButtonBackgroundOpacity?: 'opaque' | 'transparent';
	noCloseButton?: boolean;
	onClose?: (...args: any[]) => any;
}

/**
 * A header component for `FlexiblePopupPanels.Panel` with a `title` and `subtitle`, supporting several configurable
 * {@link ui/Slottable.Slottable|slots} for components.
 *
 * @class Header
 * @extends limestone/Panels.Header
 * @memberof limestone/FlexiblePopupPanels
 * @ui
 * @public
 */
const HeaderBase = kind({
	name: 'Header',

	contextType: PanelsStateContext,

	_propTypes: {} as HeaderBaseProps,

	propTypes: /** @lends limestone/FlexiblePopupPanels.Header.prototype */ {
		/**
		 * Hint string read when focusing the application close button.
		 *
		 * @type {String}
		 * @default 'Exit app'
		 * @public
		 */
		closeButtonAriaLabel: PropTypes.string,

		/**
		 * Background opacity of the application close button.
		 *
		 * @type {('opaque'|'transparent')}
		 * @default 'transparent'
		 * @public
		 */
		closeButtonBackgroundOpacity: PropTypes.oneOf(['opaque', 'transparent']),

		/**
		 * Omits the close button.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noCloseButton: PropTypes.bool,

		/**
		 * Called when the app close button is clicked.
		 *
		 * @type {Function}
		 * @public
		 */
		onClose: PropTypes.func
	},

	styles: {
		css,
		className: 'header'
	},

	computed: {
		backButtonAriaLabel: ({closeButtonAriaLabel}: any) => closeButtonAriaLabel == null ? $L('Exit app') : closeButtonAriaLabel,
		backButtonBackgroundOpacity: ({closeButtonBackgroundOpacity}: any) => closeButtonBackgroundOpacity,
		className: ({noCloseButton, styler}: any, {count}: any) => styler.append({'showBack': (count > 1 && noCloseButton)}),
		noBackButton: ({noCloseButton}: any) => noCloseButton
	},

	handlers: {
		onBack: forwardCustom('onClose')
	},

	render: (props: any) => (
		<DefaultHeader
			type="mini"
			{...props}
			noCloseButton
		/>
	)
});

const Header = ContextAsDefaults({
	props: ['closeButtonAriaLabel', 'closeButtonBackgroundOpacity', 'noCloseButton', 'onClose']
}, HeaderBase) as ComponentType<HeaderBaseProps> & {defaultSlot?: string};

// Relay the defaultSlot property to our version of Header
Header.defaultSlot = (DefaultHeader as ComponentType<any> & {defaultSlot?: string}).defaultSlot;

export default Header;
export {
	Header,
	HeaderBase
};
