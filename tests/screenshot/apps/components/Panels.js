import Panels, {Panel, Header} from '../../../../Panels';

import {withConfig} from './utils';

const panelsWrapper = {full: true};

// Panel components to show in the Panels
const panelComponents = [
	<Panel key="p1">Hello</Panel>,
	<Panel key="p2"><Header title="Hello" />The body</Panel>,
	<Panel key="p3">Panel 3</Panel>
];

const panelsSmokeTests = [
	{
		component: <Panels />,
		wrapper: panelsWrapper
	},
	{
		title: 'with standard Panel Components',
		component: <Panels>{panelComponents}</Panels>,
		wrapper: panelsWrapper
	},
	{
		title: 'with standard Panel Components index 1',
		component: <Panels index={1}>{panelComponents}</Panels>,
		wrapper: panelsWrapper
	},
	// Display 'Panel 3'
	{
		title: 'with standard Panel Components index 2',
		component: <Panels index={2}>{panelComponents}</Panels>,
		wrapper: panelsWrapper
	},
	{
		title: 'with header and no close button',
		component: <Panels index={1} noCloseButton>{panelComponents}</Panels>,
		wrapper: panelsWrapper
	},
	{
		title: 'with header and no back button',
		component: <Panels index={1} noBackButton>{panelComponents}</Panels>,
		wrapper: panelsWrapper
	},
	{
		title: 'with opaque back and close button',
		component: <Panels index={1} backButtonBackgroundOpacity="opaque" closeButtonBackgroundOpacity="opaque">{panelComponents}</Panels>,
		wrapper: panelsWrapper
	}
];

const panelsRtlTests = [
	// RTL
	<Panels />,
	<Panels>{panelComponents}</Panels>,
	<Panels index={1}>{panelComponents}</Panels>,
	// Display 'Panel 3'
	<Panels index={2}>{panelComponents}</Panels>,
	<Panels index={1} noCloseButton>{panelComponents}</Panels>,
	<Panels index={1} noBackButton>{panelComponents}</Panels>,
	<Panels index={1} backButtonBackgroundOpacity="opaque" closeButtonBackgroundOpacity="opaque">{panelComponents}</Panels>
];

const PanelsTests = [
	...panelsSmokeTests,
	...withConfig({locale: 'ar-SA', wrapper: panelsWrapper}, panelsRtlTests)
];

export default PanelsTests;
