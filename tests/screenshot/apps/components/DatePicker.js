import {generateDate} from '@enact/ui-test-utils/utils';

import DatePicker from '../../../../DatePicker';

import {withConfig} from './utils';

const jan30 = generateDate('2019-01-30');
const jan31 = generateDate('2019-01-31');
const maxYear = generateDate('2099-01-30');
const minYear = generateDate('1900-01-30');

const datePickerSmokeTests = [
	<DatePicker defaultValue={jan31} />,
	<DatePicker defaultValue={jan31} disabled />,
	<DatePicker defaultValue={jan31} noLabel />
];

const datePickerQwtcTests = [
	// with max/min value [QWTC-2094]
	<DatePicker defaultValue={maxYear} noLabel />,
	<DatePicker defaultValue={minYear} noLabel />
];

const datePickerRtlTests = [
	// *************************************************************
	// locale = 'ar-SA'
	// *************************************************************
	{
		locale: 'ar-SA',
		component: <DatePicker defaultValue={jan31} />
	},
	{
		locale: 'ar-SA',
		component: <DatePicker defaultValue={jan31} disabled />
	}
];

const datePickerLargeTextTests = [
	// large text [QWTC-2092]
	{
		textSize: 'large',
		component: <DatePicker defaultValue={jan31} disabled />
	}
];

const datePickerFocusTests = [
	// *************************************************************
	// focused
	// *************************************************************
	<DatePicker defaultValue={jan30} />,
	<DatePicker defaultValue={jan30} disabled />,
	<DatePicker defaultValue={jan30} noLabel />
];

const DatePickerTests = [
	...datePickerSmokeTests,
	...datePickerQwtcTests,
	...withConfig({focus: true}, datePickerFocusTests),
	...datePickerLargeTextTests,
	...datePickerRtlTests
];

export default DatePickerTests;
