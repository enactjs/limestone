import ProgressButton from '../../../../ProgressButton';

import {withConfig} from './utils';

const progressButtonSmokeTests = [
	<ProgressButton>Update</ProgressButton>,
	<ProgressButton disabled>Update</ProgressButton>,
	<ProgressButton showProgress progress={0.5}>Update</ProgressButton>,
	<ProgressButton icon="pause" showProgress progress={0.5}>Update</ProgressButton>,
	<ProgressButton color="red">Update</ProgressButton>,
	<ProgressButton color="green" minWidth={false}>Update</ProgressButton>

];

const progressButtonSizeLargeTests = [
	// size large
	<ProgressButton size="large" />,
	<ProgressButton size="large" >Update</ProgressButton>,
	<ProgressButton size="large" disabled>Update</ProgressButton>,
	<ProgressButton size="large" showProgress progress={0.5} />,
	<ProgressButton size="large" icon="pause" showProgress progress={0.5} />,
	<ProgressButton size="large" showProgress progress={0.5}>Update</ProgressButton>,
	<ProgressButton size="large" icon="pause" showProgress progress={0.5}>Update</ProgressButton>,
	<ProgressButton size="large" color="red" />,
	<ProgressButton size="large" color="green" />,
	<ProgressButton size="large" color="yellow" />,
	<ProgressButton size="large" color="blue" />,
	<ProgressButton size="large" color="red">Update</ProgressButton>,
	<ProgressButton size="large" color="green">Update</ProgressButton>,
	<ProgressButton size="large" color="yellow">Update</ProgressButton>,
	<ProgressButton size="large" color="blue">Update</ProgressButton>,
	<ProgressButton size="large" color="red" minWidth={false}>Update</ProgressButton>,
	<ProgressButton size="large" color="green" minWidth={false}>Update</ProgressButton>,
	<ProgressButton size="large" color="yellow" minWidth={false}>Update</ProgressButton>,
	<ProgressButton size="large" color="blue" minWidth={false}>Update</ProgressButton>
];

const progressButtonOpaqueTests = [
	// backgroundOpacity opaque
	<ProgressButton backgroundOpacity="opaque">Update</ProgressButton>,
	<ProgressButton backgroundOpacity="opaque" disabled>Update</ProgressButton>,
	<ProgressButton backgroundOpacity="opaque" showProgress progress={0.5} />,
	<ProgressButton backgroundOpacity="opaque" showProgress progress={0.5}>Update</ProgressButton>,
	<ProgressButton backgroundOpacity="opaque" icon="pause" showProgress progress={0.5}>Update</ProgressButton>,
	<ProgressButton backgroundOpacity="opaque" color="red" />,
	<ProgressButton backgroundOpacity="opaque" color="green" />,
	<ProgressButton backgroundOpacity="opaque" color="yellow" />,
	<ProgressButton backgroundOpacity="opaque" color="blue" />,
	<ProgressButton backgroundOpacity="opaque" color="red" minWidth={false}>Update</ProgressButton>,
	<ProgressButton backgroundOpacity="opaque" color="green" minWidth={false}>Update</ProgressButton>,
	<ProgressButton backgroundOpacity="opaque" color="yellow" minWidth={false}>Update</ProgressButton>,
	<ProgressButton backgroundOpacity="opaque" color="blue" minWidth={false}>Update</ProgressButton>,
	<ProgressButton backgroundOpacity="opaque" color="red">Update</ProgressButton>,
	<ProgressButton backgroundOpacity="opaque" color="green">Update</ProgressButton>,
	<ProgressButton backgroundOpacity="opaque" color="yellow">Update</ProgressButton>,
	<ProgressButton backgroundOpacity="opaque" color="blue">Update</ProgressButton>,
	<ProgressButton backgroundOpacity="opaque" color="red" minWidth={false}>Update</ProgressButton>,
	<ProgressButton backgroundOpacity="opaque" color="green" minWidth={false}>Update</ProgressButton>,
	<ProgressButton backgroundOpacity="opaque" color="yellow" minWidth={false}>Update</ProgressButton>,
	<ProgressButton backgroundOpacity="opaque" color="blue" minWidth={false}>Update</ProgressButton>
];

const progressButtonTransparentTests = [
	// backgroundOpacity transparent
	<ProgressButton backgroundOpacity="transparent">Update</ProgressButton>,
	<ProgressButton backgroundOpacity="transparent" disabled>Update</ProgressButton>,
	<ProgressButton backgroundOpacity="transparent" showProgress progress={0.5} />,
	<ProgressButton backgroundOpacity="transparent" showProgress progress={0.5}>Update</ProgressButton>,
	<ProgressButton backgroundOpacity="transparent" icon="pause" showProgress progress={0.5}>Update</ProgressButton>,
	<ProgressButton backgroundOpacity="transparent" color="red" />,
	<ProgressButton backgroundOpacity="transparent" color="green" />,
	<ProgressButton backgroundOpacity="transparent" color="yellow" />,
	<ProgressButton backgroundOpacity="transparent" color="blue" />,
	<ProgressButton backgroundOpacity="transparent" color="red" minWidth={false}>Update</ProgressButton>,
	<ProgressButton backgroundOpacity="transparent" color="green" minWidth={false}>Update</ProgressButton>,
	<ProgressButton backgroundOpacity="transparent" color="yellow" minWidth={false}>Update</ProgressButton>,
	<ProgressButton backgroundOpacity="transparent" color="blue" minWidth={false}>Update</ProgressButton>,
	<ProgressButton backgroundOpacity="transparent" color="red">Update</ProgressButton>,
	<ProgressButton backgroundOpacity="transparent" color="green">Update</ProgressButton>,
	<ProgressButton backgroundOpacity="transparent" color="yellow">Update</ProgressButton>,
	<ProgressButton backgroundOpacity="transparent" color="blue">Update</ProgressButton>,
	<ProgressButton backgroundOpacity="transparent" color="red" minWidth={false}>Update</ProgressButton>,
	<ProgressButton backgroundOpacity="transparent" color="green" minWidth={false}>Update</ProgressButton>,
	<ProgressButton backgroundOpacity="transparent" color="yellow" minWidth={false}>Update</ProgressButton>,
	<ProgressButton backgroundOpacity="transparent" color="blue" minWidth={false}>Update</ProgressButton>
];

const progressButtonRtlTests = [
	<ProgressButton showProgress progress={0.5}>Update</ProgressButton>,
	<ProgressButton color="red">Update</ProgressButton>,
	<ProgressButton size="large" showProgress progress={0.5}>Update</ProgressButton>
];

const progressButtonFocusTests = [
	<ProgressButton>Focused Update</ProgressButton>,
	<ProgressButton disabled>Focused Update</ProgressButton>,
	<ProgressButton showProgress progress={0.5}>Focused Update</ProgressButton>,
	<ProgressButton color="red">Focused Update</ProgressButton>,
	<ProgressButton size="large" showProgress progress={0.5}>Focused Update</ProgressButton>
];

const progressButtonCommentedTests = [
	...progressButtonSizeLargeTests,
	...progressButtonOpaqueTests,
	...progressButtonTransparentTests
];

const ProgressButtonTests = [
	...progressButtonSmokeTests,
	...progressButtonCommentedTests,
	...withConfig({focus: true}, progressButtonFocusTests),
	...withConfig({locale: 'ar-SA'}, progressButtonRtlTests)
];

export default ProgressButtonTests;
