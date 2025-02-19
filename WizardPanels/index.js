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
WizardPanels.Panel = Panel;

export default WizardPanels;
export {
	Panel,
	WizardPanels,
	WizardPanelsBase,
	WizardPanelsDecorator
};
