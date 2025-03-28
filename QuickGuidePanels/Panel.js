import {use, useEffect} from 'react';

import {PanelsContext} from '../internal/Panels/PanelsRouter';

/**
 * Panel that sets the children for
 * {@link limestone/QuickGuidePanels.QuickGuidePanels|QuickGuidePanels}.
 *
 * @class Panel
 * @memberof limestone/QuickGuidePanels
 * @ui
 * @public
 */
function Panel ({
	'aria-label': ariaLabel,
	children,
	nextButton,
	prevButton
}) {
	const set = use(PanelsContext);

	useEffect(() => {
		if (set) {
			set({
				'aria-label': ariaLabel,
				children,
				nextButton,
				prevButton
			});
		}
	}, [
		ariaLabel,
		children,
		nextButton,
		prevButton,
		set
	]);
	return null;
}

/**
 * The aria-label for the Panel.
 *
 * Example:
 * ```
 * <QuickGuidePanels.Panel aria-label="This is a description for panel">
 * ```
 * @name aria-label
 * @type {String}
 * @memberof limestone/QuickGuidePanels.Panel.prototype
 * @public
 */

/**
 * The button to use in place of the standard next button.
 *
 * This prop accepts a component (e.g. `Button`), a component instance or a boolean value.
 *
 * If `false`, the button will not show. If set to a component, or `true`, the button will
 * show. This will override the setting of
 * {@link limestone/QuickGuidePanels.QuickGuidePanelsBase.nextButtonVisibility|nextButtonVisibility}.
 *
 * Example:
 * ```
 * nextButton={<Button icon="closex" aria-label="Quit">Close</Button>}
 * ```
 *
 * @name nextButton
 * @memberof limestone/QuickGuidePanels.Panel.prototype
 * @type {Boolean|Component}
 * @public
 */

/**
 * The button to use in place of the standard prev button.
 *
 * This prop accepts a component (e.g. `Button`), a component instance or a boolean value.
 *
 * If `false`, the button will not show. If set to a component, or `true`, the button will
 * show. This will override the setting of
 * {@link limestone/QuickGuidePanels.QuickGuidePanelsBase.prevButtonVisibility|prevButtonVisibility}.
 *
 * Example:
 * ```
 * prevButton={<Button icon="closex" aria-label="Back">Back</Button>}
 * ```
 *
 * @name prevButton
 * @memberof limestone/QuickGuidePanels.Panel.prototype
 * @type {Boolean|Component}
 * @public
 */

export default Panel;
export {
	Panel
};
