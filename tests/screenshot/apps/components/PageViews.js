
import Item from '../../../../Item';
import PageViews, {Page} from '../../../../PageViews';
import {Panel, Header} from '../../../../Panels';

import {withConfig} from './utils';

import css from './PageViews.module.less';

const PageComponents = [
	<Page>Page 1</Page>,
	<Page>
		<Item>Item 1</Item>
		<Item>Item 2</Item>
	</Page>,
	<Page>Page 3</Page>
];

const panelHeader = <Header title="title of panel" subtitle="subtitle of panel" />;

const pageViewsSmokeTests = [
	{
		component: <Panel>{panelHeader}<PageViews index={0} pageIndicatorPosition="top">{PageComponents[0]}</PageViews></Panel>,
		wrapper: {full: true}
	},
	{
		component: <Panel>{panelHeader}<PageViews index={0} pageIndicatorPosition="top">{PageComponents}</PageViews></Panel>,
		wrapper: {full: true}
	},
	{
		component: <Panel>{panelHeader}<PageViews fullContents index={2} pageIndicatorPosition="top">{PageComponents}</PageViews></Panel>,
		wrapper: {full: true}
	},
	{
		component: <Panel>{panelHeader}<PageViews index={0}>{PageComponents}</PageViews></Panel>,
		wrapper: {full: true}
	},
	{
		component: <Panel>{panelHeader}<PageViews css={css} index={1}>{PageComponents}</PageViews></Panel>,
		wrapper: {full: true}
	},
	{
		component: <Panel>{panelHeader}<PageViews pageIndicatorType="number" index={2}>{PageComponents}</PageViews></Panel>,
		wrapper: {full: true}
	},
	{
		component: <Panel>{panelHeader}<PageViews pageIndicatorType="number" index={2} pageIndicatorPosition="top">{PageComponents}</PageViews></Panel>,
		wrapper: {full: true}
	}

];

const pageViewsExtendedTests = [
	{
		component: <Panel>{panelHeader}<PageViews index={1} pageIndicatorPosition="top">{PageComponents}</PageViews></Panel>,
		wrapper: {full: true},
		textSize: 'large'
	},
	{
		component: <Panel>{panelHeader}<PageViews index={2} pageIndicatorPosition="top">{PageComponents}</PageViews></Panel>,
		wrapper: {full: true}
	},
	{
		component: <Panel>{panelHeader}<PageViews index={0}>{PageComponents[0]}</PageViews></Panel>,
		wrapper: {full: true}
	},
	{
		component: <Panel>{panelHeader}<PageViews index={1}>{PageComponents}</PageViews></Panel>,
		wrapper: {full: true}
	},
	{
		component: <Panel>{panelHeader}<PageViews index={2}>{PageComponents}</PageViews></Panel>,
		wrapper: {full: true}
	},
	{
		component: <Panel>{panelHeader}<PageViews fullContents index={2}>{PageComponents}</PageViews></Panel>,
		wrapper: {full: true}
	},
	{
		component: <Panel>{panelHeader}<PageViews pageIndicatorType="number" index={0}>{PageComponents[0]}</PageViews></Panel>,
		wrapper: {full: true},
		textSize: 'large'
	},
	{
		component: <Panel>{panelHeader}<PageViews pageIndicatorType="number" index={0}>{PageComponents}</PageViews></Panel>,
		wrapper: {full: true}
	},
	{
		component: <Panel>{panelHeader}<PageViews pageIndicatorType="number" index={1}>{PageComponents}</PageViews></Panel>,
		wrapper: {full: true}
	},
	{
		component: <Panel>{panelHeader}<PageViews pageIndicatorType="number" pageIndicatorPosition="top" index={0}>{PageComponents[0]}</PageViews></Panel>,
		wrapper: {full: true}
	},
	{
		component: <Panel>{panelHeader}<PageViews pageIndicatorType="number" index={0} pageIndicatorPosition="top">{PageComponents}</PageViews></Panel>,
		wrapper: {full: true}
	},
	{
		component: <Panel>{panelHeader}<PageViews pageIndicatorType="number" index={1} pageIndicatorPosition="top">{PageComponents}</PageViews></Panel>,
		wrapper: {full: true}
	}
];

const pageViewsRtlTests = [
	// locale = 'ar-SA' — smoke representatives
	pageViewsSmokeTests[1],
	pageViewsSmokeTests[3],
	pageViewsExtendedTests[0]
];

const PageViewsTests = [
	...pageViewsSmokeTests,
	...pageViewsExtendedTests,
	...withConfig({locale: 'ar-SA'}, pageViewsRtlTests)
];

export default PageViewsTests;
