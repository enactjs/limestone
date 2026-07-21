import Button from '../../../../Button';

import {withConfig, withProps, withTallglyphLocale, TallglyphKhmer, TallglyphLatin, TallglyphMultiScript} from './utils';

import css from './Button.module.less';

// One representative scenario per visually distinct configuration (LTR).
const buttonSmokeTests = [
	<Button>click me</Button>,
	<Button>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Button>,
	{
		textSize: 'large',
		component: <Button>click me</Button>
	},
	<Button size="small">click me</Button>,
	<Button icon="plus" iconPosition="before" />,
	<Button icon="minus" iconPosition="after" />,
	<Button icon="plus" iconPosition="before">click me</Button>,
	<Button icon="minus" iconPosition="after">click me</Button>,
	<Button selected>click me</Button>,
	<Button selected icon="plus" />,
	<Button color="red">click me</Button>,
	<Button roundBorder>click me</Button>,
	{
		textSize: 'large',
		component: <Button color="red">click me</Button>
	},
	...withConfig({wrapper: {light: true, padded: true}}, [
		<Button shadowed icon="plus" minWidth={false} />,
		<Button shadowed backgroundOpacity="transparent" minWidth={false}>click me</Button>
	])

];

const buttonExtendedTests = [
	// iconPosition = before (Default) + small (default) + large
	// Leaving size small here as example, but it is not required since it is the default.
	<Button size="large">click me</Button>,
	// iconPosition = before (Default) + icon + iconPosition + small (default) + large
	<Button icon="minus" iconPosition="after" size="large">click me</Button>,
	<Button icon="plus" iconPosition="before" size="large">click me</Button>,

	// centered = true
	<Button centered icon="plus">click me</Button>,

	// Icon only, iconPosition = before (Default) + icon + iconPosition + small (default) + large
	<Button icon="minus" iconPosition="after" size="large" />,
	<Button icon="plus" iconPosition="before" size="large" />,

	// iconPosition = before (Default) + backgroundOpacity
	<Button icon="plus" backgroundOpacity="transparent">click me</Button>,
	<Button backgroundOpacity="opaque">click me</Button>,

	// Selected buttons
	<Button selected backgroundOpacity="transparent">click me</Button>,
	<Button selected backgroundOpacity="transparent" icon="plus" />,
	<Button selected backgroundOpacity="opaque">click me</Button>,

	// iconPosition = before (Default) + children has 1 letter +	minWidth = false
	<Button minWidth={false}>H</Button>,

	// iconPosition = before (Default) + color
	<Button color="green">click me</Button>,
	<Button color="yellow">click me</Button>,
	<Button color="blue">click me</Button>,
	// iconPosition = before (Default) + color + icon + iconPosition
	<Button color="red" icon="minus" iconPosition="before">click me</Button>,
	<Button color="green" icon="plus" iconPosition="after">click me</Button>,
	// iconPosition = before (Default) + color + icon + iconPosition + minWidth
	<Button color="yellow" icon="plus" iconPosition="before" minWidth={false}>click me</Button>,
	<Button color="blue" icon="minus" iconPosition="after" minWidth={false}>click me</Button>,

	// color + size small (text button) - colordot height for small normal
	<Button color="red" size="small">click me</Button>,
	// color + size small (icon-only) - colordot height for small normal
	<Button color="red" icon="plus" iconPosition="before" minWidth={false} size="small" />,

	// largeText + color buttons (size large / default) - colordot dimensions for large+largeText
	{
		textSize: 'large',
		component: <Button color="red" size="small">click me</Button>
	},
	// largeText + icon-only color buttons (size large / default)
	{
		textSize: 'large',
		component: <Button color="red" icon="plus" iconPosition="before" minWidth={false} />
	},
	// largeText + icon-only color buttons (size small)
	{
		textSize: 'large',
		component: <Button color="red" icon="plus" iconPosition="before" minWidth={false} size="small" />
	},

	// iconPosition = before (Default) + icon
	<Button icon="plus">click me</Button>,
	<Button icon="arrowlargeright">click me</Button>,
	<Button icon="info">click me</Button>,

	// iconFlip
	<Button icon="arrowhookright" iconFlip="horizontal">click me</Button>,
	<Button icon="arrowhookright" iconFlip="vertical">click me</Button>,
	<Button icon="arrowhookright" iconFlip="both">click me</Button>,
	<Button icon="arrowhookright" iconFlip="auto">click me</Button>,

	// roundBorder
	<Button roundBorder size="small">click me</Button>,
	<Button roundBorder size="large">click me</Button>,
	<Button backgroundOpacity="transparent" roundBorder>click me</Button>,
	<Button backgroundOpacity="opaque" roundBorder>click me</Button>,
	<Button icon="minus" iconPosition="after" roundBorder />,
	<Button icon="minus" iconPosition="after" roundBorder size="large" />,
	<Button icon="plus" iconPosition="before" roundBorder size="large" />,
	{
		textSize: 'large',
		component: <Button roundBorder>click me</Button>
	},
	{
		textSize: 'large',
		component: <Button roundBorder size="small">click me</Button>
	},
	{
		textSize: 'large',
		component: <Button roundBorder size="large">click me</Button>
	},
	{
		textSize: 'large',
		component: <Button backgroundOpacity="transparent" roundBorder>click me</Button>
	},
	{
		textSize: 'large',
		component: <Button backgroundOpacity="opaque" roundBorder>click me</Button>
	},
	{
		textSize: 'large',
		component: <Button icon="minus" iconPosition="after" roundBorder />
	},
	{
		textSize: 'large',
		component: <Button icon="minus" iconPosition="after" roundBorder size="large" />
	},
	{
		textSize: 'large',
		component: <Button icon="plus" iconPosition="before" roundBorder />
	},
	{
		textSize: 'large',
		component: <Button icon="plus" iconPosition="before" roundBorder size="large" />
	}
];

// QWTC-documented scenarios (kept explicitly for Jira traceability).
const buttonQwtcTests = [
	// [QWTC-2232] Checking of the expanded button will be confirmed in other test cases(QWTC-1832).
	<Button disabled>click me</Button>,
	// [QWTC-2232] end

	// [QWTC-2255] - Color Underbar displays Icon with 'minWidth' and with 'Disabled'
	<Button color="red" icon="minus" iconPosition="after" minWidth={false} disabled />,
	// [QWTC-2256] - Change 'disabled' dynamically - Icon is slightly visible with focus / Spotlight
	<Button selected color="red" icon="minus" iconPosition="after" minWidth={false} disabled />,

	<Button color="red" disabled>plus</Button>,

	// [QWTC-1837]
	<Button>{TallglyphMultiScript}</Button>,
	<Button>{TallglyphLatin}</Button>,
	<Button>Bản văn</Button>,
	<Button>{TallglyphKhmer}</Button>,
	// end [QWTC-1837]

	<Button selected backgroundOpacity="transparent">click me</Button>, // [QWTC-1828]
	<Button selected backgroundOpacity="transparent" icon="plus" />,

	// [QWTC-2257] - Color Underbar displays on Button (LTR)
	<Button color="red" icon="plus" iconPosition="before" minWidth={false} />,
	<Button color="green" icon="plus" iconPosition="after" minWidth={false} />,
	<Button color="yellow" icon="plus" iconPosition="after" minWidth={false} />,
	<Button color="blue" icon="plus" iconPosition="after" minWidth={false} />,

	// [QWTC-2259] - Color Underbar displays on Small / Large size in Selected state
	<Button selected color="red" icon="minus" iconPosition="after" minWidth={false} size="large" />,
	<Button selected color="red" icon="minus" iconPosition="after" minWidth={false} size="small" />,

	// [QWTC-1831]
	<Button icon="rotate">click me</Button>
];

// Focused with light wrapper — smoke representatives + QWTC focus cases
// const buttonFocusTests = [
// 	// [QWTC-2232]
// 	<Button>Focused button</Button>,
// 	<Button disabled>Focused button</Button>,
// 	// [QWTC-2232] end
// 	<Button icon="plus" iconPosition="before">Focused button</Button>,
// 	<Button icon="minus" iconPosition="after">Focused button</Button>,
// 	<Button selected>Focused button</Button>,
// 	<Button color="red">Focused button</Button>,
// 	<Button roundBorder>Focused button</Button>,
// 	<Button selected backgroundOpacity="transparent">Focused button</Button>, 	// [QWTC-1828]
// 	<Button selected backgroundOpacity="opaque">Focused button</Button>,
// 	// [QWTC-1831]
// 	<Button icon="rotate">Focused button</Button>,
// 	// [QWTC-2531]
// 	<Button disabled icon="forward" size="samll" tooltipText="tooltip" tooltipType="transparent">Focused button</Button>,
// 	<Button shadowed icon="minus" minWidth={false} />,
// 	<Button shadowed backgroundOpacity="transparent" minWidth={false}>Focused button</Button>
// ];

// RTL: smoke representatives + QWTC RTL cases (not a full LTR mirror).
const buttonRtlTests = [
	<Button>click me</Button>,
	<Button icon="minus" iconPosition="after" />,
	<Button icon="minus" iconPosition="after">click me</Button>,
	<Button selected>click me</Button>,
	<Button selected icon="plus" />,
	<Button selected backgroundOpacity="transparent">click me</Button>, 	// [QWTC-1828]
	<Button selected backgroundOpacity="transparent" icon="plus" />,

	// [QWTC-2258] - Color Underbar displays on Button (RTL)
	<Button color="red" icon="plus" iconPosition="before" minWidth={false} />,
	<Button color="green" icon="plus" iconPosition="after" minWidth={false} />,
	<Button color="yellow" icon="plus" iconPosition="after" minWidth={false} />,
	<Button color="blue" icon="plus" iconPosition="after" minWidth={false} />,

	// [QWTC-2259] - Color Underbar displays on Small / Large size in Selected state
	<Button selected color="red" icon="minus" iconPosition="after" minWidth={false} size="large" />,
	<Button selected color="red" icon="minus" iconPosition="after" minWidth={false} size="small" />,
	<Button icon="arrowhookright" iconFlip="auto">click me</Button>
];

const buttonTallglyphViTests = [
	<Button>Vietnamese Text</Button>,
	<Button icon="star">Vietnamese Text</Button>,
	<Button>{TallglyphMultiScript}</Button>,
	<Button>{TallglyphLatin}</Button>
];

const buttonTallglyphKmTests = [
	<Button>Cambodian Text</Button>,
	<Button icon="star">Cambodian Text</Button>,
	<Button size="small">{TallglyphKhmer}</Button>
];

const ButtonTests = [
	...buttonSmokeTests,
	...buttonQwtcTests,
	...buttonExtendedTests,

	...withConfig({focus: true}, buttonSmokeTests),

	// Tallglyph validation
	...withTallglyphLocale(buttonTallglyphViTests),
	...withConfig({locale: 'km-KH'}, buttonTallglyphKmTests),

	// *************************************************************
	// RTL
	// locale = 'ar-SA'
	// *************************************************************
	// [QWTC-1829]
	...withConfig({locale: 'ar-SA'}, buttonRtlTests),

	// *************************************************************
	// With customized button
	// *************************************************************
	// Note: When the file name of the test is too long, different tests may be recognized as the same test.
	// So we changed the Button name of Focus prop tests.
	...withProps({css: css}, [
		// standard button
		<Button>Customized button</Button>,
		<Button selected>Customized button</Button>,
		<Button size="small">Customized button</Button>,

		// With icon.
		<Button icon="minus" />,
		<Button icon="minus" size="small" />,
		<Button icon="minus" selected />,
		<Button icon="minus" iconPosition="after">Customized button</Button>,
		<Button icon="minus" iconPosition="after" size="small">Customized button</Button>
	])
];

export default ButtonTests;
