import StarRatings from '../../../../StarRatings';

import {withConfig} from './utils';

const starRatingsSmokeTests = [
	// Selecting: no value shows the default 3 stars
	<StarRatings id="starRatings" />,
	<StarRatings id="starRatings" value={1} />,
	<StarRatings id="starRatings" value={5} />,
	// Read-only: whole, half and decimal ratings
	<StarRatings id="starRatings" readOnly value={0} />,
	<StarRatings id="starRatings" readOnly value={2.5} />,
	<StarRatings id="starRatings" readOnly value={3.3} />,
	<StarRatings id="starRatings" readOnly value={5} />,
	// Disabled
	<StarRatings id="starRatings" disabled />,
	<StarRatings id="starRatings" disabled readOnly value={3.5} />
];

// Every tenth of a star, to check the fill steps
const starRatingsFillStepTests = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((value) => (
	<StarRatings id="starRatings" max={1} readOnly value={value} />
));

// Focus lands on the first star. Values differ from the smoke tests so each screenshot is unique.
const starRatingsFocusTests = [
	<StarRatings id="starRatings" value={2} />,
	<StarRatings id="starRatings" value={4} />,
	<StarRatings id="starRatings" disabled value={2} />
];

const starRatingsOverlayModeTests = [
	<StarRatings id="starRatings" overlayMode />,
	<StarRatings id="starRatings" overlayMode readOnly value={2.5} />,
	<StarRatings id="starRatings" disabled overlayMode readOnly value={3.5} />
];

const starRatingsRtlTests = [
	<StarRatings id="starRatings" readOnly value={2.5} />,
	<StarRatings id="starRatings" value={3} />
];

const StarRatingsTests = [
	...starRatingsSmokeTests,
	...starRatingsFillStepTests,
	...withConfig({focus: true}, starRatingsFocusTests),
	...withConfig({wrapper: {light: true}}, starRatingsOverlayModeTests),
	...withConfig({wrapper: {light: true}, focus: true}, [
		<StarRatings id="starRatings" overlayMode value={2} />
	]),
	...withConfig({locale: 'ar-SA'}, starRatingsRtlTests),
	...withConfig({locale: 'ar-SA', focus: true}, [
		<StarRatings id="starRatings" value={1} />
	])
];

export default StarRatingsTests;
