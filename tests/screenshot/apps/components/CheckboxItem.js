import Icon from '../../../../Icon';
import CheckboxItem from '../../../../CheckboxItem';

import {withConfig} from './utils';

const checkboxItemSmokeTests = [
	<CheckboxItem />,
	<CheckboxItem>CheckboxItem</CheckboxItem>,
	<CheckboxItem label="label">CheckboxItem</CheckboxItem>,
	<CheckboxItem disabled>CheckboxItem</CheckboxItem>,
	<CheckboxItem inline>CheckboxItem</CheckboxItem>,
	<CheckboxItem indeterminate>CheckboxItem</CheckboxItem>,
	<CheckboxItem indeterminate indeterminateIcon="lock">CheckboxItem</CheckboxItem>,
	<CheckboxItem icon="star" selected>Custom icon CheckboxItem</CheckboxItem>
];

// [QWTC-1861]
const checkboxItemQwtcTests = [
	<CheckboxItem selected>CheckboxItem Checked</CheckboxItem>,
	<CheckboxItem selected label="label">CheckboxItem Checked</CheckboxItem>,
	<CheckboxItem selected disabled>CheckboxItem Checked</CheckboxItem>,
	<CheckboxItem selected disabled label="label">CheckboxItem Checked</CheckboxItem>,
	<CheckboxItem selected inline>CheckboxItem Checked</CheckboxItem>,
	<CheckboxItem selected disabled inline>CheckboxItem Checked</CheckboxItem>
];

const checkboxItemFormCheckboxTests = [
	// FormCheckbox
	<CheckboxItem formCheckbox />,
	<CheckboxItem formCheckbox >CheckboxItem</CheckboxItem>, 					// not selected
	<CheckboxItem formCheckbox label="label">CheckboxItem</CheckboxItem>,
	<CheckboxItem formCheckbox disabled>CheckboxItem</CheckboxItem>,	// not selected
	<CheckboxItem formCheckbox inline>CheckboxItem</CheckboxItem>,		// not selected
	<CheckboxItem formCheckbox inline label="label">CheckboxItem</CheckboxItem>,		// not selected
	<CheckboxItem formCheckbox disabled inline>CheckboxItem</CheckboxItem>,	// not selected
	// [QWTC-1861]
	<CheckboxItem formCheckbox selected>CheckboxItem Checked</CheckboxItem>,
	<CheckboxItem formCheckbox selected label="label">CheckboxItem Checked</CheckboxItem>
];

const checkboxItemIconSlotBeforeTests = [
	// Icon slotBefore
	<CheckboxItem><Icon slot="slotBefore">home</Icon>CheckboxItem</CheckboxItem>,
	<CheckboxItem label="label"><Icon slot="slotBefore">home</Icon>CheckboxItem</CheckboxItem>,
	<CheckboxItem inline><Icon slot="slotBefore">home</Icon>CheckboxItem</CheckboxItem>,
	<CheckboxItem inline label="label"><Icon slot="slotBefore">home</Icon>CheckboxItem</CheckboxItem>,
	<CheckboxItem selected><Icon slot="slotBefore">home</Icon>CheckboxItem Checked</CheckboxItem>,
	<CheckboxItem selected inline><Icon slot="slotBefore">home</Icon>CheckboxItem Checked</CheckboxItem>,
	<CheckboxItem indeterminate><Icon slot="slotBefore">home</Icon>CheckboxItem</CheckboxItem>
];

const checkboxItemCenteredTests = [
	// Centered
	<CheckboxItem centered>Hello CheckboxItem</CheckboxItem>,
	<CheckboxItem centered label="label">Hello CheckboxItem</CheckboxItem>,
	<CheckboxItem centered>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed aliquam dapibus imperdiet. Morbi diam ex, vulputate eget luctus eu, gravida at ligula. Sed tristique eros sit amet iaculis varius. Phasellus rutrum augue id nulla consectetur, a vulputate velit dictum. Vestibulum ultrices tellus ac cursus condimentum. Aliquam sit amet consectetur nulla, viverra bibendum metus.</CheckboxItem>,
	<CheckboxItem centered label="Really looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong label to test centered CheckboxItem with label">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed aliquam dapibus imperdiet. Morbi diam ex, vulputate eget luctus eu, gravida at ligula. Sed tristique eros sit amet iaculis varius. Phasellus rutrum augue id nulla consectetur, a vulputate velit dictum. Vestibulum ultrices tellus ac cursus condimentum. Aliquam sit amet consectetur nulla, viverra bibendum metus.</CheckboxItem>
];

const checkboxItemCenteredRtlTests = [
	<CheckboxItem centered>Hello CheckboxItem</CheckboxItem>,
	<CheckboxItem centered label="label">Hello CheckboxItem</CheckboxItem>,
	<CheckboxItem centered>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed aliquam dapibus imperdiet. Morbi diam ex, vulputate eget luctus eu, gravida at ligula. Sed tristique eros sit amet iaculis varius. Phasellus rutrum augue id nulla consectetur, a vulputate velit dictum. Vestibulum ultrices tellus ac cursus condimentum. Aliquam sit amet consectetur nulla, viverra bibendum metus.</CheckboxItem>,
	<CheckboxItem centered label="Really looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong label to test centered CheckboxItem with label on RTL locale">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed aliquam dapibus imperdiet. Morbi diam ex, vulputate eget luctus eu, gravida at ligula. Sed tristique eros sit amet iaculis varius. Phasellus rutrum augue id nulla consectetur, a vulputate velit dictum. Vestibulum ultrices tellus ac cursus condimentum. Aliquam sit amet consectetur nulla, viverra bibendum metus.</CheckboxItem>
];

const checkboxItemLabelPositionTests = [
	// Label positions
	<CheckboxItem label="label" labelPosition="above">CheckboxItem</CheckboxItem>,
	<CheckboxItem label="label" labelPosition="below">CheckboxItem</CheckboxItem>,
	<CheckboxItem label="label" labelPosition="before">CheckboxItem</CheckboxItem>,
	<CheckboxItem label="label" labelPosition="after">CheckboxItem</CheckboxItem>,
	<CheckboxItem inline label="label" labelPosition="above">Inline CheckboxItem</CheckboxItem>,
	<CheckboxItem inline label="label" labelPosition="below">CheckboxItem</CheckboxItem>,
	<CheckboxItem inline label="label" labelPosition="before">CheckboxItem</CheckboxItem>,
	<CheckboxItem inline label="label" labelPosition="after">CheckboxItem</CheckboxItem>
];

const checkboxItemFocusTests = [
	// Focused
	<CheckboxItem>Hello Focused CheckboxItem</CheckboxItem>,
	<CheckboxItem selected>Hello Focused CheckboxItem</CheckboxItem>,
	// [QWTC-1861]
	<CheckboxItem selected disabled>Hello Focused CheckboxItem</CheckboxItem>,
	<CheckboxItem inline>Hello Focused CheckboxItem</CheckboxItem>,
	<CheckboxItem inline selected>Hello Focused CheckboxItem</CheckboxItem>,
	<CheckboxItem label="label"><Icon slot="slotBefore">home</Icon>Hello Focused CheckboxItem</CheckboxItem>,
	<CheckboxItem inline label="label"><Icon slot="slotBefore">home</Icon>Hello Focused Inline CheckboxItem</CheckboxItem>,
	<CheckboxItem indeterminat>Hello Focused CheckboxItem</CheckboxItem>,
	<CheckboxItem inline indeterminat>Hello Focused CheckboxItem</CheckboxItem>,

	// FormCheckbox
	<CheckboxItem formCheckbox >Focused CheckboxItem</CheckboxItem>, 					// not selected
	<CheckboxItem formCheckbox label="label">Focused CheckboxItem</CheckboxItem>,
	<CheckboxItem formCheckbox disabled>Focused CheckboxItem</CheckboxItem>,	// not selected
	<CheckboxItem formCheckbox inline>Focused CheckboxItem</CheckboxItem>,		// not selected
	<CheckboxItem formCheckbox inline label="label">Focused CheckboxItem</CheckboxItem>,		// not selected
	<CheckboxItem formCheckbox disabled inline>Focused CheckboxItem</CheckboxItem>,	// not selected
	// [QWTC-1861]
	<CheckboxItem formCheckbox selected>Focused CheckboxItem Checked</CheckboxItem>,
	<CheckboxItem formCheckbox selected label="label">Focused CheckboxItem Checked</CheckboxItem>
];

const checkboxItemLargeTextTests = [
	<CheckboxItem>Hello Focused CheckboxItem</CheckboxItem>,
	<CheckboxItem selected>Hello Focused CheckboxItem</CheckboxItem>,
	// [QWTC-1861]
	<CheckboxItem selected disabled>Hello Focused CheckboxItem</CheckboxItem>,
	<CheckboxItem inline>Hello Focused CheckboxItem</CheckboxItem>,
	<CheckboxItem inline selected>Hello Focused CheckboxItem</CheckboxItem>,
	<CheckboxItem label="label"><Icon slot="slotBefore">home</Icon>Hello Focused CheckboxItem</CheckboxItem>,
	<CheckboxItem inline label="label"><Icon slot="slotBefore">home</Icon>Hello Focused Inline CheckboxItem</CheckboxItem>,
	<CheckboxItem indeterminat>Hello Focused CheckboxItem</CheckboxItem>,
	<CheckboxItem inline indeterminat>Hello Focused CheckboxItem</CheckboxItem>
];

const checkboxItemRtlTests = [
	<CheckboxItem>CheckboxItem</CheckboxItem>,
	<CheckboxItem disabled>CheckboxItem</CheckboxItem>,
	<CheckboxItem inline>CheckboxItem</CheckboxItem>,
	<CheckboxItem selected>CheckboxItem Checked</CheckboxItem>,
	<CheckboxItem selected disabled>CheckboxItem Checked</CheckboxItem>,
	<CheckboxItem selected inline>CheckboxItem Checked</CheckboxItem>,
	<CheckboxItem indeterminate>CheckboxItem Checked</CheckboxItem>
];

const checkboxItemCommentedTests = [
	...checkboxItemFormCheckboxTests,
	...checkboxItemIconSlotBeforeTests,
	...checkboxItemCenteredTests,
	...checkboxItemLabelPositionTests
];

const CheckboxItemTests = [
	...checkboxItemSmokeTests,
	...checkboxItemQwtcTests,
	...checkboxItemCommentedTests,
	...withConfig({focus: true}, checkboxItemFocusTests),
	...withConfig({textSize: 'large'}, checkboxItemLargeTextTests),
	...withConfig({locale: 'ar-SA'}, checkboxItemRtlTests),
	...withConfig({locale: 'ar-SA'}, checkboxItemCenteredRtlTests)
];

export default CheckboxItemTests;
