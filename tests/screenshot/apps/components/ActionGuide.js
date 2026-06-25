import ActionGuide from '../../../../ActionGuide';

import {withConfig} from './utils';

const actionGuideSmokeTests = [
	<ActionGuide>This is some text</ActionGuide>,
	<ActionGuide icon="star" />,
	<ActionGuide icon="star">This is some text</ActionGuide>
];

const ActionGuideTests = [
	...actionGuideSmokeTests,
	...withConfig({locale: 'vi-VN'}, actionGuideSmokeTests),  // Tallglyph validation
	...withConfig({locale: 'ar-SA'}, actionGuideSmokeTests),
	...withConfig({skinVariants: ['largeText']}, actionGuideSmokeTests) // Large Text
];

export default ActionGuideTests;
