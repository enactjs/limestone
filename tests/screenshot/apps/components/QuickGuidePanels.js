import QuickGuidePanels, {Panel as QuickGuidePanel} from '../../../../QuickGuidePanels';

import {withConfig} from './utils';

const quickGuideSmokeTests = [
	<QuickGuidePanels>
		<QuickGuidePanel>View 1</QuickGuidePanel>
		<QuickGuidePanel>View 2</QuickGuidePanel>
		<QuickGuidePanel>View 3</QuickGuidePanel>
	</QuickGuidePanels>,
	<QuickGuidePanels index={1}>
		<QuickGuidePanel>View 1</QuickGuidePanel>
		<QuickGuidePanel>View 2</QuickGuidePanel>
		<QuickGuidePanel>View 3</QuickGuidePanel>
	</QuickGuidePanels>,
	<QuickGuidePanels index={2}>
		<QuickGuidePanel>View 1</QuickGuidePanel>
		<QuickGuidePanel>View 2</QuickGuidePanel>
		<QuickGuidePanel>View 3</QuickGuidePanel>
	</QuickGuidePanels>,
	<QuickGuidePanels>
		<QuickGuidePanel>View 1</QuickGuidePanel>
	</QuickGuidePanels>
];

const QuickGuidePanelsTests = [
	...withConfig({wrapper: {full: true}}, quickGuideSmokeTests),
	// Tallglyph validation
	...withConfig({wrapper: {full: true}, locale: 'vi-VN'}, quickGuideSmokeTests),
	// RTL validation
	...withConfig({wrapper: {full: true}, locale: 'ar-SA'}, quickGuideSmokeTests)
];

export default QuickGuidePanelsTests;
