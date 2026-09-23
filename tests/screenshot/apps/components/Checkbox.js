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

const CheckboxTests = [
	...checkboxSmokeTests,
	...withConfig({focus: true}, checkboxSmokeTests)
];

export default CheckboxTests;
