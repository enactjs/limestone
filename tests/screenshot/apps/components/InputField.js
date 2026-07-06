import {InputField} from '../../../../Input';
import {useLayoutEffect} from 'react';

import {LoremString, withConfig, withProps, withTallglyphLocale} from './utils';

const SelectionInput = props => {
	useLayoutEffect(() => {
		document.querySelector('input').focus();
		document.querySelector('input').setSelectionRange(2, 7);
	});
	return <InputField {...props} />;
};

const inputFieldSmokeTests = [
	<InputField />,
	<InputField placeholder="Placeholder InputField" />,
	<InputField marqueeContent placeholder="Placeholder InputField" />,
	<InputField placeholder="Placeholder InputField" disabled />,

	// InputField field of type 'number' should be empty with letters as input
	<InputField value="Simple value" type="number" />,
	// InputField field of type 'number' should be empty with letters as input
	<InputField value="Simple value" type="number" disabled />,

	<InputField value="1234567890" type="number" />,
	<InputField value="1234567890" type="number" disabled />,
	<InputField value="Simple value" type="password" />,
	<InputField value="Simple value" type="password" disabled />,
	<InputField value="https://enactjs.com" type="url" />,
	<InputField value="https://enactjs.com" type="url" disabled />
];

const inputFieldQwtcTests = [
	// Long Text: Ellipses display with Letters, Numbers, Special Characters - [QWTC-2165]
	<InputField value={LoremString} />,
	<InputField value="!@#$%^&()_+-=[]\;',./{}|:?" />,
	<InputField value="012345678901234567890123456789" />,

	// Long Text and marqueeContent
	<InputField marqueeContent value={LoremString} />,
	<InputField marqueeContent value="!@#$%^&()_+-=[]\;',./{}|:?" />,
	<InputField marqueeContent value="012345678901234567890123456789" />,

	// 'invalid' Knob - Tooltip is on the Right and Aligns with InputField in LTR Layout - [QWTC-2162]
	<InputField value={LoremString} invalid />,

	<InputField value={LoremString} invalid invalidMessage="Changed invalid Message " />,

	// Long Text is Not Truncated with IconBefore and IconAfter - [QWTC-2163]
	<InputField value={LoremString} iconBefore="check" iconAfter="home" />,

	// tallCharacters: Change 'size' dynamically - [QWTC-2164]
	// Note: text stays the same size, the InputField field becomes smaller
	<InputField value="नरेंद्र मोदी" size="large" />,
	<InputField value=" ฟิ้  ไั  ஒ  து" size="large" />,
	<InputField value="ÃÑÕÂÊÎÔÛÄËÏÖÜŸ" size="large" />,
	<InputField value="តន្ត្រី" size="large" />,
	// Testing default size 'large'
	<InputField value="नरेंद्र मोदी" />,
	<InputField value=" ฟิ้  ไั  ஒ  து" />,
	<InputField value="ÃÑÕÂÊÎÔÛÄËÏÖÜŸ" />,
	<InputField value="តន្ត្រី" />,

	// Change 'size' dynamically to 'small' - [QWTC-1971]
	<InputField value="small InputField" size="large" />,

	// Disabled Characters Displays in the Disabled InputField - [QWTC-1969]
	// This will also test: Transparent Disabled InputField Displays with Background - [QWTC-1965]
	<InputField value="I am value" />,
	<InputField value="I am a disabled value" disabled />
];

const inputFieldExtendedTests = [
	// Selection color
	<SelectionInput value="Selection value" />
];

const inputFieldFocusTests = withProps({focus: true}, [
	<InputField />,
	<InputField placeholder="Focused Placeholder InputField" />,
	<InputField value="Focused Simple value" type="number" />,
	<InputField value="https://enactjs.com" type="url" />
]);

const inputFieldLargeTextTests = [
	// Large text — smoke representatives
	<InputField />,
	<InputField placeholder="Placeholder InputField" />,
	<InputField value={LoremString} invalid />
];

const inputFieldRtlTests = [
	{
		locale: 'ar-SA',
		component: <InputField />
	},
	{
		locale: 'ar-SA',
		component: <InputField placeholder="Placeholder InputField" />
	},
	{
		locale: 'ar-SA',
		component: <InputField placeholder="Placeholder InputField" disabled />
	},

	// InputField field of type 'number' should be empty with letters as input
	{
		locale: 'ar-SA',
		component: <InputField value="Simple value" type="number" />
	},
	{
		locale: 'ar-SA',
		component: <InputField value="Simple value" type="number" disabled />
	},
	{
		locale: 'ar-SA',
		component: <InputField value="1234567890" type="number" />
	},
	{
		locale: 'ar-SA',
		component: <InputField value="1234567890" type="number" disabled />
	},
	{
		locale: 'ar-SA',
		component: <InputField value="Simple value" type="password" />
	},
	{
		locale: 'ar-SA',
		component: <InputField value="Simple value" type="password" disabled />
	},
	{
		locale: 'ar-SA',
		component: <InputField value="https://enactjs.com" type="url" />
	},
	{
		locale: 'ar-SA',
		component: <InputField value="https://enactjs.com" type="url" disabled />
	},

	// 'invalid' Knob - Tooltip is on the Left and Aligns with InputField in RTL Layout - [QWTC-2166]
	{
		locale: 'ar-SA',
		component: <InputField value={LoremString} invalid />
	},

	// Text Vertically Center Aligns in InputField Field - RTL - [QWTC-1966]
	{
		locale: 'ar-SA',
		component: <InputField value="HHHHHH" />
	},

	// Long Text: Ellipses display with Letters, Numbers, Special Characters - [QWTC-2165]
	{
		locale: 'ar-SA',
		component: <InputField value={LoremString} />
	},
	{
		locale: 'ar-SA',
		component: <InputField value="!@#$%^&()_+-=[]\;',./{}|:?" />
	},
	{
		locale: 'ar-SA',
		component: <InputField value="012345678901234567890123456789" />
	},

	{
		locale: 'ar-SA',
		component: <InputField value={LoremString} invalid invalidMessage="Changed invalid Message " />
	},

	// Long Text is Not Truncated with IconBefore and IconAfter - [QWTC-2163]
	{
		locale: 'ar-SA',
		component: <InputField value={LoremString} iconBefore="check" iconAfter="home" />
	},

	// tallCharacters: Change 'size' dynamically - [QWTC-2164]
	// Note: text stays the same size, the InputField field becomes smaller
	{
		locale: 'ar-SA',
		component: <InputField value="नरेंद्र मोदी" size="large" />
	},
	{
		locale: 'ar-SA',
		component: <InputField value=" ฟิ้  ไั  ஒ  து" size="large" />
	},
	{
		locale: 'ar-SA',
		component: <InputField value="ÃÑÕÂÊÎÔÛÄËÏÖÜŸ" size="large" />
	},
	{
		locale: 'ar-SA',
		component: <InputField value="តន្ត្រី" size="large" />
	},

	// Testing default size 'large'
	{
		locale: 'ar-SA',
		component: <InputField value="नरेंद्र मोदी" />
	},
	{
		locale: 'ar-SA',
		component: <InputField value=" ฟิ้  ไั  ஒ  து" />
	},
	{
		locale: 'ar-SA',
		component: <InputField value="ÃÑÕÂÊÎÔÛÄËÏÖÜŸ" />
	},
	{
		locale: 'ar-SA',
		component: <InputField value="តន្ត្រី" />
	},

	// Change 'size' dynamically to 'small' - [QWTC-1971]
	{
		locale: 'ar-SA',
		component: <InputField value="small InputField" size="large" />
	},

	// Disabled Characters Displays in the Disabled InputField - [QWTC-1969]
	// This will also test: Transparent Disabled InputField Displays with Background - [QWTC-1965]
	{
		locale: 'ar-SA',
		component: <InputField value="I am value" />
	},
	{
		locale: 'ar-SA',
		component: <InputField value="I am a disabled value" disabled />
	},
	// Selection color
	{
		locale: 'ar-SA',
		component: <SelectionInput value="Selection value" />
	}
];

const inputFieldTallglyphTests = [
	<InputField value=" ฟิ้  ไั  ஒ  து" />,
	<InputField value="ÃÑÕÂÊÎÔÛÄËÏÖÜŸ" />,
	<InputField value="តន្ត្រី" />
];

const InputFieldTests = [
	...inputFieldSmokeTests,
	...inputFieldQwtcTests,
	...inputFieldExtendedTests,
	...inputFieldFocusTests,
	...withConfig({textSize: 'large'}, inputFieldLargeTextTests),
	...inputFieldRtlTests,
	...withTallglyphLocale(inputFieldTallglyphTests)
];

export default InputFieldTests;
