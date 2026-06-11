import BodyText from '../../../../BodyText';

import {pick, withConfig, LoremString} from './utils';

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

const bodyTextRtlTests = pick(bodyTextSmokeTests, 0, 2, 4);

const bodyTextLargeTextTests = pick(bodyTextSmokeTests, 0, 2, 4);

const BodyTextTests = [
	...bodyTextSmokeTests,
	...bodyTextQwtcTests,

	// Tallglyph validation
	...withConfig({locale: 'vi-VN'}, [
		<BodyText>RTL sample</BodyText>,  // [QWTC - 2022]
		<BodyText size="small">RTL sample small</BodyText>  // [QWTC - 2023]
	]),

	...withConfig({locale: 'ar-SA'}, bodyTextRtlTests),
	...withConfig({skinVariants: ['largeText']}, bodyTextLargeTextTests)
];

export default BodyTextTests;
