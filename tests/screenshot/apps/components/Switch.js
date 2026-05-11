import Switch from '../../../../Switch';
import {withConfig} from "./utils";

const SwitchTests = [
	<Switch />,
	<Switch selected />,
	<Switch disabled />,
	<Switch disabled selected />,
	...withConfig({textSize: 'large'}, [
		<Switch />,
		<Switch selected />,
		<Switch disabled />,
		<Switch disabled selected />
	])
];
export default SwitchTests;
