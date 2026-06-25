import Marquee from '../../../../Marquee';
import css from './Marquee.module.less';

const marqueeSmokeTests = [
	<Marquee />
];

const marqueeCommentedTests = [
	<div><Marquee className={css.marquee}>Text</Marquee></div>
];

const MarqueeTests = [
	...marqueeSmokeTests,
	...marqueeCommentedTests
];

export default MarqueeTests;
