import Region from '../../../../Region';

import {withConfig} from './utils';

const regionSmokeTests = [
	<Region title="Region" />,
	<Region title="Region">Region Body</Region>
];

const RegionTests = [
	...regionSmokeTests,
	...withConfig({locale: 'ar-SA'}, regionSmokeTests)
];

export default RegionTests;
