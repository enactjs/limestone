import Item from '../../../../Item';
import Scroller from '../../../../Scroller';
import {FixedPopupPanels, Panel, Header} from '../../../../FixedPopupPanels';

import {withConfig, withProps} from './utils';

const stamp = (howMany, fn) => (new Array(howMany)).fill().map(fn);

// Wrapping the real component so `scaleToRem` is called within render rather than in module scope
function FixPopupPanels (props) {
	return (
		<FixedPopupPanels open {...props}>
			{props.children ? props.children : [
				<Panel key="panelIndex0">
					<Header title="Panel 1 - With Scroller" />
					<Item>Single Item</Item>
				</Panel>,
				<Panel key="panelIndex1">
					<Header title="Panel 2 - With Big Scroller" />
					<Scroller>
						{stamp(20, (i, idx) => <Item key={`item${idx}`}>Item {idx + 1}</Item>)}
					</Scroller>
				</Panel>
			]}
		</FixedPopupPanels>
	);
}

function FixPopupPanelsWithCenteredHeader (props) {
	return (
		<FixedPopupPanels open {...props}>
			{props.children ? props.children : [
				<Panel key="panelIndex0">
					<Header centered title="Panel 1 - With Scroller" />
					<Item>Single Item</Item>
				</Panel>,
				<Panel key="panelIndex1">
					<Header centered title="Panel 2 - With Big Scroller" />
					<Scroller>
						{stamp(20, (i, idx) => <Item key={`item${idx}`}>Item {idx + 1}</Item>)}
					</Scroller>
				</Panel>
			]}
		</FixedPopupPanels>
	);
}

const fixedPopupPanelsQwtcTests = [
	// [QWTC-2429]
	{
		wrapper: {full: true},
		title: 'with standard Panel Components',
		component: <FixPopupPanels />
	},
	{
		wrapper: {full: true},
		title: 'with standard Panel Components positioned left',
		component: <FixPopupPanels position="left" />
	},
	{
		wrapper: {full: true},
		title: 'with transparent scrim',
		component: <FixPopupPanels scrimType="transparent" />
	},
	{
		wrapper: {full: true},
		title: 'with transparent scrim positioned left',
		component: <FixPopupPanels scrimType="transparent" position="left" />
	},
	{
		wrapper: {full: true},
		title: 'with standard Panel Components index 1',
		component: <FixPopupPanels index={1} />
	},
	{
		wrapper: {full: true},
		title: 'with standard Panel Components index 1 positioned left',
		component: <FixPopupPanels index={1} position="left" />
	},
	{
		wrapper: {full: true},
		title: 'with half width',
		component: <FixPopupPanels width="half" />
	},
	{
		wrapper: {full: true},
		title: 'with half width positioned left',
		component: <FixPopupPanels width="half" position="left" />
	},
	{
		wrapper: {full: true},
		title: 'with centered header',
		component: <FixPopupPanelsWithCenteredHeader />
	}
];

const fixedPopupPanelsSmokeTests = [
	{
		wrapper: {full: true},
		component: <FixPopupPanels>{null}</FixPopupPanels>
	}
];

const fixedPopupPanelsCommentedTests = [
	...withProps(
		{fullHeight: true},
		fixedPopupPanelsQwtcTests.map(o => ({...o, title: `${o.title} fullHeight`}))
	)
];

const fixedPopupPanelsRtlTests = [
	// [QWTC-2429]
	...withConfig(
		{locale: 'ar-SA'},
		fixedPopupPanelsQwtcTests.map(o => ({...o, title: `locale = ar-SA, ${o.title}`}))
	)
];

const FixedPopupPanelsTests = [
	...fixedPopupPanelsSmokeTests,
	...fixedPopupPanelsQwtcTests,
	...fixedPopupPanelsCommentedTests,
	...fixedPopupPanelsRtlTests
];

export default FixedPopupPanelsTests;
