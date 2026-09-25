/**
 * Provides a Limestone styled panels component for full screen size content panel with steps.
 *
 * Usage:
 * ```
 * <QuickGuidePanels>
 *		<QuickGuidePanels.Panel aria-label="This is a description for panel">
 *			QuickGuidePanelsContent
 *		</QuickGuidePanels.Panel>
 * </QuickGuidePanels>
 * ```
 * @module limestone/QuickGuidePanels
 * @exports Panel
 * @exports QuickGuidePanels
 * @exports QuickGuidePanelsBase
 */

import {QuickGuidePanels, QuickGuidePanelsBase} from './QuickGuidePanels';
import {Panel} from './Panel';

/**
 * A shortcut to access {@link limestone/QuickGuidePanels.Panel}
 *
 * @name Panel
 * @static
 * @memberof limestone/QuickGuidePanels.QuickGuidePanels
 */
(QuickGuidePanels as typeof QuickGuidePanels & {Panel: typeof Panel}).Panel = Panel;

export default QuickGuidePanels;
export type {PanelProps} from './Panel';
export type {QuickGuidePanelsBaseProps} from './QuickGuidePanels';
export {
	Panel,
	QuickGuidePanels,
	QuickGuidePanelsBase
};
