import KeyGuide from '../../../../KeyGuide';

import img from '../../images/600x600.png';

import css from './KeyGuide.module.less';

import {withConfig} from './utils';

const keyGuideSmokeTests = [
	<KeyGuide open>{[{icon: 'red', children: 'red', key: 'a'}]}</KeyGuide>,
	<KeyGuide open>{[{icon: 'green', children: 'green', key: 'a'}]}</KeyGuide>,
	<KeyGuide open>{[{icon: 'blue', children: 'blue', key: 'a'}]}</KeyGuide>,
	<KeyGuide open>{[{icon: 'yellow', children: 'yellow', key: 'a'}]}</KeyGuide>,
	<KeyGuide open>{[{icon: 'plus', children: 'plus', key: 'a'}]}</KeyGuide>,
	<KeyGuide open>{[
		{icon: 'red', children: 'Red', key: 'a'},
		{icon: 'plus', children: 'plus', key: 'b'}
	]}</KeyGuide>,
	<KeyGuide arrowPosition="top" css={css} open>{{children: 'guide', imageSrc: img}}</KeyGuide>,
	<KeyGuide arrowPosition="bottom" css={css} open>{{children: 'guide', imageSrc: img}}</KeyGuide>,
	<KeyGuide arrowPosition="right" css={css} open>{{children: 'guide', imageSrc: img}}</KeyGuide>,
	<KeyGuide arrowPosition="left" css={css} open>{{children: 'guide', imageSrc: img}}</KeyGuide>,
	<KeyGuide arrowPosition="none" css={css} open>{{children: 'guide', imageSrc: img}}</KeyGuide>
];

const keyGuideRtlTests = [
	// RTL
	<KeyGuide open>{[
		{icon: 'red', children: 'Red', key: 'a'},
		{icon: 'plus', children: 'plus', key: 'b'}
	]}</KeyGuide>
];

const keyGuideLargeTextTests = [
	// Large Text — smoke representatives
	<KeyGuide open>{[{icon: 'red', children: 'red', key: 'a'}]}</KeyGuide>,
	<KeyGuide open>{[
		{icon: 'red', children: 'Red', key: 'a'},
		{icon: 'plus', children: 'plus', key: 'b'}
	]}</KeyGuide>,
	<KeyGuide arrowPosition="top" css={css} open>{{children: 'guide', imageSrc: img}}</KeyGuide>,
	<KeyGuide arrowPosition="left" css={css} open>{{children: 'guide', imageSrc: img}}</KeyGuide>
];

const KeyGuideTests = [
	...keyGuideSmokeTests,
	...withConfig({locale: 'ar-SA'}, keyGuideRtlTests),
	...withConfig({skinVariants: ['largeText']}, keyGuideLargeTextTests)
];

export default KeyGuideTests;
