import Button from '../../../../Button';
import Input from '../../../../Input';
import Item from '../../../../Item';

import {withConfig, withProps} from './utils';

const LoremString = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ac tellus in velit ornare commodo. Nam dignissim fringilla nulla, sit amet hendrerit sapien laoreet quis.";

const inputSmokeTests = [
	<Input />,
	<Input open title="Input Test" subtitle="Additional text" />,
	<Input open title="Input Test" subtitle="Additional text" noBackButton />,
	<Input open title="Input Test" subtitle="Additional text" placeholder="placeholder" />,
	<Input open title="Input Test" subtitle="Additional text" value="value" />,
	<Input open title="Input Test" subtitle="Additional text" invalid invalidMessage="This is a bad value" />,
	<Input open title={LoremString} subtitle={LoremString} value={LoremString} />,
	<Input open title="Input Test" subtitle="Additional text" value="value" type="password" />,
	<Input open title="Input Test" subtitle="Additional text" value="1234" type="number" />,
	<Input open title="Input Test" subtitle="Additional text" value="1234" type="passwordnumber" />,
	<Input open title="Input Test" subtitle="Additional text" value="https://enactjs.com" type="url" />,
	<Input open title="Input Test" subtitle="Additional text" value="1234" type="number" length={10} />,
	<Input open title="Input Test" subtitle="Input with content">
		<Item>Item content</Item>
	</Input>,
	<Input open title="Input Test" subtitle="Input with content and buttons">
		<Item>Item content</Item>
		<buttons>
			<Button>Button text</Button>
		</buttons>
	</Input>,
	<Input open title="Input Test" subtitle="Input with buttons">
		<buttons>
			<Button>Button text 1</Button>
		</buttons>
	</Input>
];

const overlayTestsNoTitleNoSubtitle = [
	<Input open />,
	<Input open title="Input Test" />,
	<Input open subtitle="Additional text" />
];

const inputLargeTests = [
	// Large input
	...withProps({size: 'large'}, inputSmokeTests)
];

const inputDisabledTests = [
	// Disabled tests
	...withProps({disabled: true, popupType: 'fullscreen'}, inputSmokeTests),
	...withProps({disabled: true, popupType: 'overlay'}, inputSmokeTests),
	...withProps({disabled: true, popupType: 'overlay'}, overlayTestsNoTitleNoSubtitle)
];

const inputRtlLargeTests = [
	// RTL large input — smoke representatives
	...withProps({size: 'large'}, [
		inputSmokeTests[0],
		inputSmokeTests[1],
		inputSmokeTests[4]
	])
];

const inputRtlOverlayTests = [
	// RTL overlay number input tests — smoke representatives
	...withProps({popupType: 'overlay'}, [
		inputSmokeTests[5],
		inputSmokeTests[10]
	]),
	...withProps({popupType: 'overlay'}, [overlayTestsNoTitleNoSubtitle[0]])
];

const inputLargeTextTests = [
	// Large text mode — smoke representatives
	...withProps({popupType: 'fullscreen'}, [
		inputSmokeTests[0],
		inputSmokeTests[1]
	]),
	...withProps({popupType: 'overlay'}, [
		inputSmokeTests[0],
		inputSmokeTests[1]
	]),
	...withProps({popupType: 'overlay'}, [overlayTestsNoTitleNoSubtitle[0]])
];

const inputCommentedTests = [
	...inputLargeTests,
	...inputDisabledTests
];

const InputTests = [
	...inputSmokeTests,
	...inputCommentedTests,
	...withProps({popupType: 'overlay'}, inputSmokeTests),
	...withConfig({locale: 'ar-SA'}, inputRtlLargeTests),
	...withConfig({locale: 'ar-SA'}, inputRtlOverlayTests),
	...withConfig({textSize: 'large'}, inputLargeTextTests)
];

export default InputTests;
