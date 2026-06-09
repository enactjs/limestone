import TimePicker from '../../../../TimePicker';

import {withConfig} from './utils';

const defaultDate = new Date(2009, 5, 6);

const timePickerSmokeTests = [
	<TimePicker defaultValue={defaultDate} disabled />,
	<TimePicker defaultValue={defaultDate} noLabel />

];

// start of [QWTC-2102]
const timePickerQwtcTests = [
	{
		locale: 'es-ES',
		component: <TimePicker defaultValue={defaultDate} />
	},
	...withConfig({locale: 'ko-KR'}, [
		<TimePicker defaultValue={new Date(2009, 5, 7, 11)} />,
		<TimePicker defaultValue={new Date(2009, 5, 7, 13)} />
	]),
	...withConfig({locale: 'zh-HK'}, [
		<TimePicker defaultValue={new Date(2009, 5, 7, 11)} />,
		<TimePicker defaultValue={new Date(2009, 5, 7, 13)} />
	]),
	...withConfig({locale: 'am-ET'}, [
		<TimePicker defaultValue={new Date(2009, 5, 7, 9)}>AM</TimePicker>,
		<TimePicker defaultValue={new Date(2009, 5, 7, 12)}>Noon</TimePicker>,
		<TimePicker defaultValue={new Date(2009, 5, 7, 13)}>PM</TimePicker>,
		<TimePicker defaultValue={new Date(2009, 5, 7, 18)}>Evening</TimePicker>,
		<TimePicker defaultValue={new Date(2009, 5, 7, 24)}>Late Evening</TimePicker>
	])
];
// end of [QWTC-2102]

const timePickerRtlTests = [
	// RTL
	<TimePicker defaultValue={defaultDate} />,
	<TimePicker defaultValue={defaultDate} disabled />
];

const timePickerFocusTests = [
	// *************************************************************
	// focused
	// *************************************************************
	<TimePicker defaultValue={new Date(2009, 5, 7)} />,
	<TimePicker defaultValue={new Date(2009, 5, 7)} disabled />,
	<TimePicker defaultValue={new Date(2009, 5, 7)} noLabel />
];

const TimePickerTests = [
	...timePickerSmokeTests,
	...timePickerQwtcTests,
	...withConfig({locale: 'ar-SA'}, timePickerRtlTests),
	...withConfig({focus: true}, timePickerFocusTests),
	// with largeText [QWTC-2100]
	...withConfig({textSize: 'large'}, [
		<TimePicker defaultValue={new Date(2009, 5, 7)} />
	])
];

export default TimePickerTests;
