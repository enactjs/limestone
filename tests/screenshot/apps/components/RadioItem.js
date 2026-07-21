import Icon from '../../../../Icon';
import RadioItem from '../../../../RadioItem';

import {withConfig, withTallglyphLocale, TallglyphKhmer, TallglyphLatin, TallglyphMultiScript} from './utils';

const radioItemSmokeTests = [
	<RadioItem>RadioItem</RadioItem>,
	<RadioItem disabled>RadioItem</RadioItem>,
	<RadioItem inline>Inline RadioItem</RadioItem>,
	<RadioItem disabled inline>RadioItem Not Checked</RadioItem>,
	<RadioItem selected>RadioItem Checked</RadioItem>

];

const radioItemQwtcTests = [
	// [QWTC-1851]
	<RadioItem disabled>مساء الخير</RadioItem>,
	// [QWTC-1851]
	<RadioItem inline>مساء الخير</RadioItem>,
	// [QWTC-1855]
	<RadioItem disabled>{TallglyphLatin}</RadioItem>,
	// [QWTC-1855]
	<RadioItem inline>{TallglyphLatin}</RadioItem>,
	// [QWTC-1855]
	<RadioItem disabled>{TallglyphKhmer}</RadioItem>,
	// [QWTC-1855]
	<RadioItem inline>{TallglyphKhmer}</RadioItem>,
	// [QWTC-1855]
	<RadioItem inline>{TallglyphMultiScript}</RadioItem>,
	// [QWTC-1852]
	<RadioItem>{TallglyphMultiScript}</RadioItem>,
	// [QWTC-1852]
	<RadioItem selected>{TallglyphLatin}</RadioItem>,
	// [QWTC-1852]
	<RadioItem selected>{TallglyphKhmer}</RadioItem>,
	// [QWTC-1852]
	<RadioItem selected>{TallglyphMultiScript}</RadioItem>,
	// Selected - disabled
	// [QWTC-1843]
	<RadioItem selected disabled>RadioItem Checked</RadioItem>,
	// Selected - disabled - inline
	<RadioItem selected disabled inline>RadioItem Checked</RadioItem>,
	// Selected - inline
	// [QWTC-1844]
	<RadioItem selected inline>RadioItem Checked</RadioItem>,
	// Long text selected - LTR [QWTC-1849]
	<RadioItem selected>-Lorem</RadioItem>,

	<RadioItem selected icon="arrowup">{TallglyphLatin}</RadioItem>,
	<RadioItem selected icon="arrowup">{TallglyphKhmer}</RadioItem>,
	<RadioItem selected icon="arrowup">{TallglyphMultiScript}</RadioItem>,
	// Selected - disabled
	<RadioItem selected disabled icon="arrowup">RadioItem Checked</RadioItem>,
	// Selected - disabled - inline
	<RadioItem selected disabled inline icon="arrowup">RadioItem Checked</RadioItem>,
	// Selected - inline
	<RadioItem selected inline icon="arrowup">RadioItem Checked</RadioItem>,
	<RadioItem selected icon="arrowup">RadioItem Checked</RadioItem>,
	// Long text selected - LTR
	<RadioItem selected icon="arrowup">-Lorem</RadioItem>
];

const radioItemSlotBeforeTests = [
	// Icon slotBefore
	<RadioItem><Icon slot="slotBefore">home</Icon>RadioItem</RadioItem>,
	<RadioItem inline><Icon slot="slotBefore">home</Icon>RadioItem</RadioItem>,
	<RadioItem selected><Icon slot="slotBefore">home</Icon>RadioItem Checked</RadioItem>,
	<RadioItem selected inline><Icon slot="slotBefore">home</Icon>RadioItem Checked</RadioItem>
];

const radioItemFocusTests = [
	// Focused — smoke representatives
	<RadioItem>Focused RadioItem</RadioItem>,
	// [QWTC-2231]
	<RadioItem disabled>Focused RadioItem</RadioItem>,
	<RadioItem inline>Focused Inline RadioItem</RadioItem>,
	<RadioItem selected>Focused RadioItem Checked</RadioItem>,
	<RadioItem><Icon slot="slotBefore">home</Icon>Focused RadioItem</RadioItem>
];

const radioItemLargeTextTests = [
	// [QWTC-2231]
	<RadioItem disabled>Focused RadioItem</RadioItem>,
	<RadioItem selected disabled icon="arrowup">Focused RadioItem Checked</RadioItem>,
	<RadioItem selected disabled inline icon="arrowup">Focused RadioItem Checked</RadioItem>,
	<RadioItem selected inline icon="arrowup">Focused RadioItem Checked</RadioItem>,
	<RadioItem selected icon="arrowup">Focused RadioItem Checked</RadioItem>,
	// Icon slotBefore
	<RadioItem><Icon slot="slotBefore">home</Icon>Focused RadioItem</RadioItem>,
	<RadioItem inline><Icon slot="slotBefore">home</Icon>Focused RadioItem</RadioItem>,
	<RadioItem selected><Icon slot="slotBefore">home</Icon>Focused RadioItem Checked</RadioItem>,
	<RadioItem selected inline><Icon slot="slotBefore">home</Icon>Focused RadioItem Checked</RadioItem>,
	// [QWTC-1851]
	<RadioItem disabled>مساء الخير</RadioItem>,
	// [QWTC-1851]
	<RadioItem inline>مساء الخير</RadioItem>,
	// [QWTC-1855]
	<RadioItem disabled>{TallglyphLatin}</RadioItem>,
	// [QWTC-1855]
	<RadioItem inline>{TallglyphLatin}</RadioItem>,
	// [QWTC-1855]
	<RadioItem disabled>{TallglyphKhmer}</RadioItem>,
	// [QWTC-1855]
	<RadioItem inline>{TallglyphKhmer}</RadioItem>,
	// [QWTC-1855]
	<RadioItem inline>{TallglyphMultiScript}</RadioItem>,
	// [QWTC-1852]
	<RadioItem>{TallglyphMultiScript}</RadioItem>,
	// [QWTC-1852]
	<RadioItem selected>{TallglyphLatin}</RadioItem>,
	// [QWTC-1852]
	<RadioItem selected>{TallglyphKhmer}</RadioItem>,
	// [QWTC-1852]
	<RadioItem selected>{TallglyphMultiScript}</RadioItem>
];

const radioItemRtlTests = [
	// RadioItem* is NOT selected - RTL [QWTC-1854]
	<RadioItem>RadioItem</RadioItem>,
	<RadioItem inline>Inline RadioItem</RadioItem>,
	<RadioItem disabled inline>RadioItem Not Checked</RadioItem>,
	// [QWTC-1851]
	<RadioItem disabled>مساء الخير</RadioItem>,
	// [QWTC-1851]
	<RadioItem inline>{TallglyphLatin}</RadioItem>,
	// [QWTC-1851]
	<RadioItem inline>{TallglyphKhmer}</RadioItem>,
	// [QWTC-1852]
	<RadioItem>{TallglyphMultiScript}</RadioItem>,
	// [QWTC-1852]
	<RadioItem selected>{TallglyphLatin}</RadioItem>,
	// [QWTC-1852]
	<RadioItem selected>{TallglyphKhmer}</RadioItem>,
	// [QWTC-1852]
	<RadioItem selected>{TallglyphMultiScript}</RadioItem>,
	// RadioItem* is selected - RTL [QWTC-1854]
	<RadioItem selected>RadioItem Checked</RadioItem>,
	// Selected - disabled
	// [QWTC-1843]
	<RadioItem selected disabled>RadioItem Checked</RadioItem>,
	// Selected - inline
	// [QWTC-1844]
	<RadioItem selected inline>RadioItem Checked</RadioItem>,
	// Long text selected - LTR [QWTC-1849]
	<RadioItem selected>-Lorem</RadioItem>,

	// custom icon RTL — smoke representatives
	<RadioItem selected icon="arrowup">RadioItem Checked</RadioItem>,
	<RadioItem selected icon="arrowup">-Lorem</RadioItem>
];

const radioItemExtendedTests = [
	...radioItemSlotBeforeTests
];

const radioItemTallglyphTests = [
	<RadioItem>{TallglyphMultiScript}</RadioItem>,
	<RadioItem selected>{TallglyphLatin}</RadioItem>
];

const RadioItemTests = [
	...radioItemSmokeTests,
	...radioItemQwtcTests,
	...radioItemExtendedTests,
	...withConfig({focus: true}, radioItemSmokeTests),
	...withConfig({textSize: 'large'}, radioItemLargeTextTests),
	...withConfig({locale: 'ar-SA'}, radioItemRtlTests),
	...withTallglyphLocale(radioItemTallglyphTests)
];

export default RadioItemTests;
