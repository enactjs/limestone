import Region from '../../../../Region';

const regionSmokeTests = [
	<Region title="Region" />,
	<Region title="Region">Region Body</Region>
];

const regionRtlTests = [
	{
		locale: 'ar-SA',
		component: <Region title="Region" />
	},
	{
		locale: 'ar-SA',
		component: <Region title="Region">Region Body</Region>
	}
];

const RegionTests = [
	...regionSmokeTests,
	...regionRtlTests
];

export default RegionTests;
