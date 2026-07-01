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
	<Alert open size="small">Alert!</Alert>,
	<Alert open size="medium">Alert!</Alert>,
	<Alert open size="large">Alert!</Alert>,
	<Alert open size="large" title="Title">Alert!</Alert>,
	<Alert open overlayPosition="bottom left">Alert!</Alert>,
	<Alert open overlayPosition="bottom right">Alert!</Alert>,
	<Alert open overlayPosition="top left">Alert!</Alert>,
	<Alert open overlayPosition="top right">Alert!</Alert>,
	<Alert open>{LoremString}</Alert>,
	<Alert open size="small">{LoremString}</Alert>,
	<Alert open size="medium">{LoremString}</Alert>,
	<Alert open size="large">{LoremString}</Alert>,
	<Alert open size="large" title="Title">{LoremString}</Alert>,
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

// QWTC-2603 is unique to this group. The former smoke representatives and QWTC-1928/1929
// cases are already covered by alertExtendedTests below (the full matrix is run, and
// alertWithImageTests carries the same QWTC-1928/1929 Jira markers).
const alertQwtcTests = [
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

const fullscreenBase = [fullscreenTests[0]];   // title
const overlayBase = [overlayTests[0]];         // "Alert!"
const overlaySizes = overlayTests.slice(0, 4); // all sizes: default / small / medium / large

const alertWithButtonsTests = [
	// With Buttons: overlay configs are tested across all sizes (overlaySizes);
	// fullscreen has no size variants, so it uses a single base.
	...withProps({type: 'fullscreen', buttons: dropIn.oneButton}, fullscreenBase),
	...withProps({type: 'fullscreen', buttons: dropIn.twoButtons}, fullscreenBase),
	...withProps({type: 'fullscreen', buttons: dropIn.twoDisabledButton}, fullscreenBase),
	...withProps({type: 'overlay', buttons: dropIn.oneSmallButton}, overlaySizes),
	...withProps({type: 'overlay', buttons: dropIn.twoSmallButtons}, overlaySizes),
	...withProps({type: 'overlay', buttons: dropIn.twoDisabledSmallButtons}, overlaySizes),
	...withProps({type: 'overlay', buttonDirection: 'auto', buttons: dropIn.twoSmallButtons}, overlaySizes),
	...withProps({type: 'overlay', buttonDirection: 'auto', buttons: dropIn.threeSmallButtons}, overlaySizes),
	...withProps({type: 'overlay', buttonDirection: 'auto', buttons: dropIn.fourSmallButtons}, overlaySizes),
	...withProps({type: 'overlay', buttonDirection: 'horizontal', buttons: dropIn.twoSmallButtons}, overlaySizes),
	...withProps({type: 'overlay', buttonDirection: 'horizontal', buttons: dropIn.threeSmallButtons}, overlaySizes),
	...withProps({type: 'overlay', buttonDirection: 'horizontal', buttons: dropIn.fourSmallButtons}, overlaySizes),
	...withProps({type: 'overlay', buttonDirection: 'vertical', buttons: dropIn.twoSmallButtons}, overlaySizes)
];

const alertWithImageTests = [
	// With image: overlay configs are tested across all sizes (overlaySizes);
	// fullscreen has no size variants, so it uses a single base.
	// QWTC-1928 start.
	...withProps({type: 'fullscreen', image: dropIn.iconImage}, fullscreenBase),
	...withProps({type: 'fullscreen', image: dropIn.image}, fullscreenBase),
	// QWTC-1928 end.
	// QWTC-1929 start.
	...withProps({type: 'overlay', image: dropIn.iconImage}, overlaySizes),
	...withProps({type: 'overlay', image: dropIn.image}, overlaySizes),
	// QWTC-1929 end.

	// With image and button
	...withProps({type: 'fullscreen', buttons: dropIn.oneButton, image: dropIn.image}, fullscreenBase),
	...withProps({type: 'fullscreen', buttons: dropIn.twoButtons, image: dropIn.image}, fullscreenBase),
	...withProps({type: 'overlay', buttons: dropIn.oneSmallButton, image: dropIn.image}, overlaySizes),
	...withProps({type: 'overlay', buttons: dropIn.twoSmallButtons, image: dropIn.image}, overlaySizes)
];

const alertWithComponentsTests = [
	// With other components
	...withProps({type: 'overlay'}, overlayColorTests),
	...withProps({type: 'fullscreen'}, overlayColorTests)
];

const alertExtendedTests = [
	...alertInitialTests,
	...alertWithButtonsTests,
	...alertWithImageTests,
	...alertWithComponentsTests
];

// Tallglyph validation (vi-VN): only text/title-bearing layouts can clip with taller glyphs
const alertTallglyphTests = [
	...withProps({type: 'fullscreen'}, fullscreenTests),                       // title / Alert! / Lorem / long-title
	...withProps({type: 'overlay'}, [overlayTests[0], overlayTests[9]]),       // short + long
	...withProps({type: 'fullscreen', buttons: dropIn.twoButtons}, fullscreenBase),
	...withProps({type: 'overlay', buttons: dropIn.twoSmallButtons}, overlayBase),
	...withProps({type: 'fullscreen', image: dropIn.image}, fullscreenBase),
	...withProps({type: 'overlay', image: dropIn.image}, overlayBase),
	...withProps({type: 'overlay'}, overlayColorTests.slice(0, 2))
];

// RTL: re-run the layouts that mirror. overlayPosition, every buttonDirection/count,
// image side, and component children
const alertRtlTests = [
	...withProps({type: 'fullscreen'}, [fullscreenTests[0], fullscreenTests[2]]),         // title + Lorem
	...withProps({type: 'overlay'}, [overlayTests[0], overlayTests[5], overlayTests[8]]), // Alert! + bottom-left + top-right
	...withProps({type: 'fullscreen', buttons: dropIn.twoButtons}, fullscreenBase),
	...withProps({type: 'overlay', buttons: dropIn.oneSmallButton}, overlayBase),
	...withProps({type: 'overlay', buttons: dropIn.twoSmallButtons}, overlayBase),
	...withProps({type: 'overlay', buttonDirection: 'auto', buttons: dropIn.threeSmallButtons}, overlayBase),
	...withProps({type: 'overlay', buttonDirection: 'horizontal', buttons: dropIn.fourSmallButtons}, overlayBase),
	...withProps({type: 'overlay', buttonDirection: 'vertical', buttons: dropIn.twoSmallButtons}, overlayBase),
	...withProps({type: 'fullscreen', image: dropIn.image}, fullscreenBase),
	...withProps({type: 'overlay', image: dropIn.iconImage}, overlayBase),
	...withProps({type: 'overlay', buttons: dropIn.twoSmallButtons, image: dropIn.image}, overlayBase),
	...withProps({type: 'overlay'}, overlayColorTests.slice(0, 2))
];

const alertPortraitTests = [
	...withConfig({type: 'fullscreen'}, [
		<Alert open buttons={dropIn.twoButtons} title="This is an Alert with a very long title for portrait orientation">
			{LoremString}
		</Alert>
	])
];

const AlertTests = [
	...alertQwtcTests,
	...alertExtendedTests,
	...withConfig({locale: 'vi-VN'}, alertTallglyphTests),
	...withConfig({locale: 'ar-SA'}, alertRtlTests),
	...withConfig({portrait: true}, alertPortraitTests)
];

export default AlertTests;
