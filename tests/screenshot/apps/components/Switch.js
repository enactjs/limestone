import Switch from '../../../../Switch';
import {withConfig} from "./utils";

const switchSmokeTests = [
	<Switch />,
	<Switch selected />,
	<Switch disabled />,
	<Switch disabled selected />
];

const SwitchTests = [
	...switchSmokeTests,
	...withConfig({textSize: 'large'}, [
		<Switch />,
		<Switch selected />,
		<Switch disabled />,
		<Switch disabled selected />
	])
];
export default SwitchTests;
