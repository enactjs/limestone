import BodyText from '../../../../BodyText';

import {withConfig, withTallglyphLocale, LoremString} from './utils';

const bodyTextSmokeTests = [
	<BodyText>This is some text</BodyText>, // [QWTC - 2022]
	<BodyText size="small">This is some text small</BodyText>, // [QWTC - 2023]
	<BodyText centered>This is some text</BodyText>, // [QWTC - 2021]
	<BodyText centered>{LoremString}</BodyText>,
	<BodyText centered size="small">This is some text</BodyText>, // [QWTC - 2026]
	<BodyText noWrap size="small">{LoremString}</BodyText>,
	<BodyText noWrap>{LoremString}</BodyText>
];

const bodyTextQwtcTests = [
	// Indian
	{
		locale: 'bn-IN',
		component: <BodyText>পারেন।</BodyText>  // [QWTC - 642]
	},
	{
		locale: 'te-IN',
		component: <BodyText>পারেন।</BodyText>  // [QWTC - 642]
	}
];

const bodyTextLocaleSmokeTests = [
	<BodyText>This is some text</BodyText>, // [QWTC - 2022]
	<BodyText size="small">This is some text small</BodyText>, // [QWTC - 2023]
	<BodyText centered>This is some text</BodyText>, // [QWTC - 2021]
	<BodyText centered size="small">This is some text</BodyText> // [QWTC - 2026]
];

const bodyTextTallglyphTests = [
	<BodyText>RTL sample</BodyText>,  // [QWTC - 2022]
	<BodyText size="small">RTL sample small</BodyText>  // [QWTC - 2023]
];

const BodyTextTests = [
	...bodyTextSmokeTests,
	...bodyTextQwtcTests,

	// Tallglyph validation
	...withTallglyphLocale(bodyTextTallglyphTests),

	...withConfig({locale: 'ar-SA'}, bodyTextLocaleSmokeTests),
	...withConfig({skinVariants: ['largeText']}, bodyTextLocaleSmokeTests)
];

export default BodyTextTests;
