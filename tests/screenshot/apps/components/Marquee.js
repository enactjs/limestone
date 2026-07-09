import Marquee from '../../../../Marquee';

import {withTallglyphLocale, TallglyphLatin, TallglyphMultiScript} from './utils';

import css from './Marquee.module.less';

const marqueeSmokeTests = [
	<Marquee />
];

const marqueeExtendedTests = [
	<div><Marquee className={css.marquee}>Text</Marquee></div>
];

const marqueeTallglyphTests = [
	<div><Marquee className={css.marquee}>{TallglyphMultiScript}</Marquee></div>,
	<div><Marquee className={css.marquee}>{TallglyphLatin}</Marquee></div>
];

const MarqueeTests = [
	...marqueeSmokeTests,
	...marqueeExtendedTests,
	...withTallglyphLocale(marqueeTallglyphTests)
];

export default MarqueeTests;
