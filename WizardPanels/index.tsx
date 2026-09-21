/**
 * Provides a Limestone styled panels component for stepping through a process.
 *
 * @module limestone/WizardPanels
 * @exports Panel
 * @exports WizardPanels
 */

import {WizardPanels, WizardPanelsBase, WizardPanelsDecorator} from './WizardPanels';
import Panel from './Panel';

/**
 * A shortcut to access {@link limestone/WizardPanels.Panel}
 *
 * @name Panel
 * @static
 * @memberof limestone/WizardPanels.WizardPanels
 */
(WizardPanels as typeof WizardPanels & {Panel: typeof Panel}).Panel = Panel;

export default WizardPanels;
export type {PanelBaseProps} from './Panel';
export type {WizardPanelsBaseProps} from './WizardPanels';
export {
	Panel,
	WizardPanels,
	WizardPanelsBase,
	WizardPanelsDecorator
};
