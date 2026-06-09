import Icon from '../../../../Icon';

import {withConfig} from './utils';

import buttonstate from '../../images/button-state.svg';

const iconSmokeTests = [
	<Icon>minus</Icon>, // default `size` prop is "small"
	<Icon size="tiny">minus</Icon>,
	<Icon size="medium">minus</Icon>,
	<Icon size="large">minus</Icon>,
	<Icon size={120}>minus</Icon>,
	<Icon flip="vertical">transponder</Icon>,
	<Icon flip="vertical" size="tiny">transponder</Icon>,
	<Icon flip="vertical" size="medium">transponder</Icon>,
	<Icon flip="vertical" size="large">transponder</Icon>,
	<Icon flip="horizontal">transponder</Icon>,
	<Icon flip="horizontal" size="tiny">transponder</Icon>,
	<Icon flip="horizontal" size="medium">transponder</Icon>,
	<Icon flip="horizontal" size="large">transponder</Icon>,
	<Icon flip="both">rotate</Icon>,
	<Icon flip="both" size="tiny">rotate</Icon>,
	<Icon flip="both" size="medium">rotate</Icon>,
	<Icon flip="both" size="large">rotate</Icon>,
	<Icon flip="auto">rotate</Icon>,
	{
		locale: 'ar-SA',
		component: <Icon flip="auto">rotate</Icon>
	},
	{
		textSize: 'large',
		component: <Icon>plus</Icon>
	},
	{
		textSize: 'large',
		component: <Icon size="tiny">plus</Icon>
	},
	{
		textSize: 'large',
		component: <Icon size="medium">plus</Icon>
	},
	{
		textSize: 'large',
		component: <Icon size="large">plus</Icon>
	}
];

// QWTC-documented scenarios (kept explicitly for Jira traceability).
const iconQwtcTests = [
	<Icon>💣</Icon>, // [QWTC-2251] testing 'custom-icon' using Unicode character
	<Icon size="tiny">💣</Icon>,
	<Icon size="medium">💣</Icon>,
	<Icon size="large">💣</Icon>,
	<Icon size={120}>💣</Icon>,
	<Icon>{buttonstate}</Icon>,  // [QWTC-2251]
	<Icon size="tiny">{buttonstate}</Icon>,
	<Icon size="medium">{buttonstate}</Icon>,
	<Icon size="large">{buttonstate}</Icon>,
	<Icon size={120}>{buttonstate}</Icon>
];

// [QWTC-1856] - Icon Functionality RTL
const iconRtlTests = [
	// *************************************************************
	// locale = 'ar-SA'
	// *************************************************************
	<Icon>minus</Icon>,
	<Icon size="tiny">minus</Icon>,
	<Icon size="medium">minus</Icon>,
	<Icon size="large">minus</Icon>,
	<Icon>💣</Icon>,  // testing 'custom-icon' using Unicode character
	<Icon size="tiny">💣</Icon>,
	<Icon size="medium">💣</Icon>,
	<Icon size="large">💣</Icon>,
	<Icon>{buttonstate}</Icon>,
	<Icon size="tiny">{buttonstate}</Icon>,
	<Icon size="medium">{buttonstate}</Icon>,
	<Icon size="large">{buttonstate}</Icon>,
	<Icon flip="vertical">transponder</Icon>,
	<Icon flip="vertical" size="tiny">transponder</Icon>,
	<Icon flip="vertical" size="medium">transponder</Icon>,
	<Icon flip="vertical" size="large">transponder</Icon>,
	<Icon flip="horizontal">transponder</Icon>,
	<Icon flip="horizontal" size="tiny">transponder</Icon>,
	<Icon flip="horizontal" size="medium">transponder</Icon>,
	<Icon flip="horizontal" size="large">transponder</Icon>,
	<Icon flip="both">rotate</Icon>,
	<Icon flip="both" size="tiny">rotate</Icon>,
	<Icon flip="both" size="medium">rotate</Icon>,
	<Icon flip="both" size="large">rotate</Icon>,
	{
		textSize: 'large',
		component: <Icon>plus</Icon>
	},
	{
		textSize: 'large',
		component: <Icon size="tiny">plus</Icon>
	},
	{
		textSize: 'large',
		component: <Icon size="medium">plus</Icon>
	},
	{
		textSize: 'large',
		component: <Icon size="large">plus</Icon>
	}
];
// end of [QWTC-1856]

const IconTests = [
	...iconSmokeTests,
	...iconQwtcTests,
	...withConfig({locale: 'ar-SA'}, iconRtlTests)
];

export default IconTests;
