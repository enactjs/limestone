import Item from '../../../../Item';
import Icon from '../../../../Icon';

import {pick, withConfig, withProps, LoremString} from './utils';

import css from './Item.module.less';

// Short text
const commonItemTests = [
	<Item>Default Item</Item>,
	<Item disabled>Disabled Item</Item>,
	<Item inline>Inline Item</Item>,
	<Item inline disabled>Disabled Inline Item</Item>,
	<Item label="Item label">Default Item with label</Item>,
	<Item disabled label="Item label">Disabled Item with label</Item>,
	<Item inline label="Item label">Inline Item with label</Item>,
	<Item inline disabled label="Item label">Disabled Inline Item with label</Item>
];

const itemSmokeTests = [
	...commonItemTests
];

// Long text
const longTextItemTests = [
	<Item>Long Default Item to invoke a marquee</Item>,
	<Item disabled>Long Disabled Item to invoke a marquee</Item>,
	<Item inline>Long Inline Item with to invoke a marquee</Item>,
	<Item inline disabled>Long Disabled to invoke a marquee</Item>
];

const rtlStrings = {
	ar: 'صباح الخي'
};

// Define tests for RTL languages
const rtlItemTests = [];
for (const lang in rtlStrings) {
	rtlItemTests.push(
		<Item>{rtlStrings[lang]}</Item>,
		<Item label={rtlStrings[lang]}>{rtlStrings[lang]}</Item>
	);
}

const tallglyphStrings = {
	// hi: 'नरेंद्र मोदी',
	// th: ' ฟิ้  ไั  ஒ  து',
	vi: 'ÃÑÕÂÊÎÔÛÄËÏÖÜŸ'
};

// Define cases where the text could be affected by tallglyph languages
const tallglyphTextCases = [];
for (const lang in tallglyphStrings) {
	tallglyphTextCases.push(
		<Item>{tallglyphStrings[lang]}</Item>,
		<Item label={tallglyphStrings[lang]}>{tallglyphStrings[lang]}</Item>
	);
}

// Attach a set of common (from above) tests to apply to each of the tallglyph cases
const tallglyphItemTests = [
	// Normal
	...tallglyphTextCases,
	// Disabled
	...withProps({disabled: true}, tallglyphTextCases),
	// Inline
	...withProps({inline: true}, tallglyphTextCases),
	// Inline Disabled
	...withProps({inline: true, disabled: true}, tallglyphTextCases)
];

const itemQwtcTests = [
	// With tall characters and disabled [QWTC-1826]
	...tallglyphItemTests
];

const itemFocusTests = [
	// Focused
	<Item>Focused Item</Item>,
	<Item slotBefore={<Icon>star</Icon>}>Focused Item</Item>,
	<Item slotAfter={<Icon>star</Icon>}>Focused Item</Item>,
	<Item slotBefore={<Icon>star</Icon>} slotAfter={<Icon>star</Icon>}>Focused Item</Item>
];

const itemFocusedLightWrapperTests = [
	// Focused with light wrapper
	<Item>Focused Item</Item>
];

const itemCenteredTests = [
	// Centered
	<Item>Centered Item</Item>,
	<Item>{LoremString}</Item>,
	// Just slotBefore
	<Item slotBefore={<Icon>star</Icon>}>Centered Item</Item>,
	<Item slotBefore={<Icon>star</Icon>}>{LoremString}</Item>,
	// Just slotAfter
	<Item slotAfter={<Icon>star</Icon>}>Centered Item</Item>,
	<Item slotAfter={<Icon>star</Icon>}>{LoremString}</Item>,
	// Both slotBefore and slotAfter
	<Item slotBefore={<Icon>star</Icon>} slotAfter={<Icon>star</Icon>}>Centered Item</Item>,
	<Item slotBefore={<Icon>star</Icon>} slotAfter={<Icon>star</Icon>}>{LoremString}</Item>,

	...rtlItemTests
];

const itemSmallTests = [
	// Small
	...commonItemTests,
	...rtlItemTests
];

const itemCustomStyleTests = [
	// Customized Item Style
	<Item label="label">Customized Item</Item>,
	<Item label="label" slotBefore={<Icon>star</Icon>}>Customized Item</Item>,
	<Item label="label" slotAfter={<Icon>star</Icon>}>Customized Item</Item>,
	<Item label="label" slotBefore={<Icon>star</Icon>} slotAfter={<Icon>star</Icon>}>Customized Item</Item>,

	...withConfig({focus: true}, [
		<Item>Customized Focused Item</Item>,
		<Item label='"label"' slotBefore={<Icon>star</Icon>} slotAfter={<Icon>star</Icon>}>Customized Focused Item</Item>
	])
];

const itemCommentedTests = [
	// Long text
	...longTextItemTests,
	...rtlItemTests,
	...withProps({centered: true}, itemCenteredTests),
	...withProps({size: 'small'}, itemSmallTests),
	...withProps({css: css}, itemCustomStyleTests)
];

const itemRtlTests = [
	// *************************************************************
	// locale = 'ar-SA'
	// Item Functionality RTL [QWTC-3487]
	...commonItemTests,
	...rtlItemTests,

	// Centered
	...withProps({centered: true}, pick(itemSmokeTests, 0)),

	// Small
	...withProps({size: 'small'}, pick(itemSmokeTests, 0, 4)),

	// With tall characters and disabled [QWTC-1826]
	...tallglyphItemTests
];

const itemRtlLargeTextTests = [
	...pick(itemSmokeTests, 0, 4),
	...rtlItemTests,
	...tallglyphItemTests
];

const itemTallglyphValidationTests = [
	...pick(itemSmokeTests, 0, 4),
	...tallglyphItemTests,
	...withProps({size: 'small'}, pick(itemSmokeTests, 0))
];

const itemTallglyphValidationLargeTextTests = [
	...pick(itemSmokeTests, 0, 4),
	...tallglyphItemTests,
	...withProps({size: 'small'}, pick(itemSmokeTests, 0))
];

const itemLargeTextTests = [
	...pick(itemSmokeTests, 0, 4),
	...tallglyphItemTests,
	...withProps({size: 'small'}, pick(itemSmokeTests, 0))
];

const ItemTests = [
	...itemSmokeTests,
	...itemQwtcTests,
	...itemCommentedTests,
	...withConfig({focus: true}, itemFocusTests),
	...withConfig({focus: true, wrapper: {light: true, padded: true}}, itemFocusedLightWrapperTests),
	...withConfig({textSize: 'large'}, itemLargeTextTests),
	...withConfig({locale: 'ar-SA'}, itemRtlTests),
	...withConfig({locale: 'ar-SA', textSize: 'large'}, itemRtlLargeTextTests),
	...withConfig({locale: 'vi-VN'}, itemTallglyphValidationTests),
	...withConfig({locale: 'vi-VN', textSize: 'large'}, itemTallglyphValidationLargeTextTests)
];

export default ItemTests;
