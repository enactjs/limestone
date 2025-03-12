import Radio from '../../../../Radio';

import {withConfig} from './utils';

const RadioTests = [
	<Radio />,
	<Radio selected />,
	<Radio selected disabled />,
	<Radio selected>star</Radio>,

	// Focused
	...withConfig({focus: true}, [
		<Radio>home</Radio>,
		<Radio selected>home</Radio>
	])
];

export default RadioTests;
