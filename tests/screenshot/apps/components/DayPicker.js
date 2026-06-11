import DayPicker from '../../../../DayPicker';

import {withConfig} from './utils';

const dayPickerSmokeTests = [
	<DayPicker />,
	<DayPicker selected={1} />,
	<DayPicker disabled />,
	<DayPicker disabled selected={1} />
];

const dayPickerRtlTests = [
	// *************************************************************
	// locale = 'ar-SA', [QWTC-2428]
	{
		locale: 'ar-SA',
		component: <DayPicker />
	},
	{
		locale: 'ar-SA',
		component: <DayPicker selected={1} />
	},
	{
		locale: 'ar-SA',
		component: <DayPicker disabled />
	},
	{
		locale: 'ar-SA',
		component: <DayPicker disabled selected={1} />
	},
	// [QWTC-2402]
	{
		locale: 'ar-SA',
		component: <DayPicker disabled selected={[0, 1, 2, 3, 4, 5, 6]} />
	}
];

const dayPickerQwtcTests = [
	// *************************************************************
	// locale = 'es-ES', [QWTC-637]
	{
		locale: 'es-ES',
		component: <DayPicker />
	},
	{
		locale: 'es-ES',
		component: <DayPicker selected={1} />
	},
	{
		locale: 'es-ES',
		component: <DayPicker disabled />
	},
	{
		locale: 'es-ES',
		component: <DayPicker disabled selected={1} />
	}
];

const dayPickerFocusTests = [
	<DayPicker selected={2} />
];

const DayPickerTests = [
	...dayPickerSmokeTests,
	...dayPickerQwtcTests,
	...dayPickerRtlTests,
	...withConfig({focus: true}, dayPickerFocusTests)
];

export default DayPickerTests;
