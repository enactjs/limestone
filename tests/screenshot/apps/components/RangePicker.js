import RangePicker from '../../../../RangePicker';

import {withConfig} from './utils';

import css from './Picker.module.less';

// ***NOTES:***
// 'min' and 'max' are required for the image to be valid.
// 'value' is needed if we want to display a value

// For 'width', both width="medium" and width={1} are valid options:
// Example: <RangePicker min={0} max={5} value={5} width={1} />

const rangePickerSmokeTests = [
	<RangePicker min={0} max={5} />,
	<RangePicker min={-10} max={10} value={0} />,
	<RangePicker min={0} max={100} value={0} />,
	<RangePicker min={0} max={100} value={5} />,
	<RangePicker orientation="vertical" min={0} max={100} />,
	<RangePicker width="medium" min={0} max={100} value={5} />,
	<RangePicker width="large" min={0} max={100} value={5} />,
	<RangePicker orientation="vertical" min={-10} max={10} value={0} />,
	<RangePicker orientation="vertical" min={0} max={100} value={5} />,
	<RangePicker orientation="vertical" width="large" min={0} max={100} value={5} />,
	<RangePicker min={0} max={5} value={5} width={1} />,
	<RangePicker min={0} max={5} value={5} width={6} />
];

const rangePickerQwtcTests = [
	// Width: 'small' is default
	// Start of [QWTC-2142] - 'orientation' is 'horizontal' and 'width' changed to 'medium', 'large'
	<RangePicker width="medium" min={0} max={100} value={0} />,
	<RangePicker width="large" min={0} max={100} value={0} />,
	// End of [QWTC-2142]

	// 'orientation' changed to 'vertical' and 'width' changed to 'large' - [QWTC-2143]
	<RangePicker orientation="vertical" min={0} max={100} value={0} />,
	<RangePicker orientation="vertical" width="medium" min={0} max={100} value={0} />,
	<RangePicker orientation="vertical" width="large" min={0} max={100} value={0} />
	// end [QWTC-2143] test
];

const rangePickerDisabledTests = [
	// Disabled
	<RangePicker min={0} max={5} disabled />,
	<RangePicker min={-10} max={10} value={0} disabled />,
	<RangePicker min={0} max={100} disabled />,
	<RangePicker min={0} max={100} value={5} disabled />,
	<RangePicker width="medium" min={0} max={5} disabled />,
	<RangePicker orientation="vertical" min={-10} max={10} value={0} disabled />,
	<RangePicker orientation="vertical" min={0} max={100} disabled />,
	<RangePicker orientation="vertical" min={0} max={100} value={5} disabled />,
	<RangePicker orientation="vertical" width="medium" min={0} max={5} value={5} disabled />,
	<RangePicker orientation="vertical" width="large" min={0} max={5} value={5} disabled />
];

const rangePickerWrapTests = [
	// Wrap
	<RangePicker min={0} max={5} wrap />,
	<RangePicker min={0} max={5} wrap disabled />,
	<RangePicker min={0} max={5} value={0} wrap disabled />,
	<RangePicker min={0} max={5} value={0} width="medium" wrap />,
	<RangePicker min={0} max={5} value={0} width="large" wrap />,
	<RangePicker min={0} max={5} orientation="vertical" wrap />,
	<RangePicker min={0} max={5} orientation="vertical" wrap disabled />,
	<RangePicker min={0} max={5} orientation="vertical" value={0} width="medium" wrap />,
	<RangePicker min={0} max={5} orientation="vertical" value={0} width="large" wrap />
];

const rangePickerJoinedTests = [
	// 'wrap', 'joined' and 'disabled'
	<RangePicker min={0} max={5} joined />,
	<RangePicker min={0} max={5} value={0} joined />,
	<RangePicker min={0} max={5} value={5} joined />,
	<RangePicker min={0} max={5} value={0} wrap joined />,
	<RangePicker min={0} max={5} value={0} wrap joined disabled />,
	<RangePicker min={0} max={5} value={0} wrap joined width="medium" />,
	<RangePicker min={0} max={5} value={0} wrap joined width="medium" disabled />,
	<RangePicker min={0} max={5} value={0} wrap joined width="large" />,
	<RangePicker min={0} max={5} value={0} wrap joined width="large" disabled />,
	<RangePicker min={0} max={5} value={0} wrap joined width={1} />,
	<RangePicker min={0} max={5} value={0} wrap joined width={6} disabled />,
	<RangePicker min={0} max={5} orientation="vertical" joined />,
	<RangePicker min={0} max={5} orientation="vertical" value={0} wrap joined />,
	<RangePicker min={0} max={5} orientation="vertical" value={0} wrap joined disabled />,
	<RangePicker min={0} max={5} orientation="vertical" value={0} wrap joined width="medium" />,
	<RangePicker min={0} max={5} orientation="vertical" value={0} wrap joined width="medium" disabled />,
	<RangePicker min={0} max={5} value={0} orientation="vertical" wrap joined width="large" />,
	<RangePicker min={0} max={5} value={0} orientation="vertical" wrap joined width="large" disabled />,
	<RangePicker min={0} max={5} value={0} orientation="vertical" wrap joined width={1} />,
	<RangePicker min={0} max={5} value={0} orientation="vertical" wrap joined width={6} disabled />
];

const rangePickerChangedByTests = [
	// 'wrap', 'joined', 'changedBy' and 'disabled'
	<RangePicker min={0} max={5} joined changedBy="arrow" />,
	<RangePicker min={0} max={5} value={0} joined changedBy="arrow" />,
	<RangePicker min={0} max={5} value={5} joined changedBy="arrow" />,
	<RangePicker min={0} max={5} value={0} wrap joined changedBy="arrow" />,
	<RangePicker min={0} max={5} value={0} wrap joined changedBy="arrow" disabled />,
	<RangePicker min={0} max={5} value={0} wrap joined changedBy="arrow" width="medium" />,
	<RangePicker min={0} max={5} value={0} wrap joined changedBy="arrow" width="medium" disabled />,
	<RangePicker min={0} max={5} value={0} wrap joined changedBy="arrow" width="large" />,
	<RangePicker min={0} max={5} value={0} wrap joined changedBy="arrow" width="large" disabled />,
	<RangePicker min={0} max={5} value={0} wrap joined changedBy="arrow" width={1} />,
	<RangePicker min={0} max={5} value={0} wrap joined changedBy="arrow" width={6} disabled />
];

const rangePickerIconTests = [
	// Icon changed
	<RangePicker incrementIcon="forward" min={0} max={10} />,

	// A 'value' is needed for the decrementIcon to show, else decrementIcon will not show.
	<RangePicker decrementIcon="backward" min={0} max={10} value={5} />
];

const rangePickerTitleTests = [
	// title
	<RangePicker min={0} max={5} value={0} title="Title" />,
	<RangePicker min={0} max={5} value={0} inlineTitle title="Title" />,
	<RangePicker min={0} max={5} value={0} css={css} inlineTitle title="Title" />
];

const rangePickerFocusTests = [
	// *************************************************************
	// joined and focused
	// *************************************************************
	<RangePicker joined min={10} max={15} value={12} />,
	<RangePicker disabled joined min={10} max={15} value={12} />,
	<RangePicker orientation="vertical" joined min={10} max={15} value={12} />,
	<RangePicker width="medium" joined min={10} max={15} value={12} />
];

const rangePickerRtlNegativeTests = [
	<RangePicker min={-5} max={5} value={-5} width="medium" wrap />,
	<RangePicker min={-5} max={5} value={-5} width="large" wrap />,
	<RangePicker min={-5} max={5} orientation="vertical" value={-5} width="medium" wrap />,
	<RangePicker min={-5} max={5} orientation="vertical" value={-5} width="large" wrap />,
	<RangePicker min={-5} max={5} value={-5} joined changedBy="arrow" />,
	<RangePicker min={-5} max={5} orientation="vertical" value={-5} wrap joined />
];

const rangePickerRtlTests = [
	// *************************************************************
	// locale = 'ar-SA'
	// *************************************************************

	// Start of [QWTC-2142] - 'orientation' is 'horizontal' and 'width' changed to 'medium', 'large'
	<RangePicker width="medium" min={0} max={100} value={0} />,
	<RangePicker width="large" min={0} max={100} value={0} />,
	// End of [QWTC-2142]

	// Start of [QWTC-2143] - 'orientation' changed to 'vertical' and 'width' changed to 'large'
	<RangePicker orientation="vertical" min={0} max={100} value={0} />,
	<RangePicker orientation="vertical" width="large" min={0} max={100} value={0} />,
	// End of [QWTC-2143]

	...rangePickerDisabledTests,
	...rangePickerWrapTests,
	...rangePickerRtlNegativeTests,
	...rangePickerJoinedTests,
	...rangePickerChangedByTests,
	...rangePickerIconTests
];

const rangePickerLargeTextTests = [
	{
		textSize: 'large',
		component: <RangePicker orientation="vertical" width="large" min={0} max={100} value={5} />
	},
	{
		textSize: 'large',
		component: <RangePicker width="medium" min={0} max={100} value={5} disabled />
	},
	{
		textSize: 'large',
		component: <RangePicker min={0} max={5} value={0} wrap joined width="medium" />
	}
];

const rangePickerRtlFocusTests = [
	// joined and focused
	<RangePicker joined min={10} max={15} value={12} />,
	<RangePicker disabled joined min={10} max={15} value={12} />,
	<RangePicker orientation="vertical" joined min={10} max={15} value={12} />,
	<RangePicker width="medium" joined min={10} max={15} value={12} />
];

const rangePickerCommentedTests = [
	...rangePickerDisabledTests,
	...rangePickerWrapTests,
	...rangePickerJoinedTests,
	...rangePickerChangedByTests,
	...rangePickerIconTests,
	...rangePickerTitleTests
];

const RangePickerTests = [
	...rangePickerSmokeTests,
	...rangePickerQwtcTests,
	...rangePickerCommentedTests,
	...withConfig({focus: true}, rangePickerFocusTests),
	...rangePickerLargeTextTests,
	...withConfig({locale: 'ar-SA'}, rangePickerRtlTests),
	...withConfig({focus: true, locale: 'ar-SA'}, rangePickerRtlFocusTests)
];

export default RangePickerTests;
