import ActionGuide from '../../../../ActionGuide';

import {withConfig, withTallglyphLocale} from './utils';

const actionGuideSmokeTests = [
	<ActionGuide>This is some text</ActionGuide>,
	<ActionGuide icon="star" />,
	<ActionGuide icon="star">This is some text</ActionGuide>
];

const ActionGuideTests = [
	...actionGuideSmokeTests,
	...withTallglyphLocale(actionGuideSmokeTests),
	...withConfig({locale: 'ar-SA'}, actionGuideSmokeTests),
	...withConfig({skinVariants: ['largeText']}, actionGuideSmokeTests) // Large Text
];

export default ActionGuideTests;
