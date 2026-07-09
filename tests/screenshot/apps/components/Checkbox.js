import Checkbox from '../../../../Checkbox';

import {withConfig} from './utils';

const checkboxSmokeTests = [
	<Checkbox />,
	<Checkbox selected />,
	<Checkbox>star</Checkbox>,
	<Checkbox selected disabled />,
	<Checkbox selected>star</Checkbox>,
	<Checkbox indeterminate />,
	<Checkbox indeterminate indeterminateIcon="star" />,
	<Checkbox indeterminate disabled />
];

const checkboxFocusTests = [
	// Focused
	<Checkbox>home</Checkbox>,
	<Checkbox selected>home</Checkbox>,
	<Checkbox indeterminate indeterminateIcon="home" />
];

const CheckboxTests = [
	...checkboxSmokeTests,
	...withConfig({focus: true}, checkboxFocusTests)
];

export default CheckboxTests;
