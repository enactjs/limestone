import Icon from '../../../../Icon';
import RadioItem from '../../../../RadioItem';

import {withConfig} from './utils';

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
	<RadioItem disabled>ÃÑÕÂÊÎÔÛÄËÏÖÜŸ</RadioItem>,
	// [QWTC-1855]
	<RadioItem inline>ÃÑÕÂÊÎÔÛÄËÏÖÜŸ</RadioItem>,
	// [QWTC-1855]
	<RadioItem disabled>តន្ត្រី</RadioItem>,
	// [QWTC-1855]
	<RadioItem inline>តន្ត្រី</RadioItem>,
	// [QWTC-1855]
	<RadioItem inline>ฟิ้  ไั  ஒ  து</RadioItem>,
	// [QWTC-1852]
	<RadioItem>ฟิ้  ไั  ஒ  து</RadioItem>,
	// [QWTC-1852]
	<RadioItem selected>ÃÑÕÂÊÎÔÛÄËÏÖÜŸ</RadioItem>,
	// [QWTC-1852]
	<RadioItem selected>តន្ត្រី</RadioItem>,
	// [QWTC-1852]
	<RadioItem selected>ฟิ้  ไั  ஒ  து</RadioItem>,
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

	<RadioItem selected icon="arrowup">ÃÑÕÂÊÎÔÛÄËÏÖÜŸ</RadioItem>,
	<RadioItem selected icon="arrowup">តន្ត្រី</RadioItem>,
	<RadioItem selected icon="arrowup">ฟิ้  ไั  ஒ  து</RadioItem>,
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
	<RadioItem disabled>ÃÑÕÂÊÎÔÛÄËÏÖÜŸ</RadioItem>,
	// [QWTC-1855]
	<RadioItem inline>ÃÑÕÂÊÎÔÛÄËÏÖÜŸ</RadioItem>,
	// [QWTC-1855]
	<RadioItem disabled>តន្ត្រី</RadioItem>,
	// [QWTC-1855]
	<RadioItem inline>តន្ត្រី</RadioItem>,
	// [QWTC-1855]
	<RadioItem inline>ฟิ้  ไั  ஒ  து</RadioItem>,
	// [QWTC-1852]
	<RadioItem>ฟิ้  ไั  ஒ  து</RadioItem>,
	// [QWTC-1852]
	<RadioItem selected>ÃÑÕÂÊÎÔÛÄËÏÖÜŸ</RadioItem>,
	// [QWTC-1852]
	<RadioItem selected>តន្ត្រី</RadioItem>,
	// [QWTC-1852]
	<RadioItem selected>ฟิ้  ไั  ஒ  து</RadioItem>
];

const radioItemRtlTests = [
	// RadioItem* is NOT selected - RTL [QWTC-1854]
	<RadioItem>RadioItem</RadioItem>,
	<RadioItem inline>Inline RadioItem</RadioItem>,
	<RadioItem disabled inline>RadioItem Not Checked</RadioItem>,
	// [QWTC-1851]
	<RadioItem disabled>مساء الخير</RadioItem>,
	// [QWTC-1851]
	<RadioItem inline>ÃÑÕÂÊÎÔÛÄËÏÖÜŸ</RadioItem>,
	// [QWTC-1851]
	<RadioItem inline>តន្ត្រី</RadioItem>,
	// [QWTC-1852]
	<RadioItem>ฟิ้  ไั  ஒ  து</RadioItem>,
	// [QWTC-1852]
	<RadioItem selected>ÃÑÕÂÊÎÔÛÄËÏÖÜŸ</RadioItem>,
	// [QWTC-1852]
	<RadioItem selected>តន្ត្រី</RadioItem>,
	// [QWTC-1852]
	<RadioItem selected>ฟิ้  ไั  ஒ  து</RadioItem>,
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

const radioItemCommentedTests = [
	...radioItemSlotBeforeTests
];

const RadioItemTests = [
	...radioItemSmokeTests,
	...radioItemQwtcTests,
	...radioItemCommentedTests,
	...withConfig({focus: true}, radioItemFocusTests),
	...withConfig({textSize: 'large'}, radioItemLargeTextTests),
	...withConfig({locale: 'ar-SA'}, radioItemRtlTests)
];

export default RadioItemTests;
