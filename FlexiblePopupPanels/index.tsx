/**
 * Provides a Limestone styled flexible-width, popup-styled Panels component.
 *
 * @module limestone/FlexiblePopupPanels
 * @exports FlexiblePopupPanels
 * @exports Header
 * @exports Panel
 */

import {FlexiblePopupPanels, FlexiblePopupPanelsBase} from './FlexiblePopupPanels';
import Header from './Header';
import Panel, {PanelBase} from './Panel';

/**
 * A shortcut to access {@link limestone/FlexiblePopupPanels.Panel}
 *
 * @name Panel
 * @static
 * @memberof limestone/FlexiblePopupPanels.FlexiblePopupPanels
 */
(FlexiblePopupPanels as typeof FlexiblePopupPanels & {Panel: typeof Panel}).Panel = Panel;

/**
 * A shortcut to access {@link limestone/FlexiblePopupPanels.Header}
 *
 * @name Header
 * @static
 * @memberof limestone/FlexiblePopupPanels.FlexiblePopupPanels
 */
(FlexiblePopupPanels as typeof FlexiblePopupPanels & {Header: typeof Header}).Header = Header;

export default FlexiblePopupPanels;
export type {FlexiblePopupPanelsBaseProps} from './FlexiblePopupPanels';
export type {HeaderBaseProps} from './Header';
export type {PanelBaseProps} from './Panel';
export {
	FlexiblePopupPanels,
	FlexiblePopupPanelsBase,
	Header,
	Panel,
	PanelBase
};
