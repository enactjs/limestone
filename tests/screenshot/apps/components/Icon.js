import Icon from '../../../../Icon';

import buttonstate from '../../images/button-state.svg';

const iconSmokeTests = [
	<Icon>minus</Icon>, // default `size` prop is "small"
	<Icon size="large">minus</Icon>,
	<Icon>💣</Icon>, // [QWTC-2251] testing 'custom-icon' using Unicode character
	<Icon>{buttonstate}</Icon>,  // [QWTC-2251]
	<Icon flip="vertical">transponder</Icon>,
	<Icon flip="horizontal">transponder</Icon>,
	<Icon flip="both">rotate</Icon>,
	<Icon flip="auto">rotate</Icon>
];

const iconLargeTextTests = [
	{
		textSize: 'large',
		component: <Icon>plus</Icon>
	},
	{
		textSize: 'large',
		component: <Icon size="large">plus</Icon>
	}
];

const iconRtlTests = [
	// *************************************************************
	// locale = 'ar-SA'
	// *************************************************************
	// [QWTC-1856] - Icon Functionality RTL
	{
		locale: 'ar-SA',
		component: <Icon>minus</Icon>
	},
	// end of [QWTC-1856]
	{
		locale: 'ar-SA',
		component: <Icon>💣</Icon>
	},
	{
		locale: 'ar-SA',
		component: <Icon flip="auto">rotate</Icon>
	},
	{
		locale: 'ar-SA',
		textSize: 'large',
		component: <Icon>plus</Icon>
	}
];

const IconTests = [
	...iconSmokeTests,
	...iconLargeTextTests,
	...iconRtlTests
];

export default IconTests;
