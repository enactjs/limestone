import ActionGuide from '../../../../ActionGuide';

import {pick, withConfig} from './utils';

const actionGuideSmokeTests = [
	<ActionGuide>This is some text</ActionGuide>,
	<ActionGuide icon="star" />,
	<ActionGuide icon="star">This is some text</ActionGuide>
];

const ActionGuideTests = [
	...actionGuideSmokeTests,
	...withConfig({locale: 'vi-VN'}, pick(actionGuideSmokeTests, 0, 2)),  // Tallglyph validation
	...withConfig({locale: 'ar-SA'}, actionGuideSmokeTests),
	...withConfig({skinVariants: ['largeText']}, pick(actionGuideSmokeTests, 0, 2)) // Large Text
];

export default ActionGuideTests;
