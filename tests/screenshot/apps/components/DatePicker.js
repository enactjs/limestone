import {generateDate} from '@enact/ui-test-utils/utils';

import DatePicker from '../../../../DatePicker';

import {pick, withConfig} from './utils';

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

const datePickerRtlTests = withConfig({locale: 'ar-SA'}, pick(datePickerSmokeTests, 0, 1));

const datePickerLargeTextTests = [
	// large text [QWTC-2092]
	{
		textSize: 'large',
		component: <DatePicker defaultValue={jan31} disabled />
	}
];

const datePickerFocusTests = [
	<DatePicker defaultValue={jan30} />
];

const DatePickerTests = [
	...datePickerSmokeTests,
	...datePickerQwtcTests,
	...withConfig({focus: true}, datePickerFocusTests),
	...datePickerLargeTextTests,
	...datePickerRtlTests
];

export default DatePickerTests;
