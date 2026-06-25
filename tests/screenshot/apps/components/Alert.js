import Alert, {AlertImage}  from '../../../../Alert';
import Button from '../../../../Button';
import Checkbox from '../../../../Checkbox';
import CheckboxItem from '../../../../CheckboxItem';
import FormCheckBoxItem from '../../../../FormCheckboxItem';
import Item from '../../../../Item';
import ProgressBar from '../../../../ProgressBar';
import Scroller from '../../../../Scroller';

import img from '../../images/300x300.png';

import {withConfig, withProps, LoremString} from './utils';

import css from './Alert.module.less';

// Only type: 'fullscreen' supports title prop
const fullscreenTests = [
	<Alert open title="Title" />,
	<Alert open>Alert!</Alert>,
	<Alert open>{LoremString}</Alert>,
	<Alert open title="Loooooooooooooooooooooong title with custom width" css={css}>{LoremString}</Alert>
];

// Only type: 'overlay' supports children
const overlayTests = [
	<Alert open>Alert!</Alert>,
	<Alert open overlayPosition="bottom left">Alert!</Alert>,
	<Alert open overlayPosition="bottom right">Alert!</Alert>,
	<Alert open overlayPosition="top left">Alert!</Alert>,
	<Alert open overlayPosition="top right">Alert!</Alert>,
	<Alert open>{LoremString}</Alert>,
	<Alert open overlayPosition="bottom left">{LoremString}</Alert>,
	<Alert open overlayPosition="bottom right">{LoremString}</Alert>,
	<Alert open overlayPosition="top left">{LoremString}</Alert>,
	<Alert open overlayPosition="top right">{LoremString}</Alert>
];

// Overlay color test
const overlayColorTests = [
	<Alert open title="With Checkbox">
		<div>
			<div>This is Checkbox</div>
			<Checkbox />
		</div>
	</Alert>,
	<Alert open title="With selectedCheckbox">
		<div>
			<div>This is Selected Checkbox</div>
			<Checkbox selected />
		</div>
	</Alert>,
	<Alert open title="With disabledCheckbox">
		<div>
			<div>This is disabled Checkbox</div>
			<Checkbox disabled />
		</div>
	</Alert>,
	<Alert open title="With disabled-selected Checkbox">
		<div>
			<div>This is disabled-selected Checkbox</div>
			<Checkbox disabled selected />
		</div>
	</Alert>,
	<Alert open title="With FormCheckboxItem">
		<div>
			<div>This is FormCheckboxItem</div>
			<FormCheckBoxItem>FormCheckboxItem</FormCheckBoxItem>
		</div>
	</Alert>,
	<Alert open title="With focusedFormCheckboxItem">
		<div>
			<div>This is focused FormCheckboxItem</div>
			<FormCheckBoxItem focused>focused FormCheckboxItem</FormCheckBoxItem>
		</div>
	</Alert>,
	<Alert open title="With focused-selected FormCheckboxItem">
		<div>
			<div>This is focused-selected FormCheckboxItem</div>
			<FormCheckBoxItem focused selected>focused-selected FormCheckboxItem</FormCheckBoxItem>
		</div>
	</Alert>,
	<Alert open title="With diabledItem">
		<div>
			<div>This is disabledItem</div>
			<Item disabled>Disabled Item</Item>
		</div>
	</Alert>,
	<Alert open title="With Progressbar">
		<div>
			<div>This is ProgressBar</div>
			<ProgressBar backgroundProgress={0.5} progress={0.25} />
		</div>
	</Alert>,
	<Alert open title="With disabled Progressbar">
		<div>
			<div>This is ProgressBar</div>
			<ProgressBar backgroundProgress={0.5} progress={0.25} disabled />
		</div>
	</Alert>,
	<Alert open title="With Scroller">
		<div>
			<div>This is Scroller</div>
			<Scroller style={{height:'300px'}} verticalScrollbar="visible">
				<div style={{height:'1000px'}}>
					ScrollerTest
				</div>
			</Scroller>
		</div>
	</Alert>,
	<Alert open title="With byEnter Scroller">
		<div>
			<div>This is focusableScrollbar=byEnter Scroller</div>
			<Scroller style={{height:'300px'}} focusableScrollbar="byEnter">
				<div style={{height:'1000px'}}>
					ScrollerTest
				</div>
			</Scroller>
		</div>
	</Alert>
];

const dropIn = {
	iconImage: (
		<AlertImage
			src={img}
			type="icon"
		/>
	),
	image: (
		<AlertImage
			src={img}
			type="thumbnail"
		/>
	),
	oneButton: (
		<Button>Yes</Button>
	),
	// we need an array here rather than a fragment due to the impl of Alert that maps over the
	// array of buttons and wraps them with Cell.
	twoButtons: [
		<Button key="yes">Yes</Button>,
		<Button key="no">No</Button>
	],
	twoDisabledButton: [
		<Button key="yes" disabled>Yes</Button>,
		<Button key="no" disabled>No</Button>
	],
	oneSmallButton: (
		<Button size="small">Yes</Button>
	),
	// we need an array here rather than a fragment due to the impl of Alert that maps over the
	// array of buttons and wraps them with Cell.
	twoSmallButtons: [
		<Button key="yes" size="small">Yes</Button>,
		<Button key="no" size="small">No</Button>
	],
	twoDisabledSmallButtons: [
		<Button key="yes" disabled size="small">Yes</Button>,
		<Button key="no" disabled size="small">No</Button>
	],
	threeSmallButtons: [
		<Button key="yes" size="small">Yes</Button>,
		<Button key="no" size="small">No</Button>,
		<Button key="later" size="small">Later</Button>
	],
	fourSmallButtons: [
		<Button key="one" size="small">One</Button>,
		<Button key="two" size="small">Two</Button>,
		<Button key="three" size="small">Three</Button>,
		<Button key="four" size="small">Four</Button>
	]
};

const alertSmokeTests = [
	...withProps({type: 'fullscreen'}, fullscreenTests.slice(0, 2)),
	...withProps({type: 'overlay'}, overlayTests.slice(0, 3)),
	...withProps({type: 'fullscreen', buttons: dropIn.oneButton}, [fullscreenTests[0]]),
	...withProps({type: 'fullscreen', buttons: dropIn.twoButtons}, [fullscreenTests[0]]),
	...withProps({type: 'overlay', buttons: dropIn.twoSmallButtons}, [overlayTests[0]]),
	...withProps({type: 'overlay', buttonDirection: 'auto', buttons: dropIn.threeSmallButtons}, [overlayTests[0]]),
	...withProps({type: 'overlay', buttonDirection: 'horizontal', buttons: dropIn.fourSmallButtons}, [overlayTests[0]]),
	...withProps({type: 'overlay', buttonDirection: 'vertical', buttons: dropIn.twoSmallButtons}, [overlayTests[0]]),
	...withProps({type: 'fullscreen', buttons: dropIn.oneButton, image: dropIn.image}, [fullscreenTests[0]]),
	...withProps({type: 'overlay', buttons: dropIn.twoSmallButtons, image: dropIn.image}, [overlayTests[0]])
];

// QWTC-documented scenarios (kept explicitly for Jira traceability).
const alertQwtcTests = [
	// QWTC-1928 start.
	...withProps({type: 'fullscreen', image: dropIn.iconImage}, [fullscreenTests[0]]),
	...withProps({type: 'fullscreen', image: dropIn.image}, [fullscreenTests[0]]),
	// QWTC-1928 end.
	// QWTC-1929 start.
	...withProps({type: 'overlay', image: dropIn.iconImage}, [overlayTests[0]]),
	...withProps({type: 'overlay', image: dropIn.image}, [overlayTests[0]]),
	// QWTC-1929 end.
	// QWTC-2603
	...withProps({type: 'overlay'}, [
		<Alert open title="With different types of Components">
			<AlertImage
				src={img}
				type="icon"
			/>
			<Button size="small">Yes</Button>
			<Button size="small">No</Button>
			<div>
				<div>This is progressbar</div>
				<ProgressBar progress={0.5} />
			</div>
			<div>
				<CheckboxItem>This is CheckboxItem</CheckboxItem>
				<CheckboxItem selected>This is Selected CheckboxItem</CheckboxItem>
			</div>
			<div>
				<Scroller style={{height:'300px'}} focusableScrollbar="byEnter">
					<div style={{height:'1000px'}}>
						{LoremString}
					</div>
				</Scroller>
			</div>
		</Alert>
	])
];

const alertInitialTests = [
	// Initial
	...withProps({type: 'fullscreen'}, fullscreenTests),
	...withProps({type: 'overlay'}, overlayTests)
];

const alertWithButtonsTests = [
	// With Buttons
	...withProps({type: 'fullscreen', buttons: dropIn.oneButton}, fullscreenTests),
	...withProps({type: 'fullscreen', buttons: dropIn.twoButtons}, fullscreenTests),
	...withProps({type: 'fullscreen', buttons: dropIn.twoDisabledButton}, fullscreenTests),
	...withProps({type: 'overlay', buttons: dropIn.oneSmallButton}, overlayTests),
	...withProps({type: 'overlay', buttons: dropIn.twoSmallButtons}, overlayTests),
	...withProps({type: 'overlay', buttons: dropIn.twoDisabledSmallButtons}, overlayTests),
	...withProps({type: 'overlay', buttonDirection: 'auto', buttons: dropIn.twoSmallButtons}, overlayTests),
	...withProps({type: 'overlay', buttonDirection: 'auto', buttons: dropIn.threeSmallButtons}, overlayTests),
	...withProps({type: 'overlay', buttonDirection: 'auto', buttons: dropIn.fourSmallButtons}, overlayTests),
	...withProps({type: 'overlay', buttonDirection: 'horizontal', buttons: dropIn.twoSmallButtons}, overlayTests),
	...withProps({type: 'overlay', buttonDirection: 'horizontal', buttons: dropIn.threeSmallButtons}, overlayTests),
	...withProps({type: 'overlay', buttonDirection: 'horizontal', buttons: dropIn.fourSmallButtons}, overlayTests),
	...withProps({type: 'overlay', buttonDirection: 'vertical', buttons: dropIn.twoSmallButtons}, overlayTests)
];

const alertWithImageTests = [
	// With image
	// QWTC-1928 start.
	...withProps({type: 'fullscreen', image: dropIn.iconImage}, fullscreenTests),
	...withProps({type: 'fullscreen', image: dropIn.image}, fullscreenTests),
	// QWTC-1928 end.
	// QWTC-1929 start.
	...withProps({type: 'overlay', image: dropIn.iconImage}, overlayTests),
	...withProps({type: 'overlay', image: dropIn.image}, overlayTests),
	// QWTC-1929 end.

	// With image and button
	...withProps({type: 'fullscreen', buttons: dropIn.oneButton, image: dropIn.image}, fullscreenTests),
	...withProps({type: 'fullscreen', buttons: dropIn.twoButtons, image: dropIn.image}, fullscreenTests),
	...withProps({type: 'overlay', buttons: dropIn.oneSmallButton, image: dropIn.image}, overlayTests),
	...withProps({type: 'overlay', buttons: dropIn.twoSmallButtons, image: dropIn.image}, overlayTests)
];

const alertWithComponentsTests = [
	// With other components
	...withProps({type: 'overlay'}, overlayColorTests),
	...withProps({type: 'fullscreen'}, overlayColorTests)
];

const alertRtlTests = [
	...withProps({type: 'fullscreen'}, fullscreenTests.slice(0, 2)),
	...withProps({type: 'overlay'}, overlayTests.slice(0, 3)),
	...withProps({type: 'overlay', buttons: dropIn.twoSmallButtons}, [overlayTests[0]]),
	...withProps({type: 'fullscreen', buttons: dropIn.oneButton, image: dropIn.image}, [fullscreenTests[0]])
];

const alertCommentedTests = [
	...alertInitialTests,
	...alertWithButtonsTests,
	...alertWithImageTests,
	...alertWithComponentsTests
];

const AlertTests = [
	...alertSmokeTests,
	...alertQwtcTests,
	...alertCommentedTests,
	...withConfig({locale: 'vi-VN'}, alertRtlTests.slice(0, 2)),
	...withConfig({locale: 'ar-SA'}, alertRtlTests)
];

export default AlertTests;
