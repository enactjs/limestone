import Button from '../../../../Button';
import {TabLayout, Tab} from '../../../../TabLayout';

import {pick, withConfig} from './utils';

const SimpleTab = (props) => (
	<Tab {...props}>
		<div>{`View ${props.title}`}</div>
	</Tab>
);

const tabs = [
	SimpleTab({title: 'One'}),
	SimpleTab({title: 'Two'}),
	SimpleTab({title: 'Three'}),
	SimpleTab({title: 'Four'}),
	SimpleTab({title: 'Five'}),
	SimpleTab({title: 'Six'})
];

const tabsForScroll = [
	SimpleTab({title: 'One'}),
	SimpleTab({title: 'Two'}),
	SimpleTab({title: 'Three'}),
	SimpleTab({title: 'Four'}),
	SimpleTab({title: 'Five'}),
	SimpleTab({title: 'Six'}),
	SimpleTab({title: 'Seven'}),
	SimpleTab({title: 'Eight'}),
	SimpleTab({title: 'Nine'}),
	SimpleTab({title: 'Ten'}),
	SimpleTab({title: 'Eleven'}),
	SimpleTab({title: 'Twelve'}),
	SimpleTab({title: 'Thirteen'}),
	SimpleTab({title: 'Fourteen'})
];

const tabsWithIcons = [
	SimpleTab({title: 'One', icon: 'star'}),
	SimpleTab({title: 'Two', icon: 'home'}),
	SimpleTab({title: 'Three', icon: 'plug'}),
	SimpleTab({title: 'Four', icon: 'lock'}),
	SimpleTab({title: 'Five', icon: 'info'}),
	SimpleTab({title: 'Six', icon: 'picture'})
];

const oneTabWithIcons = [
	SimpleTab({title: 'One', icon: 'star'}),
	SimpleTab({title: 'Two'}),
	SimpleTab({title: 'Three'}),
	SimpleTab({title: 'Four'}),
	SimpleTab({title: 'Five'}),
	SimpleTab({title: 'Six'})
];

const someTabsWithIcons = [
	SimpleTab({title: 'One', icon: 'star'}),
	SimpleTab({title: 'Two'}),
	SimpleTab({title: 'Three', icon: 'plug'}),
	SimpleTab({title: 'Four', icon: 'lock'}),
	SimpleTab({title: 'Five'}),
	SimpleTab({title: 'Six', icon: 'picture'})
];

const tabsWithIconsDisabled = [
	SimpleTab({title: 'One', icon: 'star'}),
	SimpleTab({disabled: true, title: 'Two', icon: 'home'}),
	SimpleTab({title: 'Three', icon: 'plug'}),
	SimpleTab({title: 'Four', icon: 'lock'}),
	SimpleTab({title: 'Five', icon: 'info'}),
	SimpleTab({title: 'Six', icon: 'picture'})
];

const wrapperFull = {wrapper: {full: true}};

const tabLayoutSmokeTests = [
	{
		component: <TabLayout>{tabs}</TabLayout>,
		...wrapperFull
	},
	{
		component: <TabLayout selected={0}>{tabs}</TabLayout>,
		...wrapperFull,
		focus: true
	},
	{
		component: <TabLayout>{tabsWithIcons}</TabLayout>,
		...wrapperFull
	},
	{
		component: <TabLayout>{someTabsWithIcons}</TabLayout>,
		...wrapperFull
	},
	{
		component: <TabLayout>{oneTabWithIcons}</TabLayout>,
		...wrapperFull
	},
	{
		component: <TabLayout collapsed>{tabs}</TabLayout>,
		...wrapperFull
	},
	{
		component: <TabLayout collapsed selected={0}>{tabsWithIconsDisabled}</TabLayout>,
		...wrapperFull,
		focus: true
	},
	{
		component: <TabLayout orientation="horizontal" selected={3}>{tabs}</TabLayout>,
		...wrapperFull
	},
	{
		component: <TabLayout anchorTo="left">{tabs}</TabLayout>,
		...wrapperFull
	},
	{
		component: <TabLayout type="popup">{tabs}</TabLayout>,
		...wrapperFull
	},
	{
		component: <TabLayout tabSize={500}>{tabs}</TabLayout>,
		...wrapperFull
	},
	{
		component: <TabLayout index={13}>{tabsForScroll}</TabLayout>,
		...wrapperFull
	},
	{
		component: <TabLayout index={13} orientation="horizontal">{tabsForScroll}</TabLayout>,
		...wrapperFull
	}
];

const tabLayoutQwtcTests = [
	// start of [QWTC-2616]
	<TabLayout orientation="vertical">
		{Array.from({length: 20}, (v, i) => (
			<TabLayout.Tab
				disabled
				icon="backward"
				title={`Tab ${i}`}
				key={`tab${i}`}
			>
				<Button>Tab {i} Top</Button>
			</TabLayout.Tab>
		))}
	</TabLayout>,
	<TabLayout collapsed orientation="vertical">
		{Array.from({length: 20}, (v, i) => (
			<TabLayout.Tab
				disabled
				icon="backward"
				title={`Tab ${i}`}
				key={`tab${i}`}
			>
				<Button>Tab {i} Top</Button>
			</TabLayout.Tab>
		))}
	</TabLayout>
	// end of [QWTC-2616]
];

const tabLayoutRtlTests = pick(tabLayoutSmokeTests, 1, 2, 5, 7);

const tabLayoutLargeTextTests = pick(tabLayoutSmokeTests, 1, 5).map(t => ({
	...t,
	textSize: 'large'
}));

const TabLayoutTests = [
	...tabLayoutSmokeTests,
	...tabLayoutQwtcTests,
	...tabLayoutLargeTextTests,
	...withConfig({locale: 'ar-SA'}, tabLayoutRtlTests)
];

export default TabLayoutTests;
